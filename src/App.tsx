import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGraduationCap,
  FaUniversity,
  FaAward,
  FaMedal,
  FaBriefcase,
  FaCalendarAlt,
  FaTasks,
  FaGithub,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaPhoneAlt,
  FaRocket,
  FaLaptopCode
} from 'react-icons/fa';
import charImage from './assets/char.png';
import txtImage from './assets/txt.png';
import resumePDF from './assets/Lalit_Shirsath_Resume_2024.pdf';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CountUp from './components/CountUp';
import { getIcon } from './lib/icons';
import { fetchAll } from './lib/content';
import { firebaseEnabled } from './lib/firebase';
import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc } from './lib/types';
import { seedSkills, seedProjects, seedExperiences, seedEducation } from './lib/seedData';

// Bauhaus primary palette, cycled across repeating elements (cards, borders, bullets)
const accentHex = ['#E8432E', '#2F6FED', '#F5C518'];

// Static Tailwind class strings (kept literal so the JIT scanner can find them)
const cardAccents = [
  'border-bauhaus-red shadow-[8px_8px_0_0_#E8432E] hover:shadow-[3px_3px_0_0_#E8432E] hover:translate-x-[5px] hover:translate-y-[5px]',
  'border-bauhaus-blue shadow-[8px_8px_0_0_#2F6FED] hover:shadow-[3px_3px_0_0_#2F6FED] hover:translate-x-[5px] hover:translate-y-[5px]',
  'border-bauhaus-yellow shadow-[8px_8px_0_0_#F5C518] hover:shadow-[3px_3px_0_0_#F5C518] hover:translate-x-[5px] hover:translate-y-[5px]',
];
const badgeAccents = ['bg-bauhaus-red', 'bg-bauhaus-blue', 'bg-bauhaus-yellow'];
const textAccents = ['text-bauhaus-red', 'text-bauhaus-blue', 'text-bauhaus-yellow'];
const socialAccents = [
  'border-bauhaus-red hover:bg-bauhaus-red',
  'border-bauhaus-blue hover:bg-bauhaus-blue',
  'border-bauhaus-yellow hover:bg-bauhaus-yellow',
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
      <span className="inline-block font-display text-bauhaus-yellow border-r-2 border-bauhaus-cream whitespace-nowrap overflow-hidden">
        {text}
      </span>
    </div>
  );
};

const navItems = ['Home', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Starts from the bundled seed content so the page never looks empty,
  // then swaps in live data from Firestore once it arrives (if configured).
  const [skills, setSkills] = useState<SkillDoc[]>(seedSkills);
  const [projects, setProjects] = useState<ProjectDoc[]>(seedProjects);
  const [experiences, setExperiences] = useState<ExperienceDoc[]>(seedExperiences);
  const [education, setEducation] = useState<EducationDoc[]>(seedEducation);

  useEffect(() => {
    if (!firebaseEnabled) return;
    fetchAll<SkillDoc>('skills').then((data) => data.length && setSkills(data));
    fetchAll<ProjectDoc>('projects').then((data) => data.length && setProjects(data));
    fetchAll<ExperienceDoc>('experiences').then((data) => data.length && setExperiences(data));
    fetchAll<EducationDoc>('education').then((data) => data.length && setEducation(data));
  }, []);

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

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-bauhaus-cream relative font-sans">
      <ScrollProgress />

      {/* Grid Background Pattern - Moved to cover entire page */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(242, 236, 222, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(242, 236, 222, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center',
        }}
      />

      {/* Main Content - Add z-10 to all main sections to appear above background */}
      <nav className="fixed top-0 left-0 right-0 bg-black z-50 border-b-4 border-bauhaus-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="#home" className="text-xl">
                <TypewriterEffect />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              {navItems.map((item) => {
                const isActive = activeSection === item.toLowerCase();
                return (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`py-2 px-3 font-bold uppercase tracking-wide text-sm transition-colors duration-150 ${
                      isActive
                        ? 'bg-bauhaus-yellow text-black'
                        : 'text-bauhaus-cream hover:bg-bauhaus-cream hover:text-black'
                    }`}
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={handleMenuClick}
                className="mobile-menu-btn text-bauhaus-cream p-2 border-2 border-bauhaus-cream hover:bg-bauhaus-cream hover:text-black transition-colors duration-150"
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
              className="mobile-menu md:hidden bg-black border-t-4 border-bauhaus-cream"
            >
              <div className="px-4 py-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.toLowerCase();
                  return (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={handleMenuItemClick}
                      className={`block px-3 py-3 font-bold uppercase tracking-wide text-sm border-b border-bauhaus-cream/20 last:border-b-0 transition-colors duration-150 ${
                        isActive ? 'bg-bauhaus-yellow text-black' : 'text-bauhaus-cream hover:text-bauhaus-yellow'
                      }`}
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-8 relative z-10">
        {/* Hero Section */}
        <section id="home" className="scroll-mt-20 min-h-[85vh] flex items-center justify-center relative pt-[1.5cm] overflow-hidden">
          {/* Flat geometric shapes - Bauhaus primary forms (hidden on narrow screens to avoid overlapping text) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
            <div
              className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-bauhaus-red border-4 border-bauhaus-cream"
              style={{ top: '10%', left: '4%', animation: 'blob 14s infinite' }}
            />
            <div
              className="absolute"
              style={{
                top: '52%',
                right: '6%',
                width: 0,
                height: 0,
                borderLeft: '60px solid transparent',
                borderRight: '60px solid transparent',
                borderBottom: '100px solid #2F6FED',
                animation: 'blob 18s infinite 2s',
              }}
            />
            <div
              className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-bauhaus-yellow"
              style={{ bottom: '8%', left: '38%', transform: 'rotate(15deg)', animation: 'blob 12s infinite 4s' }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center md:justify-start gap-4"
                >
                  <div className="w-12 h-12 bg-bauhaus-red border-2 border-bauhaus-cream flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-bauhaus-cream" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    className="text-5xl sm:text-6xl md:text-7xl font-display uppercase leading-none tracking-tight"
              >
                    <span className="text-bauhaus-cream">Lalit </span>
                    <span className="text-bauhaus-red">Shirsath</span>
              </motion.h1>
                </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                  className="mt-6 text-xl sm:text-2xl text-bauhaus-cream font-semibold flex items-center justify-center md:justify-start gap-3"
              >
                  <span className="w-3 h-3 bg-bauhaus-yellow flex-shrink-0" />
                  Full Stack Developer &amp; AI Engineer
              </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-lg sm:text-xl text-bauhaus-blue font-semibold flex items-center justify-center md:justify-start gap-3"
                >
                  <span className="w-3 h-3 rounded-full bg-bauhaus-blue flex-shrink-0" />
                  Passionate about Cloud Technology
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 text-base sm:text-lg text-bauhaus-cream/70 max-w-2xl"
                >
                  A versatile developer specializing in full-stack web development and AI solutions.
                  Experienced in building intelligent applications and real-time systems, with a strong
                  focus on cloud technologies and user-centric design.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex justify-center md:justify-start gap-4"
                >
                  <a
                    href="#contact"
                    className="px-8 py-4 bg-bauhaus-red text-black font-bold uppercase tracking-wide border-2 border-bauhaus-cream
                    shadow-[6px_6px_0_0_#F2ECDE] hover:shadow-[0px_0px_0_0_#F2ECDE] hover:translate-x-[6px] hover:translate-y-[6px]
                    transition-all duration-150"
                  >
                    Contact Me
                  </a>
                  <a
                    href={resumePDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-black text-bauhaus-cream font-bold uppercase tracking-wide border-2 border-bauhaus-cream
                    shadow-[6px_6px_0_0_#F5C518] hover:shadow-[0px_0px_0_0_#F5C518] hover:translate-x-[6px] hover:translate-y-[6px]
                    hover:bg-bauhaus-cream hover:text-black transition-all duration-150"
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
                  {/* Geometric frame decoration - only shown once the image fills its container (md+) so it lines up with the photo edges */}
                  <div className="hidden md:block absolute -top-6 -left-6 w-24 h-24 bg-bauhaus-yellow -z-10" />
                  <div className="hidden md:block absolute -bottom-8 -right-4 w-28 h-28 rounded-full bg-bauhaus-blue -z-10" />
                  <div className="hidden md:block absolute -inset-3 border-4 border-bauhaus-cream -z-0" />
                  <img
                    src={charImage}
                    alt="Lalit Shirsath"
                    className="w-full max-w-[400px] md:max-w-none mx-auto relative z-10"
                  />
                  <img
                    src={txtImage}
                    alt="Background Text"
                    className="absolute inset-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="relative py-10 border-y-4 border-bauhaus-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x-2 md:divide-bauhaus-cream/20 text-center">
              {[
                { label: 'Projects Built', value: projects.length, suffix: '+', icon: FaRocket },
                { label: 'Internships', value: experiences.length, suffix: '', icon: FaBriefcase },
                { label: 'Technologies', value: skills.length, suffix: '+', icon: FaLaptopCode },
                { label: 'CGPA', value: 8, suffix: '.23', icon: FaGraduationCap },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2 py-4"
                  >
                    <Icon className={`w-6 h-6 mb-1 ${textAccents[i % 3]}`} />
                    <p className={`text-3xl sm:text-4xl font-display ${textAccents[i % 3]}`}>
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs uppercase tracking-widest text-bauhaus-cream/60">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-20 py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display uppercase text-center mb-12 text-bauhaus-cream flex items-center justify-center gap-4">
              <span className="w-4 h-4 bg-bauhaus-red flex-shrink-0" />
              Skills
              <span className="w-4 h-4 rounded-full bg-bauhaus-blue flex-shrink-0" />
            </h2>

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
                const Icon = getIcon(skill.iconName);
                return (
                  <div
                  key={skill.id ?? skill.name}
                    className="group"
                  >
                    <div
                      className="aspect-square rounded-full bg-black border-4 hover:bg-white/5 transition-colors duration-300 flex flex-col items-center justify-center p-4 min-w-[120px]"
                      style={{ borderColor: accentHex[index % 3] }}
                    >
                      <Icon
                        className="w-12 h-12 mb-3"
                        style={{ color: skill.color }}
                      />
                      <p className="text-sm font-semibold text-center text-bauhaus-cream">
                        {skill.name}
                      </p>
                      <div className="w-14 h-1 mt-2 bg-bauhaus-cream/10 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                        />
                      </div>
                  </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20 py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaBriefcase className="w-8 h-8 text-bauhaus-red" />
              <h2 className="text-3xl font-display uppercase text-center text-bauhaus-cream">Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => {
                const Icon = getIcon(project.iconName);
                const accent = accentHex[index % 3];
                return (
                <motion.div
                  key={project.id ?? project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-black border-4 transition-all duration-150 ${cardAccents[index % 3]}`}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${badgeAccents[index % 3]}`}>
                        <Icon className="w-7 h-7 text-black" />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-display uppercase text-bauhaus-cream leading-tight">
                            {project.title}
                          </h3>
                      </div>
                    </div>
                    <p className="text-bauhaus-cream/70 min-h-[80px] mb-4">
                      {project.description}
                    </p>
                      <div className="space-y-2 mb-4">
                        {project.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2 text-bauhaus-cream/70">
                            <span className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" style={{ backgroundColor: accent }} />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {project.techIcons.map((tech, i) => {
                          const TechIcon = getIcon(tech.iconName);
                          return (
                        <span
                              key={i}
                              className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-bauhaus-cream/40 text-xs font-semibold uppercase tracking-wide text-bauhaus-cream hover:bg-bauhaus-cream hover:text-black transition-colors duration-150"
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
        <section id="experience" className="scroll-mt-20 py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaBriefcase className="w-8 h-8 text-bauhaus-blue" />
              <h2 className="text-3xl font-display uppercase text-center text-bauhaus-cream">Experience</h2>
            </div>
            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const Icon = getIcon(exp.iconName);
                const CompanyIcon = getIcon(exp.companyIconName);
                return (
                <motion.div
                  key={exp.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                    className={`bg-black border-4 p-6 transition-all duration-150 ${cardAccents[index % 3]}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${badgeAccents[index % 3]}`}>
                        <Icon className="w-7 h-7 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display uppercase text-bauhaus-cream leading-tight">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <CompanyIcon className={`w-4 h-4 ${textAccents[index % 3]}`} />
                          <p className="text-bauhaus-cream/70 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <p className="text-bauhaus-cream/70 mt-1 flex items-center gap-2">
                          <FaCalendarAlt className={`w-4 h-4 ${textAccents[index % 3]}`} />
                          {exp.period}
                        </p>
                        <p className="mt-4 text-bauhaus-cream/80 flex items-start gap-2">
                          <FaTasks className={`w-4 h-4 mt-1 flex-shrink-0 ${textAccents[index % 3]}`} />
                          <span>{exp.description}</span>
                        </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => {
                            const SkillIcon = getIcon(skill.iconName);
                            return (
                      <span
                                key={i}
                                className="inline-flex items-center gap-2 px-3 py-1 border-2 border-bauhaus-cream/40 text-xs font-semibold uppercase tracking-wide text-bauhaus-cream hover:bg-bauhaus-cream hover:text-black transition-colors duration-150"
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
                              className="flex items-center gap-2 text-bauhaus-cream/70"
                            >
                              <FaAward className={`w-4 h-4 ${textAccents[index % 3]}`} />
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
        <section id="education" className="scroll-mt-20 py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4 mb-12">
              <FaGraduationCap className="w-8 h-8 text-bauhaus-yellow" />
              <h2 className="text-3xl font-display uppercase text-center text-bauhaus-cream">Education</h2>
            </div>
            <div className="space-y-8">
              {education.map((edu, index) => {
                const Icon = getIcon(edu.iconName);
                return (
                <motion.div
                  key={edu.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                    className={`bg-black border-4 p-6 transition-all duration-150 ${cardAccents[index % 3]}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${badgeAccents[index % 3]}`}>
                        <Icon className="w-7 h-7 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display uppercase text-bauhaus-cream leading-tight">
                          {edu.degree}
                        </h3>
                        <p className="text-bauhaus-cream/70 font-medium mt-2">
                          {edu.institution}
                        </p>
                        <p className="text-bauhaus-cream/70 mt-1 flex items-center gap-2">
                          <FaUniversity className={`w-4 h-4 ${textAccents[index % 3]}`} />
                          {edu.year}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <FaAward className={`w-4 h-4 ${textAccents[index % 3]}`} />
                          <p className={`font-semibold ${textAccents[index % 3]}`}>
                            {edu.description}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {edu.achievements.map((achievement, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1 border-2 border-bauhaus-cream/40 text-xs font-semibold uppercase tracking-wide text-bauhaus-cream hover:bg-bauhaus-cream hover:text-black transition-colors duration-150"
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
        <section id="contact" className="scroll-mt-20 py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display uppercase text-center mb-12 text-bauhaus-cream">Contact Me</h2>

            {/* Contact Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              <a
                href="tel:+919325109257"
                className={`p-3 rounded-full border-4 transition-colors duration-150 group ${socialAccents[0]}`}
                title="Call me"
              >
                <FaPhoneAlt className="w-6 h-6 text-bauhaus-cream group-hover:text-black transform -rotate-90" />
              </a>
              <a
                href="mailto:lalitshirsath008@gmail.com"
                className={`p-3 rounded-full border-4 transition-colors duration-150 group ${socialAccents[1]}`}
                title="Email me"
              >
                <FaEnvelope className="w-6 h-6 text-bauhaus-cream group-hover:text-black" />
              </a>
              <a
                href="https://github.com/lalitshirsath008"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border-4 transition-colors duration-150 group ${socialAccents[2]}`}
                title="GitHub"
              >
                <FaGithub className="w-6 h-6 text-bauhaus-cream group-hover:text-black" />
              </a>
              <a
                href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border-4 transition-colors duration-150 group ${socialAccents[0]}`}
                title="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6 text-bauhaus-cream group-hover:text-black" />
              </a>
              <a
                href="https://www.instagram.com/_lalitz"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full border-4 transition-colors duration-150 group ${socialAccents[1]}`}
                title="Instagram"
              >
                <FaInstagram className="w-6 h-6 text-bauhaus-cream group-hover:text-black" />
              </a>
            </motion.div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/80">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full bg-black border-2 border-bauhaus-cream px-4 py-3 text-bauhaus-cream placeholder-bauhaus-cream/40 focus:border-bauhaus-yellow focus:outline-none transition-colors duration-150"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/80">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full bg-black border-2 border-bauhaus-cream px-4 py-3 text-bauhaus-cream placeholder-bauhaus-cream/40 focus:border-bauhaus-yellow focus:outline-none transition-colors duration-150"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="mt-2 block w-full bg-black border-2 border-bauhaus-cream px-4 py-3 text-bauhaus-cream placeholder-bauhaus-cream/40 focus:border-bauhaus-yellow focus:outline-none transition-colors duration-150 resize-none"
                    placeholder="Your message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full bg-bauhaus-yellow text-black py-3 px-4 font-bold uppercase tracking-wide border-2 border-black
                  shadow-[6px_6px_0_0_#F2ECDE] hover:shadow-[0px_0px_0_0_#F2ECDE] hover:translate-x-[6px] hover:translate-y-[6px]
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[6px_6px_0_0_#F2ECDE] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-black border-4 border-bauhaus-blue text-bauhaus-cream text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-bauhaus-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="mt-4 p-4 bg-black border-4 border-bauhaus-red text-bauhaus-cream text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-bauhaus-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <footer className="bg-black border-t-4 border-bauhaus-cream py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-bauhaus-cream/60 text-sm uppercase tracking-widest">&copy; {new Date().getFullYear()} Lalit Shirsath. All rights reserved.</p>
        </div>
      </footer>

      <BackToTop />
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
`;

const style = document.createElement('style');
style.textContent = keyframes;
document.head.appendChild(style);
