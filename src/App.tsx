import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs,
  FaGraduationCap, 
  FaUniversity, 
  FaAward, 
  FaMedal, 
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaTasks,
  FaBrain,
  FaPython,
  FaRobot,
  FaNewspaper,
  FaCode,
  FaLink,
  FaJava,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaAws,
  FaGithub,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaPhoneAlt,
  FaMobile,
  FaAndroid
} from 'react-icons/fa';
import { 
  SiJavascript, 
  SiExpress, 
  SiMongodb, 
  SiOpenai,
  SiTensorflow,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiCplusplus,
  SiMysql,
  SiPostgresql,
  SiLinux,
  SiTypescript,
  SiTailwindcss,
  SiSanity,
  SiKubernetes,
  SiAmazon,
  SiNextdotjs,
  SiGit,
  SiFirebase
} from 'react-icons/si';
import { IoSchoolOutline } from 'react-icons/io5';
import { MdEngineering, MdWork, MdStorage } from 'react-icons/md';
import { TbBrandOpenai } from 'react-icons/tb';
import { BiLinkExternal } from 'react-icons/bi';
import { BsFiletypeSql } from 'react-icons/bs';
import charImage from './assets/char.png';
import txtImage from './assets/txt.png';
import resumePDF from './assets/Lalit_Shirsath_Resume_2024.pdf';

// Updated Skill data with all technologies
const skills = [
  { 
    name: 'Python', 
    level: 90,
    icon: FaPython,
    color: '#3776AB'
  },
  { 
    name: 'TypeScript', 
    level: 85,
    icon: SiTypescript,
    color: '#3178C6'
  },
  { 
    name: 'JavaScript', 
    level: 90,
    icon: SiJavascript,
    color: '#F7DF1E'
  },
  { 
    name: 'TensorFlow', 
    level: 85,
    icon: SiTensorflow,
    color: '#FF6F00'
  },
  { 
    name: 'LLM', 
    level: 80,
    icon: TbBrandOpenai,
    color: '#00A67E'
  },
  { 
    name: 'RAG', 
    level: 80,
    icon: SiOpenai,
    color: '#412991'
  },
  { 
    name: 'Java', 
    level: 90,
    icon: FaJava,
    color: '#007396'
  },
  { 
    name: 'DBMS', 
    level: 75,
    icon: FaDatabase,
    color: '#336791'
  },
  { 
    name: 'Operating System', 
    level: 90,
    icon: SiLinux,
    color: '#FCC624'
  },
  { 
    name: 'C/C++', 
    level: 80,
    icon: SiCplusplus,
    color: '#00599C'
  },
  { 
    name: 'AI/ML', 
    level: 65,
    icon: FaBrain,
    color: '#FF6F00'
  },
  { 
    name: 'HTML', 
    level: 90,
    icon: FaHtml5,
    color: '#E34F26'
  },
  { 
    name: 'CSS', 
    level: 90,
    icon: FaCss3Alt,
    color: '#1572B6'
  },
  { 
    name: 'Tailwind CSS', 
    level: 85,
    icon: SiTailwindcss,
    color: '#06B6D4'
  },
  { 
    name: 'SQL', 
    level: 80,
    icon: BsFiletypeSql,
    color: '#4479A1'
  },
  { 
    name: 'React.js', 
    level: 90,
    icon: SiReact,
    color: '#61DAFB'
  },
  { 
    name: 'Next.js', 
    level: 85,
    icon: SiNextdotjs,
    color: '#000000'
  },
  { 
    name: 'Node.js', 
    level: 85,
    icon: SiNodedotjs,
    color: '#339933'
  },
  { 
    name: 'Express.js', 
    level: 80,
    icon: SiExpress,
    color: '#000000'
  },
  { 
    name: 'MongoDB', 
    level: 85,
    icon: SiMongodb,
    color: '#47A248'
  },
  { 
    name: 'Sanity', 
    level: 75,
    icon: SiSanity,
    color: '#F03E2F'
  },
  { 
    name: 'AWS', 
    level: 70,
    icon: FaAws,
    color: '#FF9900'
  },
  { 
    name: 'Kubernetes', 
    level: 65,
    icon: SiKubernetes,
    color: '#326CE5'
  },
  { 
    name: 'Git/GitHub', 
    level: 85,
    icon: FaGithub,
    color: '#181717'
  }
];

// Project data with icons
const projects = [
  {
    title: 'RAGDocBot',
    description: 'Developed and deployed AI models using various machine learning frameworks, contributing to AI-driven solutions for real-world projects.',
    tech: ['Python', 'TensorFlow', 'LLM', 'RAG'],
    icon: FaRobot,
    techIcons: [
      { name: 'Python', icon: FaPython },
      { name: 'TensorFlow', icon: SiTensorflow },
      { name: 'LLM', icon: TbBrandOpenai },
      { name: 'RAG', icon: SiOpenai }
    ],
    details: [
      'Built a document-based question answering system using RAG architecture',
      'Implemented vector embeddings for efficient document retrieval',
      'Integrated with multiple LLM providers for flexible model selection',
      'Developed a user-friendly web interface for document upload and querying'
    ]
  },
  {
    title: 'NewsPorthub',
    description: 'Developed a news portal website with advanced search capabilities and secure authentication.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    icon: FaNewspaper,
    techIcons: [
      { name: 'React', icon: SiReact },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Express', icon: SiExpress }
    ],
    details: [
      'Created a responsive news aggregator with real-time updates',
      'Implemented user authentication and role-based access control',
      'Developed advanced search functionality with filters and categories',
      'Integrated with multiple news APIs for comprehensive coverage'
    ]
  },
  {
    title: 'E-Sheti',
    description: 'A mobile application that provides real-time information about crop prices in local markets. Developed to help farmers and traders stay updated with market prices and make informed decisions.',
    tech: ['Android', 'Java', 'XML', 'Firebase'],
    icon: FaMobile,
    techIcons: [
      { name: 'Android', icon: FaAndroid },
      { name: 'Java', icon: FaJava },
      { name: 'XML', icon: FaCode },
      { name: 'Firebase', icon: SiFirebase }
    ],
    details: [
      'Developed a real-time price tracking system for agricultural commodities',
      'Implemented location-based market price discovery',
      'Created user profiles for farmers and traders with different access levels',
      'Integrated push notifications for price alerts and market updates'
    ]
  }
];

// Experience Data with icons
const experiences = [
  {
    title: "Full Stack Developer Intern",
    company: "Paarsh Infotech",
    period: "May 2023 - July 2023",
    description: "Developed and maintained full-stack applications using React, Node.js, and MongoDB. Implemented responsive designs and integrated APIs for enhanced functionality.",
    icon: MdWork,
    companyIcon: FaBuilding,
    skills: [
      { name: "React", icon: FaReact },
      { name: "Node.js", icon: FaNodeJs },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Express", icon: SiExpress },
      { name: "JavaScript", icon: SiJavascript }
    ],
    achievements: [
      "Developed 3 full-stack applications",
      "Improved API response time by 40%",
      "Implemented responsive design patterns"
    ]
  },
  {
    title: "AI Developer Intern",
    company: "Webfries",
    period: "Dec 2023 - Feb 2024",
    description: "Developed and deployed AI models using various machine learning frameworks, contributing to AI-driven solutions for real-world projects.",
    icon: FaBrain,
    companyIcon: FaBuilding,
    skills: [
      { name: "LLM", icon: TbBrandOpenai },
      { name: "RAG", icon: SiOpenai },
      { name: "Python", icon: FaPython }
    ],
    achievements: [
      "Implemented AI-driven features",
      "Optimized model performance",
      "Reduced deployment time by 50%"
    ]
  }
];

// Education Data with icons
const education = [
  {
    degree: "Bachelor of Engineering in Artificial intelligence & Data Science",
    institution: "Savitribai Phule Pune University | Matoshri College of Engineering,Nashik (Maharashtra)",
    year: "July 2022 - Jun 2025",
    description: "CGPA: 8.23/10",
    icon: MdEngineering,
    achievements: ["Dean's List", "Technical Club Member"]
  },
  {
    degree: "Diploma in Computer Engineering",
    institution: "Maharashtra State Board Technical Education | MIT Polytechnic,Yeola (Maharashtra)",
    year: "July 2019 - Jun 2022",
    description: "Percentage: 82.17%",
    icon: IoSchoolOutline,
    achievements: ["Academic Excellence Award", "Best Project Award"]
  }
];

const TypewriterEffect = () => {
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState('Lalit Shirsath Portfolio');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(0);

  const phrases = [
    'Lalit Shirsath',
    'Full Stack Developer',
    'AI Engineer',
    'Cloud Enthusiast'
  ];

  useEffect(() => {
    if (index <= fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, index));
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      // Wait for 2 seconds before starting deletion
      const timeout = setTimeout(() => {
        setIndex(0);
        setText('');
        setPhase((prev) => (prev + 1) % phrases.length);
        setFullText(phrases[(phase + 1) % phrases.length]);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText, phase]);

  return (
    <div className="h-8 overflow-hidden">
      <span className="inline-block font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text 
        border-r-2 border-white whitespace-nowrap overflow-hidden">
        {text}
      </span>
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: false
  });

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: false });

    try {
      const response = await fetch('https://formspree.io/f/mgvkejnr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({ submitting: false, submitted: true, error: false });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setFormStatus({ submitting: false, submitted: false, error: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-btn')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Grid Background Pattern - Moved to cover entire page */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(50, 50, 50, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(50, 50, 50, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Content - Add z-10 to all main sections to appear above background */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="#home" className="text-xl">
                <TypewriterEffect />
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-white/80 hover:text-white transition-colors duration-300 group py-2"
                >
                  <span>{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={handleMenuClick}
                className="mobile-menu-btn text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mobile-menu md:hidden bg-black/95 backdrop-blur-lg"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {['Home', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={handleMenuItemClick}
                    className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 relative group"
                  >
                    <span className="relative z-10">{item}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-8 relative z-10">
        {/* Hero Section */}
        <section id="home" className="min-h-[85vh] flex items-center justify-center relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center md:justify-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    className="text-5xl sm:text-6xl md:text-7xl font-bold"
              >
                    <span className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text 
                      [text-shadow:_0_1px_20px_rgb(168_85_247_/_20%)] animate-gradient-x">
                Lalit Shirsath
                    </span>
              </motion.h1>
                </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                  className="mt-4 text-xl sm:text-2xl text-white/90 [text-shadow:_0_1px_10px_rgb(255_255_255_/_20%)]"
              >
                  Full Stack Developer & AI Engineer
              </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-lg sm:text-xl text-purple-300/90"
                >
                  Passionate about Cloud Technology
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl"
                >
                  A versatile developer specializing in full-stack web development and AI solutions. 
                  Experienced in building intelligent applications and real-time systems, with a strong 
                  focus on cloud technologies and user-centric design.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex justify-center md:justify-start space-x-4"
                >
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold 
                    hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] transition-all duration-300 transform hover:scale-105"
                  >
                    Contact Me
                  </a>
                  <a
                    href={resumePDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold 
                    hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] 
                    transition-all duration-300 transform hover:scale-105"
                  >
                    Resume
                  </a>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <div className="relative w-full md:w-[550px] mx-auto md:-translate-x-[80px] md:translate-y-[60px] group">
                  <img 
                    src={charImage} 
                    alt="Lalit Shirsath"
                    className="w-full max-w-[400px] md:max-w-none mx-auto hover:scale-105 transition-transform duration-500 relative z-10"
                  />
                  <img 
                    src={txtImage} 
                    alt="Background Text"
                    className="absolute inset-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Skills</h2>
            
            {/* Single Row - Scrolling Right to Left */}
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
            >
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div
                  key={skill.name}
                    className="group"
                  >
                    <div className="aspect-square rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-500 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 flex flex-col items-center justify-center p-4 min-w-[120px]">
                      <Icon 
                        className="w-12 h-12 mb-3 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: skill.color }}
                      />
                      <p className="text-sm font-medium text-center text-white/80 group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </p>
                  </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaBriefcase className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const Icon = project.icon;
                return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 rounded-xl overflow-hidden hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-500 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all duration-300">
                        <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                            {project.title}
                          </h3>
                      </div>
                    </div>
                    <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300 min-h-[80px] mb-4">
                      {project.description}
                    </p>
                      <div className="space-y-2 mb-4">
                        {project.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {project.techIcons.map((tech, i) => {
                          const TechIcon = tech.icon;
                          return (
                        <span
                              key={i}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm font-medium text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all duration-300 hover:scale-105"
                        >
                              <TechIcon className="w-4 h-4" />
                              {tech.name}
                        </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaBriefcase className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Experience</h2>
            </div>
            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const Icon = exp.icon;
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 rounded-xl p-6 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-500 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all duration-300">
                        <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <exp.companyIcon className="w-4 h-4 text-purple-400" />
                          <p className="text-white/60 font-medium group-hover:text-white/80 transition-colors duration-300">
                            {exp.company}
                          </p>
                        </div>
                        <p className="text-white/60 mt-1 flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4 text-purple-400" />
                          {exp.period}
                        </p>
                        <p className="mt-4 text-white/80 flex items-start gap-2">
                          <FaTasks className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                          <span>{exp.description}</span>
                        </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => {
                            const SkillIcon = skill.icon;
                            return (
                      <span
                                key={i}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all duration-300 hover:scale-105"
                      >
                                <SkillIcon className="w-4 h-4" />
                                {skill.name}
                      </span>
                            );
                          })}
                        </div>
                        <div className="mt-4 space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-white/60 group-hover:text-white/80 transition-colors duration-300"
                            >
                              <FaAward className="w-4 h-4 text-purple-400" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaGraduationCap className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Education</h2>
            </div>
            <div className="space-y-8">
              {education.map((edu, index) => {
                const Icon = edu.icon;
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 rounded-xl p-6 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-500 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-all duration-300">
                        <Icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                          {edu.degree}
                        </h3>
                        <p className="text-white/60 font-medium mt-1 group-hover:text-white/80 transition-colors duration-300">
                          {edu.institution}
                        </p>
                        <p className="text-white/60 mt-1 flex items-center gap-2">
                          <FaUniversity className="w-4 h-4 text-purple-400" />
                          {edu.year}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <FaAward className="w-4 h-4 text-purple-400" />
                          <p className="text-purple-300 font-medium">
                            {edu.description}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {edu.achievements.map((achievement, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-sm font-medium text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all duration-300 hover:scale-105"
                            >
                              <FaMedal className="w-3 h-3" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Contact Me</h2>
            
            {/* Contact Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              <a
                href="tel:+919325109257"
                className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group"
                title="Call me"
              >
                <FaPhoneAlt className="w-6 h-6 text-white/80 group-hover:text-white transform -rotate-90" />
              </a>
              <a
                href="mailto:lalitshirsath008@gmail.com"
                className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group"
                title="Email me"
              >
                <FaEnvelope className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="https://github.com/lalitshirsath008"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group"
                title="GitHub"
              >
                <FaGithub className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group"
                title="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="https://www.instagram.com/_lalitz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#FCAF45]/20 transition-all duration-300 border border-white/10 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 group"
                title="Instagram"
              >
                <FaInstagram className="w-6 h-6 text-white/80 group-hover:text-white" />
              </a>
            </motion.div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Thank you for your message! I'll get back to you soon.</span>
                    </div>
                  </motion.div>
                )}
                {formStatus.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Oops! Something went wrong. Please try again later.</span>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60">&copy; {new Date().getFullYear()} Lalit Shirsath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 

// Add these styles at the end of the file, before the last line
const keyframes = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes gradient-x {
    0% { background-size: 100% 100%; }
    50% { background-size: 200% 100%; }
    100% { background-size: 100% 100%; }
  }
`;

const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style); 