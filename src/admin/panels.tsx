import React from 'react';
import CollectionPanel from './CollectionPanel';
import { Field, TextInput, TextAreaInput, NumberInput, IconSelect, ColorInput, StringListField, PairListField, LogoInput, CoverInput, CertificateInput, SideImageInput } from './fields';
import { getIcon } from '../lib/icons';
import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc, CertificationDoc, ActivityDoc, LogoFit } from '../lib/types';

// List-row thumbnail: the uploaded logo when there is one, otherwise the chosen icon
const SummaryIcon: React.FC<{ logo?: string; logoFit?: LogoFit; iconName: string }> = ({ logo, logoFit, iconName }) => {
  if (logo) {
    const cover = logoFit === 'cover';
    return (
      <div className={`w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ${cover ? '' : 'p-0.5'}`}>
        <img src={logo} alt="" className={cover ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'} />
      </div>
    );
  }
  const Icon = getIcon(iconName);
  return <Icon className="w-6 h-6 text-white mt-1 flex-shrink-0" />;
};

export const SkillsPanel: React.FC = () => (
  <CollectionPanel<SkillDoc>
    name="skills"
    title="Skills"
    makeBlank={() => ({ name: '', level: 75, iconName: 'FaCode', color: '#ffffff', order: 0 })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Name">
          <TextInput value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} placeholder="e.g. Tableau" />
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
            <p className="font-semibold text-white">{item.name}</p>
            <p className="text-xs text-white/45">{item.level}% proficiency</p>
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
        <Field label="Cover image">
          <CoverInput value={draft.cover} onChange={(v) => setDraft((p) => ({ ...p, cover: v }))} />
        </Field>
        <Field label="Live project link">
          <TextInput
            value={draft.liveUrl ?? ''}
            onChange={(v) => setDraft((p) => ({ ...p, liveUrl: v }))}
            placeholder="e.g. https://wildnetra.vercel.app"
          />
        </Field>
        <Field label="GitHub repo link">
          <TextInput
            value={draft.repoUrl ?? ''}
            onChange={(v) => setDraft((p) => ({ ...p, repoUrl: v }))}
            placeholder="e.g. https://github.com/lalitshirsath008/wildnetra"
          />
        </Field>
        <p className="-mt-2 mb-4 text-white/35 text-xs">
          "View project" opens the live link, or the GitHub repo if there's no live link. With both, a GitHub button shows too.
        </p>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-white mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/45 line-clamp-2">{item.description}</p>
            <p className="text-xs text-white/35 mt-1">{item.techIcons.map((t) => t.name).join(', ')}</p>
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
          <TextInput value={draft.title} onChange={(v) => setDraft((p) => ({ ...p, title: v }))} placeholder="e.g. Business Intelligence Analyst" />
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
        <Field label="Card photo">
          <SideImageInput
            value={draft.image}
            onChange={(v) => setDraft((p) => ({ ...p, image: v }))}
            hint="Optional. A company-related photo (office, team, product) shown on the right of the card, fading into it."
          />
        </Field>
        <Field label="Company logo">
          <LogoInput
            value={draft.logo}
            onChange={(v) => setDraft((p) => ({ ...p, logo: v }))}
            fit={draft.logoFit}
            onFitChange={(f) => setDraft((p) => ({ ...p, logoFit: f }))}
          />
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
      return (
        <div className="flex items-start gap-3">
          <SummaryIcon logo={item.logo} logoFit={item.logoFit} iconName={item.iconName} />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/45">{item.company} · {item.period}</p>
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
          <TextInput value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} placeholder="e.g. CGPA: 8.08/10" />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Card photo">
          <SideImageInput
            value={draft.image}
            onChange={(v) => setDraft((p) => ({ ...p, image: v }))}
            hint="Optional. A photo of the college / campus shown on the right of the card, fading into it."
          />
        </Field>
        <Field label="Institution logo">
          <LogoInput
            value={draft.logo}
            onChange={(v) => setDraft((p) => ({ ...p, logo: v }))}
            fit={draft.logoFit}
            onFitChange={(f) => setDraft((p) => ({ ...p, logoFit: f }))}
          />
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
      return (
        <div className="flex items-start gap-3">
          <SummaryIcon logo={item.logo} logoFit={item.logoFit} iconName={item.iconName} />
          <div>
            <p className="font-semibold text-white">{item.degree}</p>
            <p className="text-xs text-white/45">{item.institution}</p>
          </div>
        </div>
      );
    }}
  />
);

export const CertificationsPanel: React.FC = () => (
  <CollectionPanel<CertificationDoc>
    name="certifications"
    title="Certifications"
    makeBlank={() => ({ title: '', issuer: '', iconName: 'FaCertificate', order: 0 })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Title">
          <TextInput
            value={draft.title}
            onChange={(v) => setDraft((p) => ({ ...p, title: v }))}
            placeholder="e.g. AI Fluency: Framework & Foundations"
          />
        </Field>
        <Field label="Issuer">
          <TextInput value={draft.issuer} onChange={(v) => setDraft((p) => ({ ...p, issuer: v }))} placeholder="e.g. Anthropic" />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Certificate image">
          <CertificateInput value={draft.image} onChange={(v) => setDraft((p) => ({ ...p, image: v }))} />
        </Field>
        <Field label="Issuer logo">
          <LogoInput
            value={draft.logo}
            onChange={(v) => setDraft((p) => ({ ...p, logo: v }))}
            fit={draft.logoFit}
            onFitChange={(f) => setDraft((p) => ({ ...p, logoFit: f }))}
          />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      return (
        <div className="flex items-start gap-3">
          <SummaryIcon logo={item.logo} logoFit={item.logoFit} iconName={item.iconName} />
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/45">{item.issuer}</p>
          </div>
        </div>
      );
    }}
  />
);

export const ActivitiesPanel: React.FC = () => (
  <CollectionPanel<ActivityDoc>
    name="activities"
    title="Extra Activities"
    makeBlank={() => ({ title: '', description: '', iconName: 'FaStar', order: 0 })}
    renderForm={(draft, setDraft) => (
      <>
        <Field label="Title">
          <TextInput value={draft.title} onChange={(v) => setDraft((p) => ({ ...p, title: v }))} placeholder="e.g. Cricket" />
        </Field>
        <Field label="Description">
          <TextAreaInput
            value={draft.description}
            onChange={(v) => setDraft((p) => ({ ...p, description: v }))}
            rows={2}
          />
        </Field>
        <Field label="Icon">
          <IconSelect value={draft.iconName} onChange={(v) => setDraft((p) => ({ ...p, iconName: v }))} />
        </Field>
        <Field label="Photo">
          <SideImageInput
            value={draft.image}
            onChange={(v) => setDraft((p) => ({ ...p, image: v }))}
            hint="Optional. Shown on the right of the card, fading into it."
          />
        </Field>
        <Field label="Link">
          <TextInput
            value={draft.link ?? ''}
            onChange={(v) => setDraft((p) => ({ ...p, link: v }))}
            placeholder="e.g. https://www.instagram.com/p/... (adds a View link)"
          />
        </Field>
      </>
    )}
    renderSummary={(item) => {
      const Icon = getIcon(item.iconName);
      return (
        <div className="flex items-start gap-3">
          {item.image ? (
            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <Icon className="w-6 h-6 text-white mt-1 flex-shrink-0" />
          )}
          <div>
            <p className="font-semibold text-white">{item.title}</p>
            <p className="text-xs text-white/45 line-clamp-2">{item.description}</p>
          </div>
        </div>
      );
    }}
  />
);
