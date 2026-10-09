// 'contain' shows the whole logo with padding; 'cover' fills the box edge to edge, cropping overflow
export type LogoFit = 'contain' | 'cover';

export interface SkillDoc {
  id?: string;
  name: string;
  level: number;
  iconName: string;
  color: string;
  order: number;
}

export interface IconNamePair {
  name: string;
  iconName: string;
}

export interface ProjectDoc {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  techIcons: IconNamePair[];
  details: string[];
  cover?: string; // cover image as a data URL; '' or missing means no cover
  liveUrl?: string; // hosted project link, shown as "View project"
  repoUrl?: string; // GitHub repo link
  order: number;
}

export interface ExperienceDoc {
  id?: string;
  title: string;
  company: string;
  period: string;
  description: string;
  iconName: string;
  companyIconName: string;
  logo?: string; // company logo as a data URL; '' or missing falls back to the role icon
  logoFit?: LogoFit;
  image?: string; // company-related photo for the card's right side, as a data URL
  skills: IconNamePair[];
  achievements: string[];
  order: number;
}

export interface EducationDoc {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
  iconName: string;
  logo?: string; // institution logo as a data URL; '' or missing falls back to the icon
  logoFit?: LogoFit;
  image?: string; // college/campus photo for the card's right side, as a data URL
  achievements: string[];
  order: number;
}

export interface ActivityDoc {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  image?: string; // photo as a data URL, shown on the card's right side
  link?: string; // optional URL behind the card's "View" link
  order: number;
}

export interface CertificationDoc {
  id?: string;
  title: string;
  issuer: string;
  iconName: string;
  logo?: string; // issuer logo as a data URL; '' or missing falls back to the icon
  logoFit?: LogoFit;
  image?: string; // photo/scan of the actual certificate as a data URL; '' or missing shows a placeholder
  order: number;
}
