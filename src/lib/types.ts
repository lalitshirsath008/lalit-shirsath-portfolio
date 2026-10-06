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
  achievements: string[];
  order: number;
}
