import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc, CertificationDoc, ActivityDoc } from './types';

// Sourced from Lalit's latest resume (2026). Used two ways:
//  1. Fallback shown on the public site before Firebase is configured (or while loading).
//  2. Pushed into Firestore once via the admin panel's "Seed starter content" button,
//     using the ids below so re-seeding overwrites instead of duplicating.

export const seedSkills: (SkillDoc & { id: string })[] = [
  { id: 'python', name: 'Python', level: 85, iconName: 'FaPython', color: '#3776AB', order: 10 },
  { id: 'r', name: 'R', level: 65, iconName: 'SiR', color: '#276DC3', order: 20 },
  { id: 'sql', name: 'SQL', level: 90, iconName: 'BsFiletypeSql', color: '#4479A1', order: 30 },
  { id: 'mysql', name: 'MySQL', level: 80, iconName: 'SiMysql', color: '#4479A1', order: 40 },
  { id: 'postgresql', name: 'PostgreSQL', level: 75, iconName: 'SiPostgresql', color: '#4169E1', order: 50 },
  { id: 'excel', name: 'Excel (Advanced)', level: 95, iconName: 'FaFileExcel', color: '#217346', order: 60 },
  { id: 'powerbi', name: 'Power BI', level: 90, iconName: 'FaChartPie', color: '#F2C811', order: 70 },
  { id: 'zoho-analytics', name: 'Zoho Analytics', level: 70, iconName: 'SiZoho', color: '#C8202F', order: 80 },
  { id: 'sap', name: 'SAP', level: 75, iconName: 'SiSap', color: '#0FAAFF', order: 90 },
  { id: 'dax', name: 'DAX', level: 80, iconName: 'FaDatabase', color: '#F2C811', order: 100 },
  { id: 'statistics', name: 'Statistics', level: 80, iconName: 'FaChartLine', color: '#FF6F00', order: 110 },
  { id: 'data-viz', name: 'Data Visualization', level: 85, iconName: 'FaChartBar', color: '#8E44AD', order: 120 },
  { id: 'digital-marketing', name: 'Digital Marketing', level: 60, iconName: 'FaBullhorn', color: '#E91E63', order: 130 },
  { id: 'canva', name: 'Canva', level: 70, iconName: 'SiCanva', color: '#00C4CC', order: 140 },
  { id: 'git', name: 'Git', level: 70, iconName: 'SiGit', color: '#F05032', order: 150 },
  { id: 'pandas', name: 'Pandas', level: 80, iconName: 'SiPandas', color: '#150458', order: 160 },
  { id: 'numpy', name: 'NumPy', level: 75, iconName: 'SiNumpy', color: '#013243', order: 170 },
  { id: 'data-cleaning', name: 'Data Cleaning', level: 85, iconName: 'FaBroom', color: '#16A085', order: 180 },
  { id: 'forecasting', name: 'Forecasting', level: 75, iconName: 'FaWaveSquare', color: '#2980B9', order: 190 },
];

export const seedProjects: (ProjectDoc & { id: string })[] = [
  {
    id: 'wildnetra',
    title: 'WildNetra - Wildlife Surveillance AI System',
    description:
      'AI-powered wildlife surveillance system using computer vision and object detection models, improving leopard threat detection accuracy by 40% for real-time forest monitoring.',
    iconName: 'FaPaw',
    techIcons: [
      { name: 'Python', iconName: 'FaPython' },
      { name: 'YOLOv8', iconName: 'FaCrosshairs' },
      { name: 'Computer Vision', iconName: 'FaEye' },
      { name: 'Object Detection', iconName: 'FaCamera' },
      { name: 'AI/ML', iconName: 'FaBrain' },
    ],
    details: [
      'Built real-time object detection pipeline for leopard threat monitoring in forest areas',
      'Improved detection accuracy by 40% over the baseline surveillance approach',
      'Designed for continuous, low-latency monitoring in the field',
    ],
    order: 10,
  },
  {
    id: 'sales-dashboard',
    title: 'Sales Performance & Profitability Dashboard',
    description: 'Analyzed 10,000+ sales records using Excel and Power BI to identify trends and profit drivers.',
    iconName: 'FaChartLine',
    techIcons: [
      { name: 'Excel', iconName: 'FaFileExcel' },
      { name: 'Power BI', iconName: 'FaChartPie' },
      { name: 'DAX', iconName: 'FaDatabase' },
    ],
    details: [
      'Built a Power BI dashboard with KPIs, regional analysis, and customer insights',
      'Automated monthly reporting end to end',
      'Identified loss-making categories, directly informing pricing decisions',
    ],
    order: 20,
  },
];

export const seedExperiences: (ExperienceDoc & { id: string })[] = [
  {
    id: 'rgk-group',
    title: 'Data Analyst',
    company: 'RGK Group of Industries - Rajkot, Gujarat',
    period: 'Feb 2026 - Present',
    description:
      'Analyzing business, production, and sales data using SQL, Excel, and Python to generate actionable insights for senior management decision-making.',
    iconName: 'FaChartBar',
    companyIconName: 'FaIndustry',
    skills: [
      { name: 'SQL', iconName: 'BsFiletypeSql' },
      { name: 'Excel', iconName: 'FaFileExcel' },
      { name: 'Python', iconName: 'FaPython' },
      { name: 'SAP', iconName: 'SiSap' },
    ],
    achievements: [
      'Designing interactive dashboards and automated KPI reports to track performance and improve operational efficiency',
      'Performing SAP data reconciliation and procurement tracking across departments to ensure data accuracy',
      'Developed a predictive AI tool using sensor data to forecast machine downtime, enabling proactive maintenance',
    ],
    order: 10,
  },
  {
    id: 'wildrex-solutions',
    title: 'AI Engineer Intern',
    company: 'Wildrex Solutions - Ahilyanagar, Maharashtra',
    period: 'July 2025 - Oct 2025',
    description:
      'Built AI systems spanning document automation, wildlife surveillance, and conversational tooling across three distinct projects.',
    iconName: 'FaBrain',
    companyIconName: 'FaBuilding',
    skills: [
      { name: 'Computer Vision', iconName: 'FaEye' },
      { name: 'OCR', iconName: 'FaCamera' },
      { name: 'LLM', iconName: 'TbBrandOpenai' },
      { name: 'Android', iconName: 'FaAndroid' },
    ],
    achievements: [
      'Built an OCR-based document processing system for Ahilyanagar Police Department, cutting manual routing time by 60%',
      'Developed WildNetra, an AI wildlife surveillance system, improving leopard threat detection accuracy by 40%',
      'Shipped an Android app with an integrated LLM chatbot, reducing manual query handling by 50%',
    ],
    order: 20,
  },
];

export const seedEducation: (EducationDoc & { id: string })[] = [
  {
    id: 'spu-be',
    degree: 'Bachelor of Engineering in Artificial intelligence & Data Science',
    institution: 'Savitribai Phule Pune University | Matoshri College of Engineering, Nashik (Maharashtra)',
    year: 'July 2022 - Jun 2025',
    description: 'CGPA: 8.08/10',
    iconName: 'MdEngineering',
    achievements: ["Dean's List", 'Technical Club Member'],
    order: 10,
  },
  {
    id: 'mit-diploma',
    degree: 'Diploma in Computer Engineering',
    institution: 'Maharashtra State Board Technical Education | MIT Polytechnic, Yeola (Maharashtra)',
    year: 'July 2019 - Jun 2022',
    description: 'Percentage: 82.17%',
    iconName: 'IoSchoolOutline',
    achievements: ['Academic Excellence Award', 'Best Project Award'],
    order: 20,
  },
];

// From LinkedIn (diploma "Activities and Societies") plus photo & video editing
export const seedActivities: (ActivityDoc & { id: string })[] = [
  { id: 'cricket', title: 'Cricket', description: 'Played during diploma at MIT Polytechnic, Yeola.', iconName: 'MdSportsCricket', order: 10 },
  { id: 'kabaddi', title: 'Kabaddi', description: 'Played during diploma at MIT Polytechnic, Yeola.', iconName: 'MdSportsKabaddi', order: 20 },
  { id: 'acting', title: 'Acting', description: 'On stage during diploma at MIT Polytechnic, Yeola.', iconName: 'FaTheaterMasks', order: 30 },
  { id: 'photo-video-editing', title: 'Photo & Video Editing', description: 'Editing photos and videos.', iconName: 'FaPhotoVideo', order: 40 },
];

export const seedCertifications: (CertificationDoc & { id: string })[] = [
  {
    id: 'anthropic-ai-fluency',
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    iconName: 'SiAnthropic',
    order: 10,
  },
  {
    id: 'ibm-spark',
    title: 'Spark Fundamentals I',
    issuer: 'IBM',
    iconName: 'FaCertificate',
    order: 20,
  },
  {
    id: 'databricks-fundamentals',
    title: 'Databricks Fundamentals Accreditation',
    issuer: 'Databricks',
    iconName: 'SiDatabricks',
    order: 30,
  },
];
