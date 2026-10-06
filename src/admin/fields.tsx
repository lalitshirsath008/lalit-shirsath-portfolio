import React from 'react';
import { ICON_NAMES, getIcon } from '../lib/icons';
import { IconNamePair } from '../lib/types';

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

export const IconSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const Preview = getIcon(value);
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/15 flex-shrink-0">
        <Preview className="w-5 h-5 text-white" />
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
