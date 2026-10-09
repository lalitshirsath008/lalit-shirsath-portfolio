import React, { useCallback, useEffect, useRef, useState } from 'react';

// Largest on-screen crop box, px
const BOX_MAX_W = 340;
const BOX_MAX_H = 340;
const MAX_ZOOM = 5; // relative to "fill"

export interface CropAspect {
  label: string;
  ratio: number | 'original'; // width / height, or the image's own shape
}

/** How a cropped image is framed and saved. */
export interface CropConfig {
  title: string;
  aspects: CropAspect[]; // first one is the default
  outputMax: number; // longest side of the saved image, px (never upscaled past the source)
  type: 'image/webp' | 'image/jpeg';
  quality: number;
  maxChars: number; // data-URL size budget - Firestore docs cap at 1 MiB
}

export const LOGO_CROP: CropConfig = {
  title: 'Adjust logo',
  aspects: [{ label: 'Square', ratio: 1 }],
  outputMax: 256,
  type: 'image/webp', // keeps transparent logo backgrounds transparent
  quality: 0.92,
  maxChars: 150_000,
};

export const COVER_CROP: CropConfig = {
  title: 'Adjust cover image',
  aspects: [
    { label: '16:10', ratio: 16 / 10 },
    { label: '16:9', ratio: 16 / 9 },
    { label: '4:3', ratio: 4 / 3 },
    { label: 'Square', ratio: 1 },
  ],
  outputMax: 1100,
  type: 'image/webp',
  quality: 0.8,
  maxChars: 300_000, // inline on the project doc, which the public site loads in full
};

export const CERTIFICATE_CROP: CropConfig = {
  title: 'Adjust certificate',
  aspects: [
    { label: 'Original', ratio: 'original' },
    { label: 'A4 landscape', ratio: Math.SQRT2 },
    { label: 'A4 portrait', ratio: Math.SQRT1_2 },
    { label: '4:3', ratio: 4 / 3 },
  ],
  outputMax: 1500, // the text on certificates should stay readable
  type: 'image/webp',
  quality: 0.85,
  maxChars: 450_000,
};

export const SIDE_IMAGE_CROP: CropConfig = {
  title: 'Adjust card photo',
  aspects: [
    { label: '3:4', ratio: 3 / 4 },
    { label: 'Square', ratio: 1 },
    { label: '4:3', ratio: 4 / 3 },
  ],
  outputMax: 900,
  type: 'image/webp',
  quality: 0.8,
  maxChars: 250_000, // inline on the experience/education doc, which the public site loads in full
};

export const PHOTO_CROP: CropConfig = {
  title: 'Adjust photo',
  aspects: [
    { label: 'Original', ratio: 'original' },
    { label: 'Square', ratio: 1 },
    { label: '4:5', ratio: 4 / 5 },
    { label: '16:9', ratio: 16 / 9 },
  ],
  outputMax: 1600,
  type: 'image/jpeg',
  quality: 0.82,
  maxChars: 900_000, // one photo per Firestore doc
};

interface Props {
  src: string;
  config: CropConfig;
  onCancel: () => void;
  onSave: (dataUrl: string) => void;
}

// Crop editor: pick a shape, drag to position, slider / wheel to zoom. Zooming below
// "fill" leaves empty margins (transparent for WebP, white for JPEG), so a whole wide
// image can still fit a narrow frame.
const ImageCropper: React.FC<Props> = ({ src, config, onCancel, onSave }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [aspect, setAspect] = useState<CropAspect>(config.aspects[0]);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // image centre relative to box centre
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const [error, setError] = useState('');

  const ratio = aspect.ratio === 'original' ? (size ? size.w / size.h : 1) : aspect.ratio;
  const boxW = Math.round(Math.min(BOX_MAX_W, BOX_MAX_H * ratio));
  const boxH = Math.round(boxW / ratio);

  const fillScale = size ? Math.max(boxW / size.w, boxH / size.h) : 1;
  const fitScale = size ? Math.min(boxW / size.w, boxH / size.h) : 1;
  const minScale = fitScale * 0.6;
  const maxScale = fillScale * MAX_ZOOM;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => setError("Couldn't open that image.");
    img.src = src;
  }, [src]);

  // Start at "fill" whenever the image loads or the shape changes
  useEffect(() => {
    setScale(fillScale);
    setOffset({ x: 0, y: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, boxW, boxH]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  // Keep at least part of the image inside the box so it can't be dragged away and lost
  const clamp = (o: { x: number; y: number }, s: number) => {
    if (!size) return o;
    const limX = Math.abs(size.w * s - boxW) / 2 + boxW * 0.25;
    const limY = Math.abs(size.h * s - boxH) / 2 + boxH * 0.25;
    return { x: Math.max(-limX, Math.min(limX, o.x)), y: Math.max(-limY, Math.min(limY, o.y)) };
  };

  const zoomTo = (s: number) => {
    const next = Math.max(minScale, Math.min(maxScale, s));
    setScale(next);
    setOffset((o) => clamp(o, next));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset(clamp({ x: d.ox + e.clientX - d.px, y: d.oy + e.clientY - d.py }, scale));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const save = () => {
    const img = imgRef.current;
    if (!img || !size) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Could not process the image in this browser.');
      return;
    }
    // Output px per on-screen px: aim for outputMax, but don't invent detail the source doesn't have
    let k = Math.min(config.outputMax / Math.max(boxW, boxH), 1 / scale);
    for (let attempt = 0; attempt < 6; attempt++) {
      canvas.width = Math.max(1, Math.round(boxW * k));
      canvas.height = Math.max(1, Math.round(boxH * k));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (config.type === 'image/jpeg') {
        ctx.fillStyle = '#fff'; // JPEG has no transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      const w = size.w * scale;
      const h = size.h * scale;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, (boxW / 2 + offset.x - w / 2) * k, (boxH / 2 + offset.y - h / 2) * k, w * k, h * k);
      const data = canvas.toDataURL(config.type, Math.max(0.5, config.quality - attempt * 0.05));
      if (data.length <= config.maxChars) {
        onSave(data);
        return;
      }
      k *= 0.85; // still too big: shrink and retry
    }
    setError('This image is too detailed to store - try a smaller crop or a different image.');
  };

  const w = size ? size.w * scale : 0;
  const h = size ? size.h * scale : 0;
  const sliderPos = size ? Math.log(scale / minScale) / Math.log(maxScale / minScale) : 0;
  const ghostButton =
    'flex-1 px-3 py-1.5 rounded-full border border-white/15 text-white/70 text-xs font-medium hover:text-white hover:border-white/40 transition-colors duration-200';

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/15 bg-neutral-950 p-5 shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-semibold text-white mb-1">{config.title}</h4>
        <p className="text-white/45 text-xs mb-4">Drag to move · scroll or use the slider to zoom</p>

        {config.aspects.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {config.aspects.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => setAspect(a)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                  aspect.label === a.label
                    ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                    : 'border-white/15 text-white/55 hover:text-white hover:border-white/40'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <div
          className="relative mx-auto overflow-hidden rounded-xl touch-none select-none cursor-grab active:cursor-grabbing"
          style={{
            width: boxW,
            height: boxH,
            // Checkerboard shows which areas will stay empty
            backgroundColor: '#fff',
            backgroundImage:
              'linear-gradient(45deg,#e5e5e5 25%,transparent 25%),linear-gradient(-45deg,#e5e5e5 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e5e5 75%),linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={(e) => zoomTo(scale * (e.deltaY < 0 ? 1.08 : 1 / 1.08))}
        >
          {size && (
            <img
              src={src}
              alt=""
              draggable={false}
              className="absolute max-w-none pointer-events-none"
              style={{ width: w, height: h, left: boxW / 2 + offset.x - w / 2, top: boxH / 2 + offset.y - h / 2 }}
            />
          )}
          <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-teal-400/70 pointer-events-none" />
        </div>

        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={sliderPos}
          disabled={!size}
          onChange={(e) => zoomTo(minScale * Math.pow(maxScale / minScale, Number(e.target.value)))}
          className="w-full mt-4 accent-teal-400"
          aria-label="Zoom"
        />

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              setScale(fitScale);
              setOffset({ x: 0, y: 0 });
            }}
            className={ghostButton}
          >
            Show whole image
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(fillScale);
              setOffset({ x: 0, y: 0 });
            }}
            className={ghostButton}
          >
            Fill frame
          </button>
        </div>

        {error && <p className="mt-3 text-red-400 text-xs">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={save}
            disabled={!size}
            className="flex-1 px-5 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/85 transition-colors duration-200 disabled:opacity-50"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-5 py-2 text-white/70 font-medium text-sm rounded-full border border-white/15 hover:text-white hover:border-white/40 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

/**
 * Wires an upload button to the crop editor. A fresh upload is cropped from the original
 * file (full quality); `openSrc` re-crops an image that's already saved.
 */
export function useCropper(config: CropConfig, onApply: (data: string) => void) {
  const [src, setSrc] = useState<string | null>(null);

  const close = useCallback(() => {
    setSrc((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const openFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) return `"${file.name}" isn't an image.`;
    setSrc(URL.createObjectURL(file));
    return null;
  };

  const element = src ? (
    <ImageCropper
      src={src}
      config={config}
      onCancel={close}
      onSave={(data) => {
        onApply(data);
        close();
      }}
    />
  ) : null;

  return { openFile, openSrc: setSrc, element };
}
