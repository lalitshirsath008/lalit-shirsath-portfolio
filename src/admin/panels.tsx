import React from 'react';
import CollectionPanel from './CollectionPanel';
import { Field, TextInput, TextAreaInput, NumberInput, IconSelect, ColorInput, StringListField, PairListField } from './fields';
import { getIcon } from '../lib/icons';
import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc } from '../lib/types';

export const SkillsPanel: React.FC = () => (
  <CollectionPanel<SkillDoc>
    name="skills"
    title="Skills"
    makeBlank={() => ({ name: '', level: 75, iconName: 'FaCode', color: '#F2ECDE', order: 0 })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Name">
          <TextInput value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} placeholder="e.g. Rust" />
        </Field>
        <Field label={`Proficiency - ${draft.level}%`}>
          <NumberInput value={draft.level} min={0} max={100} onChange={(v) => setDraft((p) => ({ ...p, level: v }))} />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Brand color">
          <ColorInput value={draft.color} onChange={(v) => setDraft((p) => ({ ...p, color: v }))} />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" style={{ color: item.color }} />
          <div>
            <p className="font-semibold text-bauhaus-cream">{item.name}</p>
            <p className="text-xs text-bauhaus-cream/50">{item.level}% proficiency</p>
          </div>
        </div>
      );
    }}
  />
);

export const ProjectsPanel: React.FC = () => (
  <CollectionPanel<ProjectDoc>
    name="projects"
    title="Projects"
    makeBlank={() => ({ title: '', description: '', iconName: 'FaCode', techIcons: [], details: [], order: 0 })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Title">
          <TextInput value={draft.title} onChange={(v) => setDraft((p) => ({ ...p, title: v }))} placeholder="Project name" />
        </Field>
        <Field label="Description">
          <TextAreaInput value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Highlights">
          <StringListField
            values={draft.details}
            onChange={(v) => setDraft((p) => ({ ...p, details: v }))}
            placeholder="A bullet point about this project"
          />
        </Field>
        <Field label="Tech stack tags">
          <PairListField values={draft.techIcons} onChange={(v) => setDraft((p) => ({ ...p, techIcons: v }))} />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-bauhaus-cream mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-bauhaus-cream">{item.title}</p>
            <p className="text-xs text-bauhaus-cream/50 line-clamp-2">{item.description}</p>
            <p className="text-xs text-bauhaus-cream/40 mt-1">{item.techIcons.map((t) => t.name).join(', ')}</p>
          </div>
        </div>
      );
    }}
  />
);

export const ExperiencePanel: React.FC = () => (
  <CollectionPanel<ExperienceDoc>
    name="experiences"
    title="Experience"
    makeBlank={() => ({
      title: '',
      company: '',
      period: '',
      description: '',
      iconName: 'MdWork',
      companyIconName: 'FaBuilding',
      skills: [],
      achievements: [],
      order: 0,
    })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Role title">
          <TextInput value={draft.title} onChange={(v) => setDraft((p) => ({ ...p, title: v }))} placeholder="e.g. Backend Intern" />
        </Field>
        <Field label="Company">
          <TextInput value={draft.company} onChange={(v) => setDraft((p) => ({ ...p, company: v }))} />
        </Field>
        <Field label="Period">
          <TextInput value={draft.period} onChange={(v) => setDraft((p) => ({ ...p, period: v }))} placeholder="e.g. Jan 2026 - Mar 2026" />
        </Field>
        <Field label="Description">
          <TextAreaInput value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} />
        </Field>
        <Field label="Role icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Company icon">
          <IconSelect value={draft.companyIconName} onChange={(v) => setDraft((p) => ({ ...p, companyIconName: v }))} />
        </Field>
        <Field label="Skills used">
          <PairListField values={draft.skills} onChange={(v) => setDraft((p) => ({ ...p, skills: v }))} />
        </Field>
        <Field label="Achievements">
          <StringListField
            values={draft.achievements}
            onChange={(v) => setDraft((p) => ({ ...p, achievements: v }))}
            placeholder="An achievement from this role"
          />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-bauhaus-cream mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-bauhaus-cream">{item.title}</p>
            <p className="text-xs text-bauhaus-cream/50">{item.company} · {item.period}</p>
          </div>
        </div>
      );
    }}
  />
);

export const EducationPanel: React.FC = () => (
  <CollectionPanel<EducationDoc>
    name="education"
    title="Education"
    makeBlank={() => ({
      degree: '',
      institution: '',
      year: '',
      description: '',
      iconName: 'IoSchoolOutline',
      achievements: [],
      order: 0,
    })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Degree">
          <TextInput value={draft.degree} onChange={(v) => setDraft((p) => ({ ...p, degree: v }))} />
        </Field>
        <Field label="Institution">
          <TextInput value={draft.institution} onChange={(v) => setDraft((p) => ({ ...p, institution: v }))} />
        </Field>
        <Field label="Year range">
          <TextInput value={draft.year} onChange={(v) => setDraft((p) => ({ ...p, year: v }))} placeholder="e.g. July 2022 - Jun 2025" />
        </Field>
        <Field label="Score / description">
          <TextInput value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} placeholder="e.g. CGPA: 8.23/10" />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Achievements">
          <StringListField
            values={draft.achievements}
            onChange={(v) => setDraft((p) => ({ ...p, achievements: v }))}
            placeholder="An award or recognition"
          />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-bauhaus-cream mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-bauhaus-cream">{item.degree}</p>
            <p className="text-xs text-bauhaus-cream/50">{item.institution}</p>
          </div>
        </div>
      );
    }}
  />
);
