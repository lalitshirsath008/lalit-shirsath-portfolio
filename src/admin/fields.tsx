import React from 'react';
import { ICON_NAMES, getIcon } from '../lib/icons';
import { IconNamePair } from '../lib/types';

const inputClass =
  'block w-full bg-black border-2 border-bauhaus-cream px-3 py-2 text-bauhaus-cream placeholder-bauhaus-cream/40 focus:border-bauhaus-yellow focus:outline-none transition-colors duration-150';

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/70 mb-1">{label}</label>
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

export const IconSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const Preview = getIcon(value);
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center border-2 border-bauhaus-cream/40 flex-shrink-0">
        <Preview className="w-5 h-5 text-bauhaus-cream" />
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {ICON_NAMES.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ColorInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 border-2 border-bauhaus-cream bg-black cursor-pointer flex-shrink-0"
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
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-3 border-2 border-bauhaus-red text-bauhaus-red font-bold hover:bg-bauhaus-red hover:text-black transition-colors duration-150 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs font-bold uppercase text-bauhaus-yellow hover:underline">
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
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-3 border-2 border-bauhaus-red text-bauhaus-red font-bold hover:bg-bauhaus-red hover:text-black transition-colors duration-150 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs font-bold uppercase text-bauhaus-yellow hover:underline">
        + Add tag
      </button>
    </div>
  );
};
