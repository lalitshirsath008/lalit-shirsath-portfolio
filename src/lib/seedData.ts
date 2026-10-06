import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc } from './types';

// The site's original hardcoded content, now used two ways:
//  1. Fallback shown on the public site before Firebase is configured (or while loading).
//  2. Pushed into Firestore once via the admin panel's "Seed starter content" button,
//     using the ids below so re-seeding overwrites instead of duplicating.

export const seedSkills: (SkillDoc & { id: string })[] = [
  { id: 'python', name: 'Python', level: 90, iconName: 'FaPython', color: '#3776AB', order: 10 },
  { id: 'typescript', name: 'TypeScript', level: 85, iconName: 'SiTypescript', color: '#3178C6', order: 20 },
  { id: 'javascript', name: 'JavaScript', level: 90, iconName: 'SiJavascript', color: '#F7DF1E', order: 30 },
  { id: 'tensorflow', name: 'TensorFlow', level: 85, iconName: 'SiTensorflow', color: '#FF6F00', order: 40 },
  { id: 'llm', name: 'LLM', level: 80, iconName: 'TbBrandOpenai', color: '#00A67E', order: 50 },
  { id: 'rag', name: 'RAG', level: 80, iconName: 'SiOpenai', color: '#412991', order: 60 },
  { id: 'java', name: 'Java', level: 90, iconName: 'FaJava', color: '#007396', order: 70 },
  { id: 'dbms', name: 'DBMS', level: 75, iconName: 'FaDatabase', color: '#336791', order: 80 },
  { id: 'os', name: 'Operating System', level: 90, iconName: 'SiLinux', color: '#FCC624', order: 90 },
  { id: 'cpp', name: 'C/C++', level: 80, iconName: 'SiCplusplus', color: '#00599C', order: 100 },
  { id: 'aiml', name: 'AI/ML', level: 65, iconName: 'FaBrain', color: '#FF6F00', order: 110 },
  { id: 'html', name: 'HTML', level: 90, iconName: 'FaHtml5', color: '#E34F26', order: 120 },
  { id: 'css', name: 'CSS', level: 90, iconName: 'FaCss3Alt', color: '#1572B6', order: 130 },
  { id: 'tailwind', name: 'Tailwind CSS', level: 85, iconName: 'SiTailwindcss', color: '#06B6D4', order: 140 },
  { id: 'sql', name: 'SQL', level: 80, iconName: 'BsFiletypeSql', color: '#4479A1', order: 150 },
  { id: 'react', name: 'React.js', level: 90, iconName: 'SiReact', color: '#61DAFB', order: 160 },
  { id: 'nextjs', name: 'Next.js', level: 85, iconName: 'SiNextdotjs', color: '#000000', order: 170 },
  { id: 'nodejs', name: 'Node.js', level: 85, iconName: 'SiNodedotjs', color: '#339933', order: 180 },
  { id: 'express', name: 'Express.js', level: 80, iconName: 'SiExpress', color: '#000000', order: 190 },
  { id: 'mongodb', name: 'MongoDB', level: 85, iconName: 'SiMongodb', color: '#47A248', order: 200 },
  { id: 'sanity', name: 'Sanity', level: 75, iconName: 'SiSanity', color: '#F03E2F', order: 210 },
  { id: 'aws', name: 'AWS', level: 70, iconName: 'FaAws', color: '#FF9900', order: 220 },
  { id: 'kubernetes', name: 'Kubernetes', level: 65, iconName: 'SiKubernetes', color: '#326CE5', order: 230 },
  { id: 'git', name: 'Git/GitHub', level: 85, iconName: 'FaGithub', color: '#181717', order: 240 },
];

export const seedProjects: (ProjectDoc & { id: string })[] = [
  {
    id: 'ragdocbot',
    title: 'RAGDocBot',
    description:
      'Developed and deployed AI models using various machine learning frameworks, contributing to AI-driven solutions for real-world projects.',
    iconName: 'FaRobot',
    techIcons: [
      { name: 'Python', iconName: 'FaPython' },
      { name: 'TensorFlow', iconName: 'SiTensorflow' },
      { name: 'LLM', iconName: 'TbBrandOpenai' },
      { name: 'RAG', iconName: 'SiOpenai' },
    ],
    details: [
      'Built a document-based question answering system using RAG architecture',
      'Implemented vector embeddings for efficient document retrieval',
      'Integrated with multiple LLM providers for flexible model selection',
      'Developed a user-friendly web interface for document upload and querying',
    ],
    order: 10,
  },
  {
    id: 'newsporthub',
    title: 'NewsPorthub',
    description: 'Developed a news portal website with advanced search capabilities and secure authentication.',
    iconName: 'FaNewspaper',
    techIcons: [
      { name: 'React', iconName: 'SiReact' },
      { name: 'Node.js', iconName: 'SiNodedotjs' },
      { name: 'MongoDB', iconName: 'SiMongodb' },
      { name: 'Express', iconName: 'SiExpress' },
    ],
    details: [
      'Created a responsive news aggregator with real-time updates',
      'Implemented user authentication and role-based access control',
      'Developed advanced search functionality with filters and categories',
      'Integrated with multiple news APIs for comprehensive coverage',
    ],
    order: 20,
  },
  {
    id: 'e-sheti',
    title: 'E-Sheti',
    description:
      'A mobile application that provides real-time information about crop prices in local markets. Developed to help farmers and traders stay updated with market prices and make informed decisions.',
    iconName: 'FaMobile',
    techIcons: [
      { name: 'Android', iconName: 'FaAndroid' },
      { name: 'Java', iconName: 'FaJava' },
      { name: 'XML', iconName: 'FaCode' },
      { name: 'Firebase', iconName: 'SiFirebase' },
    ],
    details: [
      'Developed a real-time price tracking system for agricultural commodities',
      'Implemented location-based market price discovery',
      'Created user profiles for farmers and traders with different access levels',
      'Integrated push notifications for price alerts and market updates',
    ],
    order: 30,
  },
];

export const seedExperiences: (ExperienceDoc & { id: string })[] = [
  {
    id: 'paarsh-infotech',
    title: 'Full Stack Developer Intern',
    company: 'Paarsh Infotech',
    period: 'May 2023 - July 2023',
    description:
      'Developed and maintained full-stack applications using React, Node.js, and MongoDB. Implemented responsive designs and integrated APIs for enhanced functionality.',
    iconName: 'MdWork',
    companyIconName: 'FaBuilding',
    skills: [
      { name: 'React', iconName: 'FaReact' },
      { name: 'Node.js', iconName: 'FaNodeJs' },
      { name: 'MongoDB', iconName: 'SiMongodb' },
      { name: 'Express', iconName: 'SiExpress' },
      { name: 'JavaScript', iconName: 'SiJavascript' },
    ],
    achievements: [
      'Developed 3 full-stack applications',
      'Improved API response time by 40%',
      'Implemented responsive design patterns',
    ],
    order: 10,
  },
  {
    id: 'webfries',
    title: 'AI Developer Intern',
    company: 'Webfries',
    period: 'Dec 2023 - Feb 2024',
    description:
      'Developed and deployed AI models using various machine learning frameworks, contributing to AI-driven solutions for real-world projects.',
    iconName: 'FaBrain',
    companyIconName: 'FaBuilding',
    skills: [
      { name: 'LLM', iconName: 'TbBrandOpenai' },
      { name: 'RAG', iconName: 'SiOpenai' },
      { name: 'Python', iconName: 'FaPython' },
    ],
    achievements: [
      'Implemented AI-driven features',
      'Optimized model performance',
      'Reduced deployment time by 50%',
    ],
    order: 20,
  },
];

export const seedEducation: (EducationDoc & { id: string })[] = [
  {
    id: 'spu-be',
    degree: 'Bachelor of Engineering in Artificial intelligence & Data Science',
    institution: 'Savitribai Phule Pune University | Matoshri College of Engineering,Nashik (Maharashtra)',
    year: 'July 2022 - Jun 2025',
    description: 'CGPA: 8.23/10',
    iconName: 'MdEngineering',
    achievements: ["Dean's List", 'Technical Club Member'],
    order: 10,
  },
  {
    id: 'mit-diploma',
    degree: 'Diploma in Computer Engineering',
    institution: 'Maharashtra State Board Technical Education | MIT Polytechnic,Yeola (Maharashtra)',
    year: 'July 2019 - Jun 2022',
    description: 'Percentage: 82.17%',
    iconName: 'IoSchoolOutline',
    achievements: ['Academic Excellence Award', 'Best Project Award'],
    order: 20,
  },
];
