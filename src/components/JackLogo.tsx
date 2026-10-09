import React, { useEffect, useId, useRef } from 'react';

// Rounded triangle outline (viewBox 0 0 100 100), point up, wide soft base
const SHAPE =
  'M50 6 C58 6 63 10 68 18 L92 60 C97 70 97 80 91 86 C85 92 76 94 50 94 C24 94 15 92 9 86 C3 80 3 70 8 60 L32 18 C37 10 42 6 50 6 Z';

// Colour blobs placed around the centre - mirrors the segments of the brand mark
const OUTER_BLOBS = [
  { cx: 28, cy: 40, r: 26, fill: '#8b5cf6' }, // purple, top-left
  { cx: 50, cy: 22, r: 22, fill: '#22c55e' }, // green, top
  { cx: 72, cy: 40, r: 26, fill: '#3b82f6' }, // blue, top-right
  { cx: 72, cy: 76, r: 26, fill: '#22d3ee' }, // cyan, bottom-right
  { cx: 50, cy: 88, r: 22, fill: '#ec4899' }, // magenta, bottom
  { cx: 28, cy: 76, r: 26, fill: '#f0abfc' }, // pink, bottom-left
];
const INNER_BLOBS = [
  { cx: 38, cy: 58, r: 16, fill: '#a78bfa' },
  { cx: 62, cy: 58, r: 16, fill: '#67e8f9' },
  { cx: 50, cy: 36, r: 14, fill: '#4ade80' },
];

// Eyes (viewBox units): white eyeballs with pupils that look towards the mouse
const EYES = [
  { cx: 39, cy: 60 },
  { cx: 61, cy: 60 },
];
const EYE_RX = 8;
const EYE_RY = 9.5;
const PUPIL_R = 4.2;
const PUPIL_TRAVEL = 3.6; // how far a pupil can move from the eye's centre

// One shared mousemove listener for every Jack on the page
type MouseListener = (x: number, y: number) => void;
const mouseListeners = new Set<MouseListener>();
let mouseAttached = false;
const onMouse = (fn: MouseListener) => {
  mouseListeners.add(fn);
  if (!mouseAttached && typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => mouseListeners.forEach((l) => l(e.clientX, e.clientY)), { passive: true });
    mouseAttached = true;
  }
  return () => {
    mouseListeners.delete(fn);
  };
};

/**
 * Jack's animated mark - Siri-style: blurred colour blobs swirl inside the rounded triangle
 * with a soft colour halo, plus a cartoon face whose eyes follow the mouse and blink now and then.
 * `active` (thinking / answering) speeds the swirl up and brightens the glow.
 */
const JackLogo: React.FC<{ size?: number; active?: boolean; className?: string }> = ({
  size = 32,
  active = false,
  className = '',
}) => {
  const id = useId().replace(/:/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  // Pupils are moved directly on the DOM (no React re-render per mouse move)
  useEffect(
    () =>
      onMouse((mx, my) => {
        const svg = svgRef.current;
        const pupils = pupilsRef.current;
        if (!svg || !pupils) return;
        const box = svg.getBoundingClientRect();
        const dx = mx - (box.left + box.width / 2);
        const dy = my - (box.top + box.height * 0.6); // eyes sit a little below the middle
        const dist = Math.hypot(dx, dy) || 1;
        // Ease in over the first ~120px so pupils don't snap to the edge for a nearby cursor
        const reach = PUPIL_TRAVEL * Math.min(1, dist / 120);
        pupils.style.transform = `translate(${((dx / dist) * reach).toFixed(2)}px, ${((dy / dist) * reach).toFixed(2)}px)`;
      }),
    []
  );

  return (
    <span
      className={`jack-logo relative inline-flex flex-shrink-0 ${active ? 'jack-logo--active' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Colour halo behind the mark */}
      <span className="jack-logo__halo absolute -inset-[18%] rounded-full" />
      <svg ref={svgRef} viewBox="0 0 100 100" width={size} height={size} className="relative overflow-visible">
        <defs>
          <clipPath id={`jack-clip-${id}`}>
            <path d={SHAPE} />
          </clipPath>
          <filter id={`jack-blur-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <g clipPath={`url(#jack-clip-${id})`}>
          <rect width="100" height="100" fill="#c4b5fd" />
          <g className="jack-logo__swirl" filter={`url(#jack-blur-${id})`}>
            {OUTER_BLOBS.map((b) => (
              <circle key={b.fill} {...b} />
            ))}
          </g>
          <g className="jack-logo__swirl-reverse" filter={`url(#jack-blur-${id})`} style={{ mixBlendMode: 'screen' }}>
            {INNER_BLOBS.map((b) => (
              <circle key={b.fill} {...b} />
            ))}
          </g>
        </g>

        {/* Face */}
        <g className="jack-logo__eyes">
          {EYES.map((e) => (
            <ellipse key={e.cx} cx={e.cx} cy={e.cy} rx={EYE_RX} ry={EYE_RY} fill="#fff" />
          ))}
          <g ref={pupilsRef} className="jack-logo__pupils">
            {EYES.map((e) => (
              <g key={e.cx}>
                <circle cx={e.cx} cy={e.cy + 0.5} r={PUPIL_R} fill="#111" />
                <circle cx={e.cx + 1.4} cy={e.cy - 1} r={1.3} fill="#fff" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </span>
  );
};

export default JackLogo;
