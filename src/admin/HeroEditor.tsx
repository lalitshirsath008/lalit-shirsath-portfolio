import React, { useEffect, useState } from 'react';
import { DEFAULT_HERO, fetchHero, HeroContent, MAX_HERO_ROLES, saveHero } from '../lib/hero';
import { Field, StringListField, TextAreaInput, TextInput } from './fields';

/** Admin editor for the homepage hero (site/hero): typewriter, name, summary and photo roles. */
const HeroEditor: React.FC = () => {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHero()
      .then(setHero)
      .catch(() => setHero(DEFAULT_HERO));
  }, []);

  if (!hero) return <p className="text-white/50 mb-6">Loading homepage content...</p>;

  const update = (patch: Partial<HeroContent>) => {
    setHero((h) => (h ? { ...h, ...patch } : h));
    setMessage('');
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await saveHero({
        ...hero,
        eyebrow: hero.eyebrow.trim(),
        firstName: hero.firstName.trim(),
        lastName: hero.lastName.trim(),
        summary: hero.summary.trim(),
        typewriter: hero.typewriter.map((t) => t.trim()).filter(Boolean),
        roles: hero.roles.map((r) => r.trim()).filter(Boolean).slice(0, MAX_HERO_ROLES),
      });
      setMessage('Saved - refresh the site to see it.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Saving failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/15 mb-6 max-w-2xl">
      <h4 className="font-semibold text-white mb-1">Homepage hero</h4>
      <p className="text-white/50 text-sm mb-5">The top of the homepage: the typing text in the nav, your name and intro.</p>

      <Field label="Typing text (top-left, one phrase per line)">
        <StringListField values={hero.typewriter} onChange={(v) => update({ typewriter: v })} placeholder="e.g. Data Analyst" />
      </Field>
      <Field label="Small line above the name">
        <TextInput value={hero.eyebrow} onChange={(v) => update({ eyebrow: v })} placeholder="e.g. Data Analyst" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Field label="First name (white)">
          <TextInput value={hero.firstName} onChange={(v) => update({ firstName: v })} />
        </Field>
        <Field label="Last name (teal)">
          <TextInput value={hero.lastName} onChange={(v) => update({ lastName: v })} />
        </Field>
      </div>
      <Field label="Intro paragraph">
        <TextAreaInput value={hero.summary} onChange={(v) => update({ summary: v })} rows={4} />
      </Field>
      <Field label={`Roles shown around your photo on hover (up to ${MAX_HERO_ROLES})`}>
        <StringListField
          values={hero.roles}
          onChange={(v) => update({ roles: v.slice(0, MAX_HERO_ROLES) })}
          placeholder="e.g. AI Developer"
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-5 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/85 transition-colors duration-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {message && <p className="text-white/70 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default HeroEditor;
