import React, { useEffect, useRef, useState } from 'react';
import { CERTIFICATE_CROP, COVER_CROP, SIDE_IMAGE_CROP, CropConfig, LOGO_CROP, useCropper } from './ImageCropper';
import { ICON_CATEGORIES, ICON_NAMES, IconCategory, getIcon, iconNamesIn } from '../lib/icons';
import { IconNamePair, LogoFit } from '../lib/types';

const inputClass =
  'block w-full rounded-lg bg-white/[0.03] border border-white/15 px-3 py-2 text-white placeholder-white/30 focus:border-white/50 focus:outline-none transition-colors duration-200';

const removeButtonClass =
  'px-3 rounded-lg border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 hover:border-red-500/60 transition-colors duration-200 flex-shrink-0';

const addLinkClass = 'text-xs font-semibold text-white/60 hover:text-white transition-colors duration-200';

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-1">{label}</label>
    {children}
  </div>
);

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={inputClass}
  />
);

export const TextAreaInput: React.FC<{ value: string; onChange: (v: string) => void; rows?: number }> = ({
  value,
  onChange,
  rows = 3,
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    className={`${inputClass} resize-none`}
  />
);

export const NumberInput: React.FC<{ value: number; onChange: (v: number) => void; min?: number; max?: number }> = ({
  value,
  onChange,
  min,
  max,
}) => (
  <input
    type="number"
    value={value}
    min={min}
    max={max}
    onChange={(e) => onChange(Number(e.target.value))}
    className={inputClass}
  />
);

// "FaChartPie" -> "ChartPie" - the library prefix is noise in the picker
const iconLabel = (name: string) => name.replace(/^(Vsc|Fa|Si|Io|Md|Tb|Bs|Lu|Gi|Ri|Pi|Di)/, '');

// Custom picker instead of a native <select>: native option lists ignore the dark
// theme (white text on a white popup) and can't show the icons themselves.
export const IconSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | 'All'>('All');
  const rootRef = useRef<HTMLDivElement>(null);
  const Preview = getIcon(value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  // Search always spans every icon; the category chips only narrow browsing
  const pool = q || category === 'All' ? ICON_NAMES : iconNamesIn(category);
  const matches = q ? pool.filter((n) => n.toLowerCase().includes(q)) : pool;

  const pick = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center gap-3 text-left`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Preview className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 truncate">{iconLabel(value)}</span>
        <span className={`text-white/40 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-[min(26rem,calc(100vw-2rem))] rounded-xl border border-white/15 bg-neutral-950 shadow-2xl p-3">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches.length > 0) {
                e.preventDefault();
                pick(matches[0]);
              }
            }}
            placeholder="Search icons…"
            className={`${inputClass} mb-3`}
          />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(['All', ...ICON_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors duration-150 ${
                  category === c && !q
                    ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                    : 'border-white/15 text-white/55 hover:text-white hover:border-white/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div role="listbox" className="grid grid-cols-4 gap-1.5 max-h-64 overflow-y-auto pr-1">
            {matches.map((n) => {
              const Icon = getIcon(n);
              const selected = n === value;
              return (
                <button
                  key={n}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  title={n}
                  onClick={() => pick(n)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg px-1 py-2.5 border transition-colors duration-150 ${
                    selected
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                      : 'border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] leading-tight w-full truncate text-center">{iconLabel(n)}</span>
                </button>
              );
            })}
          </div>
          {matches.length === 0 && <p className="text-center text-sm text-white/40 py-6">No icons match "{query}"</p>}
        </div>
      )}
    </div>
  );
};

// Optional uploaded logo. Cleared to '' rather than undefined, since Firestore rejects undefined fields.
export const LogoInput: React.FC<{
  value?: string;
  onChange: (v: string) => void;
  fit?: LogoFit;
  onFitChange: (f: LogoFit) => void;
}> = ({ value, onChange, fit = 'contain', onFitChange }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const cropper = useCropper(LOGO_CROP, (data) => {
    onChange(data);
    onFitChange('cover'); // the crop already frames it exactly as chosen
  });

  const upload = (file?: File) => {
    if (fileRef.current) fileRef.current.value = '';
    if (file) setError(cropper.openFile(file) ?? '');
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className={`w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ${
            value && fit === 'cover' ? '' : 'p-1.5'
          }`}
        >
          {value ? (
            <img
              src={value}
              alt="Logo preview"
              className={fit === 'cover' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}
            />
          ) : (
            <span className="text-neutral-400 text-[10px] text-center leading-tight">No logo</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 rounded-full border border-white/20 text-white/80 text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-200"
        >
          {value ? 'Replace logo' : 'Upload logo'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => cropper.openSrc(value)}
            className="px-4 py-2 rounded-full border border-teal-400/40 text-teal-300 text-xs font-semibold hover:bg-teal-400 hover:text-black transition-colors duration-200"
          >
            Adjust crop
          </button>
        )}
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-red-400 hover:text-red-300">
            Remove
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      {value && (
        <div className="flex gap-1 mt-3 p-1 rounded-full border border-white/15 w-fit">
          {(
            [
              ['contain', 'Fit - whole logo'],
              ['cover', 'Fill - crop to box'],
            ] as const
          ).map(([f, label]) => (
            <button
              key={f}
              type="button"
              onClick={() => onFitChange(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
                fit === f ? 'bg-white text-black' : 'text-white/55 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <p className={`text-xs mt-2 ${error ? 'text-red-400' : 'text-white/35'}`}>
        {error || 'Optional. Shown instead of the icon on the site. PNG with a transparent background looks best.'}
      </p>
      {cropper.element}
    </div>
  );
};

// Upload (via the crop editor) / adjust crop / remove for an optional image stored as a data URL
const ImageInput: React.FC<{
  value?: string;
  onChange: (v: string) => void;
  crop: CropConfig;
  preview: (src: string) => React.ReactNode;
  previewClass: string;
  emptyLabel: string;
  hint: string;
}> = ({ value, onChange, crop, preview, previewClass, emptyLabel, hint }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const cropper = useCropper(crop, onChange);

  const upload = (file?: File) => {
    if (fileRef.current) fileRef.current.value = '';
    if (file) setError(cropper.openFile(file) ?? '');
  };

  return (
    <div>
      <div className="flex items-end gap-4 flex-wrap">
        <div className={`relative overflow-hidden flex-shrink-0 ${previewClass}`}>
          {value ? (
            preview(value)
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">{emptyLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-full border border-white/20 text-white/80 text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-200"
          >
            {value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => cropper.openSrc(value)}
              className="px-4 py-2 rounded-full border border-teal-400/40 text-teal-300 text-xs font-semibold hover:bg-teal-400 hover:text-black transition-colors duration-200"
            >
              Adjust crop
            </button>
          )}
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-red-400 hover:text-red-300">
              Remove
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      <p className={`text-xs mt-2 ${error ? 'text-red-400' : 'text-white/35'}`}>{error || hint}</p>
      {cropper.element}
    </div>
  );
};

// Project cover image, previewed like the site's image card
export const CoverInput: React.FC<{ value?: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <ImageInput
    value={value}
    onChange={onChange}
    crop={COVER_CROP}
    previewClass="w-64 h-36 rounded-xl bg-white"
    emptyLabel="No cover image"
    hint="Optional. Fills the project's image card, fading to white at the bottom - a screenshot or photo of the project works well."
    preview={(src) => (
      <>
        <img src={src} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/70 to-transparent" />
        <span className="absolute left-3 bottom-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
          View project →
        </span>
      </>
    )}
  />
);

// Photo/scan of the actual certificate, previewed inside a mini gold frame
export const CertificateInput: React.FC<{ value?: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <ImageInput
    value={value}
    onChange={onChange}
    crop={CERTIFICATE_CROP}
    previewClass="w-56 h-40 rounded-lg p-[2px] bg-[linear-gradient(135deg,#b8860b,#f3d77c,#c9a227,#f7e7a1,#a67c00)]"
    emptyLabel="No certificate image"
    hint="Optional. A clear photo or PDF screenshot of the certificate - shown in a gold frame, and opens full size when clicked."
    preview={(src) => (
      <div className="w-full h-full rounded-md bg-white p-1.5">
        <img src={src} alt="Certificate preview" className="w-full h-full object-contain" />
      </div>
    )}
  />
);

// Photo shown on the right of an Experience / Education / Activity card, fading into the card
export const SideImageInput: React.FC<{ value?: string; onChange: (v: string) => void; hint: string }> = ({
  value,
  onChange,
  hint,
}) => (
  <ImageInput
    value={value}
    onChange={onChange}
    crop={SIDE_IMAGE_CROP}
    previewClass="w-64 h-36 rounded-xl bg-white"
    emptyLabel="No photo"
    hint={hint}
    preview={(src) => (
      <>
        <img
          src={src}
          alt="Card photo preview"
          className="absolute inset-y-0 right-0 w-[55%] h-full object-cover [mask-image:linear-gradient(to_left,#000_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.7)_38%,rgba(0,0,0,0.4)_58%,rgba(0,0,0,0.15)_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_left,#000_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.7)_38%,rgba(0,0,0,0.4)_58%,rgba(0,0,0,0.15)_78%,transparent_100%)]"
        />
        {/* Stand-in lines for the card's text */}
        <div className="absolute left-3 top-3 w-[52%] space-y-1.5">
          <div className="h-2 w-4/5 rounded bg-neutral-800" />
          <div className="h-1.5 w-full rounded bg-neutral-300" />
          <div className="h-1.5 w-11/12 rounded bg-neutral-300" />
        </div>
      </>
    )}
  />
);

export const ColorInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded-lg border border-white/15 bg-black cursor-pointer flex-shrink-0"
    />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
  </div>
);

export const StringListField: React.FC<{
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}> = ({ values, onChange, placeholder }) => {
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, '']);

  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
          <button type="button" onClick={() => remove(i)} className={removeButtonClass}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={addLinkClass}>
        + Add line
      </button>
    </div>
  );
};

export const PairListField: React.FC<{
  values: IconNamePair[];
  onChange: (v: IconNamePair[]) => void;
}> = ({ values, onChange }) => {
  const update = (i: number, patch: Partial<IconNamePair>) => {
    const next = [...values];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { name: '', iconName: 'FaCode' }]);

  return (
    <div className="space-y-3">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={v.name}
            onChange={(e) => update(i, { name: e.target.value })}
            placeholder="Name"
            className={inputClass}
          />
          <div className="w-44 flex-shrink-0">
            <IconSelect value={v.iconName} onChange={(val) => update(i, { iconName: val })} />
          </div>
          <button type="button" onClick={() => remove(i)} className={removeButtonClass}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className={addLinkClass}>
        + Add tag
      </button>
    </div>
  );
};
