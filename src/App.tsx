import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  FaIndustry,
  FaCertificate,
  FaArrowRight
} from 'react-icons/fa';
import charImage from './assets/char.png';
import resumePDF from './assets/Lalit_Shirsath_Resume_2026.pdf';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import CountUp from './components/CountUp';
import { getIcon } from './lib/icons';
import { fetchAll } from './lib/content';
import { firebaseEnabled } from './lib/firebase';
import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc, CertificationDoc } from './lib/types';
import {
  seedSkills,
  seedProjects,
  seedExperiences,
  seedEducation,
  seedCertifications,
} from './lib/seedData';

const cardClass =
  'bg-white/[0.03] border border-white/10 rounded-2xl transition-all duration-200 hover:border-teal-400/30 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(45,212,191,0.12)]';

const tagClass =
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 text-xs font-medium text-white/70 hover:border-teal-400/50 hover:text-teal-300 transition-colors duration-200';

// Shared scroll-reveal spring config for section headings (Motion/Framer Motion)
const headingMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// Shared hover-lift spring for cards, kept separate from each card's own entrance transition
const cardHover = {
  whileHover: { y: -6, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  viewport: { once: true, margin: '-60px' },
};

const TypewriterEffect = () => {
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState('Lalit Shirsath');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(0);

  const phrases = ['Lalit Shirsath', 'Data Analyst', 'Business Intelligence', 'Power BI'];

  useEffect(() => {
    if (index <= fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, index));
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
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
    <div className="h-6 overflow-hidden">
      <span className="inline-block font-semibold text-white border-r-2 border-teal-400 whitespace-nowrap overflow-hidden pr-0.5">
        {text}
      </span>
    </div>
  );
};

const navItems = ['Home', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications', 'Contact'];
const pillNavItems = navItems.filter((item) => item !== 'Contact');

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Nav shrinks and darkens as the page scrolls
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)']);
  const navHeight = useTransform(scrollY, [0, 80], [64, 56]);

  // Hero content/glow drift + fade as the hero scrolls out of view
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroProgress, [0, 1], [0, 50]);
  const heroContentOpacity = useTransform(heroProgress, [0, 1], [1, 0.2]);
  const heroGlowY = useTransform(heroProgress, [0, 1], [0, 140]);

  // Starts from the bundled seed content so the page never looks empty,
  // then swaps in live data from Firestore once it arrives (if configured).
  const [skills, setSkills] = useState<SkillDoc[]>(seedSkills);
  const [projects, setProjects] = useState<ProjectDoc[]>(seedProjects);
  const [experiences, setExperiences] = useState<ExperienceDoc[]>(seedExperiences);
  const [education, setEducation] = useState<EducationDoc[]>(seedEducation);
  const [certifications, setCertifications] = useState<CertificationDoc[]>(seedCertifications);

  useEffect(() => {
    if (!firebaseEnabled) return;
    fetchAll<SkillDoc>('skills').then((data) => data.length && setSkills(data));
    fetchAll<ProjectDoc>('projects').then((data) => data.length && setProjects(data));
    fetchAll<ExperienceDoc>('experiences').then((data) => data.length && setExperiences(data));
    fetchAll<EducationDoc>('education').then((data) => data.length && setEducation(data));
    fetchAll<CertificationDoc>('certifications').then((data) => data.length && setCertifications(data));
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
    <div className="flex flex-col min-h-screen bg-black text-white relative font-sans">
      <ScrollProgress />

      {/* Subtle schematic grid background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          backgroundPosition: 'center',
        }}
      />

      <motion.nav
        style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 backdrop-blur-md z-50 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div style={{ height: navHeight }} className="flex justify-between items-center">
            <a href="#home" className="text-base">
              <TypewriterEffect />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1.5">
                {pillNavItems.map((item) => {
                  const isActive = activeSection === item.toLowerCase();
                  return (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {item}
                    </a>
                  );
                })}
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-teal-400 text-black text-sm font-semibold hover:bg-teal-300 transition-colors duration-200"
              >
                Contact
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={handleMenuClick}
                className="mobile-menu-btn text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mobile-menu md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10"
            >
              <div className="px-4 py-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.toLowerCase();
                  return (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={handleMenuItemClick}
                      className={`block px-2 py-3 text-sm font-medium border-b border-white/5 last:border-b-0 transition-colors duration-200 ${
                        isActive ? 'text-teal-400' : 'text-white/50 hover:text-white'
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
      </motion.nav>

      <main className="flex-grow pt-8 relative z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          id="home"
          className="scroll-mt-20 min-h-[85vh] flex items-center justify-center relative pt-[1.5cm] overflow-hidden"
        >
          {/* Atmospheric glow - drifts down as the hero scrolls out of view */}
          <motion.div style={{ y: heroGlowY }} className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[120px]"
              style={{ top: '-10%', right: '0%' }}
            />
            <div
              className="absolute w-[380px] h-[380px] rounded-full bg-amber-400/5 blur-[120px]"
              style={{ top: '25%', left: '-8%' }}
            />
          </motion.div>
          <motion.div
            style={{ y: heroContentY, opacity: heroContentOpacity }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-teal-400"
                >
                  Data Analyst
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                >
                  <span className="text-white">Lalit</span>
                  <br />
                  <span className="text-teal-400">Shirsath.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 text-base sm:text-lg text-white/55 max-w-xl mx-auto md:mx-0"
                >
                  Data Analyst with 1 year of experience in SQL, Python, Excel, and Power BI,
                  specializing in business intelligence, KPI reporting, and predictive analytics.
                  I build dashboards, automate data workflows, and turn raw data into decisions.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-9 flex flex-wrap justify-center md:justify-start items-center gap-4"
                >
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  >
                    <span className="font-semibold text-sm text-white whitespace-nowrap">Get in Touch</span>
                    <span className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center flex-shrink-0">
                      <FaArrowRight className="w-3.5 h-3.5 text-black" />
                    </span>
                  </motion.a>
                  <motion.a
                    href={resumePDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:border-teal-400/60 hover:text-teal-300 transition-colors duration-200"
                  >
                    Download Resume
                  </motion.a>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <div className="relative w-full max-w-[380px] mx-auto">
                  <div className="absolute inset-0 bg-teal-400/15 blur-[90px] rounded-full scale-75" />
                  <div className="relative rounded-3xl border border-teal-400/20 bg-white/[0.02] p-3 overflow-hidden">
                    <img
                      src={charImage}
                      alt="Lalit Shirsath"
                      className="w-full mx-auto relative z-10 rounded-2xl"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Strip */}
        <section className="relative py-10 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-white/10 text-center">
              {[
                { label: 'Years Experience', value: 1, suffix: '+', icon: FaBriefcase },
                { label: 'Companies', value: experiences.length, suffix: '', icon: FaIndustry },
                { label: 'Certifications', value: certifications.length, suffix: '', icon: FaCertificate },
                { label: 'Core Skills', value: skills.length, suffix: '+', icon: FaGraduationCap },
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
                    <Icon className="w-5 h-5 mb-1 text-teal-400" />
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-20 py-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Skills
            </motion.h2>

            {/* Single Row - Scrolling Right to Left */}
            <motion.div
              className="flex gap-5"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 22,
                  ease: "linear",
                },
              }}
            >
              {skills.map((skill) => {
                const Icon = getIcon(skill.iconName);
                return (
                  <div key={skill.id ?? skill.name} className="group flex-shrink-0">
                    <div className={`${cardClass} rounded-2xl flex flex-col items-center justify-center p-5 min-w-[130px]`}>
                      <Icon className="w-10 h-10 mb-3" style={{ color: skill.color }} />
                      <p className="text-sm font-medium text-center text-white/85 whitespace-nowrap">
                        {skill.name}
                      </p>
                      <div className="w-16 h-1 mt-3 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => {
                const Icon = getIcon(project.iconName);
                return (
                <motion.div
                  key={project.id ?? project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  {...cardHover}
                  transition={{ delay: index * 0.1 }}
                  className={cardClass}
                >
                  <div className="p-7 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white leading-tight">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-white/55 mb-4">
                      {project.description}
                    </p>
                    <div className="space-y-2 mb-5">
                      {project.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/55 text-sm">
                          <span className="w-1 h-1 mt-2 rounded-full bg-white/40 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.techIcons.map((tech, i) => {
                        const TechIcon = getIcon(tech.iconName);
                        return (
                          <span key={i} className={tagClass}>
                            <TechIcon className="w-3.5 h-3.5" />
                            {tech.name}
                          </span>
                        );
                      })}
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Experience
            </motion.h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => {
                const Icon = getIcon(exp.iconName);
                const CompanyIcon = getIcon(exp.companyIconName);
                return (
                <motion.div
                  key={exp.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  {...cardHover}
                  transition={{ delay: index * 0.1 }}
                  className={`${cardClass} p-7`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white leading-tight">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <CompanyIcon className="w-4 h-4 text-white/40" />
                        <p className="text-white/55 font-medium">{exp.company}</p>
                      </div>
                      <p className="text-white/45 mt-1 flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="w-3.5 h-3.5" />
                        {exp.period}
                      </p>
                      <p className="mt-4 text-white/65 flex items-start gap-2">
                        <FaTasks className="w-4 h-4 mt-1 flex-shrink-0 text-white/40" />
                        <span>{exp.description}</span>
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.skills.map((skill, i) => {
                          const SkillIcon = getIcon(skill.iconName);
                          return (
                            <span key={i} className={tagClass}>
                              <SkillIcon className="w-3.5 h-3.5" />
                              {skill.name}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-4 space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2 text-white/55 text-sm">
                            <FaAward className="w-3.5 h-3.5 mt-0.5 text-white/40 flex-shrink-0" />
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Education
            </motion.h2>
            <div className="space-y-6">
              {education.map((edu, index) => {
                const Icon = getIcon(edu.iconName);
                return (
                <motion.div
                  key={edu.id ?? index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  {...cardHover}
                  transition={{ delay: index * 0.1 }}
                  className={`${cardClass} p-7`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-white/55 font-medium mt-2">{edu.institution}</p>
                      <p className="text-white/45 mt-1 flex items-center gap-2 text-sm">
                        <FaUniversity className="w-3.5 h-3.5" />
                        {edu.year}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <FaAward className="w-3.5 h-3.5 text-white/40" />
                        <p className="font-semibold text-white/80">{edu.description}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {edu.achievements.map((achievement, i) => (
                          <span key={i} className={tagClass}>
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

        {/* Certifications Section */}
        <section id="certifications" className="scroll-mt-20 py-20 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Certifications
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {certifications.map((cert, index) => {
                const Icon = getIcon(cert.iconName);
                return (
                  <motion.div
                    key={cert.id ?? index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    {...cardHover}
                    transition={{ delay: index * 0.1 }}
                    className={`${cardClass} p-6 flex flex-col items-center text-center gap-3`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-white leading-snug">{cert.title}</p>
                    <p className="text-sm text-white/45">{cert.issuer}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20 py-20 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...headingMotion}
              className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white"
            >
              Contact Me
            </motion.h2>

            {/* Contact Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              <a
                href="tel:+919325109257"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black transition-colors duration-200 group"
                title="Call me"
              >
                <FaPhoneAlt className="w-4 h-4 text-white/70 group-hover:text-black transform -rotate-90" />
              </a>
              <a
                href="mailto:lalitshirsath008@gmail.com"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black transition-colors duration-200 group"
                title="Email me"
              >
                <FaEnvelope className="w-4 h-4 text-white/70 group-hover:text-black" />
              </a>
              <a
                href="https://github.com/lalitshirsath008"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black transition-colors duration-200 group"
                title="GitHub"
              >
                <FaGithub className="w-4 h-4 text-white/70 group-hover:text-black" />
              </a>
              <a
                href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black transition-colors duration-200 group"
                title="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4 text-white/70 group-hover:text-black" />
              </a>
              <a
                href="https://www.instagram.com/_lalitz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black transition-colors duration-200 group"
                title="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-white/70 group-hover:text-black" />
              </a>
            </motion.div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-white/50">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full rounded-lg bg-white/[0.03] border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:border-teal-400/50 focus:outline-none transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-white/50">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full rounded-lg bg-white/[0.03] border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:border-teal-400/50 focus:outline-none transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-white/50">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="mt-2 block w-full rounded-lg bg-white/[0.03] border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:border-teal-400/50 focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Your message"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={formStatus.submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-teal-400 text-black py-3.5 px-4 rounded-full font-semibold hover:bg-teal-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </motion.button>
                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-white/[0.04] border border-white/15 text-white/80 text-center"
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
                    className="mt-4 p-4 rounded-lg bg-white/[0.04] border border-white/15 text-white/80 text-center"
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
      <footer className="bg-black border-t border-white/10 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Lalit Shirsath. All rights reserved.</p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}

export default App;
