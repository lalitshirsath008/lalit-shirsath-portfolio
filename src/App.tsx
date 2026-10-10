import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FaGraduationCap,
  FaUniversity,
  FaAward,
  FaMedal,
  FaBriefcase,
  FaCalendarAlt,
  FaGithub,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
  FaPhoneAlt,
  FaIndustry,
  FaCertificate,
  FaArrowRight
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import charImage from './assets/char.png';
import backgroundImage from './assets/background.avif';
import dotTexture from './assets/dot.png';
import resumePDF from './assets/Lalit_Shirsath_Resume_2026.pdf';
import ScrollProgress from './components/ScrollProgress';
import JackChat from './components/JackChat';
import { CardStack } from './components/CardStack';
import { SpreadGrid } from './components/SpreadGrid';
import CornerCard from './corner/CornerCard';
import { PostModal } from './corner/CornerPage';
import { fetchPosts, Post } from './lib/posts';
import { DEFAULT_HERO, fetchHero, HeroContent } from './lib/hero';
import { JourneyTimeline, TimelineStop } from './components/JourneyTimeline';
import CountUp from './components/CountUp';
import HeroPhoto from './components/HeroPhoto';
import { getIcon } from './lib/icons';
import { fetchAll } from './lib/content';
import { firebaseEnabled } from './lib/firebase';
import { SkillDoc, ProjectDoc, ExperienceDoc, EducationDoc, CertificationDoc, ActivityDoc, LogoFit } from './lib/types';
import {
  seedSkills,
  seedProjects,
  seedExperiences,
  seedEducation,
  seedCertifications,
  seedActivities,
} from './lib/seedData';

// Admin-entered links may omit the scheme ("github.com/..."); without it the browser treats them as relative paths
const toExternalUrl = (url?: string) => {
  const u = url?.trim();
  if (!u) return '';
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
};

// Thin gold hairline used as a border (applied as a padded gradient background), shared by
// certificate cards and the full-size viewer
const goldFrameStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #b8860b, #f3d77c 30%, #c9a227 55%, #f7e7a1 80%, #a67c00)',
};

// A certificate in a minimal gold-bordered frame with its title and issuer beneath.
// Clicking opens it full size.
const CertificateFrame: React.FC<{ cert: CertificationDoc; onOpen: () => void }> = ({ cert, onOpen }) => {
  const Icon = getIcon(cert.iconName);
  return (
    <div className="group flex flex-col items-center">
      <button
        type="button"
        onClick={cert.image ? onOpen : undefined}
        className={`w-full rounded-xl p-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(166,124,0,0.15)] ${
          cert.image ? 'cursor-zoom-in' : 'cursor-default'
        }`}
        style={goldFrameStyle}
        aria-label={cert.image ? `View ${cert.title} certificate` : undefined}
      >
        <div className="relative aspect-[4/3] rounded-[10px] overflow-hidden bg-white p-3">
          {cert.image ? (
            <img src={cert.image} alt={`${cert.title} certificate`} className="w-full h-full object-contain" />
          ) : (
            // No scan yet: a quiet placeholder with the issuer's logo or icon
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
              {cert.logo ? (
                <img src={cert.logo} alt="" className="w-12 h-12 object-contain" />
              ) : (
                <Icon className="w-9 h-9 text-[#b8860b]" />
              )}
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">Certificate</span>
            </div>
          )}
          {/* Faint light sweep on hover */}
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-[450%]" />
        </div>
      </button>

      <div className="mt-4 text-center px-2">
        <p className="font-semibold text-neutral-900 leading-snug">{cert.title}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a67c00]">{cert.issuer}</p>
      </div>
    </div>
  );
};

// Experience / Education card photo: a right-hand panel fading leftwards into the white card
// on md+, and a banner across the top fading downwards on phones (negative margins cancel the
// card's padding so it reaches the edges)
const cardPhotoClass =
  'pointer-events-none select-none object-cover block -mx-6 -mt-6 mb-5 w-[calc(100%+3rem)] h-44 sm:-mx-8 sm:-mt-8 sm:w-[calc(100%+4rem)] ' +
  '[mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.9)_35%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.2)_82%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.9)_35%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.2)_82%,transparent_100%)] ' +
  'md:absolute md:inset-y-0 md:right-0 md:m-0 md:w-[55%] md:h-full ' +
  'md:[mask-image:linear-gradient(to_left,#000_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.7)_38%,rgba(0,0,0,0.4)_58%,rgba(0,0,0,0.15)_78%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_left,#000_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.7)_38%,rgba(0,0,0,0.4)_58%,rgba(0,0,0,0.15)_78%,transparent_100%)]';

const dateChipClass =
  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold whitespace-nowrap';

// Tech/skill tag: grey until hovered, then the icon lights up in the given brand colour
const ColorTag: React.FC<{ icon: IconType; name: string; color: string }> = ({ icon: Icon, name, color }) => (
  <span
    className="group/tag inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors duration-300 hover:text-neutral-900 cursor-default"
    style={{ '--tag-color': color } as React.CSSProperties}
  >
    <Icon className="w-5 h-5 transition-all duration-300 group-hover/tag:text-[var(--tag-color)] group-hover/tag:scale-110" />
    {name}
  </span>
);

const iconBadgeClass = 'w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0';

// The Projects deck shows each project as two consecutive cards: this info card,
// then (one scroll step later) the project's image card.
const cardShell = 'h-full rounded-3xl ring-1 ring-neutral-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden';

const ProjectInfoCard: React.FC<{
  project: ProjectDoc;
  index: number;
  tagColor: (name: string, iconName: string) => string;
}> = ({ project, index, tagColor }) => {
  const Icon = getIcon(project.iconName);
  return (
    <div className={`${cardShell} relative bg-white p-7 sm:p-8 flex flex-col`}>
      {/* Big faint project number for a bit of editorial flair */}
      <span className="absolute top-5 right-6 text-6xl font-bold text-neutral-900/[0.05] select-none tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex items-start gap-4 mb-5 pr-14">
        <div className={iconBadgeClass}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="flex-1 text-xl font-bold text-neutral-900 leading-snug pt-2">{project.title}</h3>
      </div>
      <p className="text-neutral-600 leading-relaxed mb-5">{project.description}</p>
      {project.details.length > 0 && (
        <ul className="space-y-2.5 mb-6">
          {project.details.map((detail, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
      {/* Grey until hovered, then each tag lights up in its matching skill's brand colour */}
      <div className="mt-auto pt-5 border-t border-neutral-100 flex flex-wrap gap-x-5 gap-y-3">
        {project.techIcons.map((tech, i) => (
          <ColorTag key={i} icon={getIcon(tech.iconName)} name={tech.name} color={tagColor(tech.name, tech.iconName)} />
        ))}
      </div>
    </div>
  );
};

// Project image fading to white at the bottom, with the project's links over it
const ProjectImageCard: React.FC<{ project: ProjectDoc }> = ({ project }) => {
  const Icon = getIcon(project.iconName);
  const liveUrl = toExternalUrl(project.liveUrl);
  const repoUrl = toExternalUrl(project.repoUrl);
  const primaryUrl = liveUrl || repoUrl;
  return (
    <div className={`${cardShell} group relative min-h-[260px] bg-gradient-to-br from-neutral-900 to-teal-900`}>
      {project.cover ? (
        <img
          src={project.cover}
          alt={`${project.title} preview`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        // No cover yet: a branded placeholder built from the project's icon
        <Icon className="absolute inset-0 m-auto w-28 h-28 text-white/10" />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
      <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-colors duration-200"
            >
              View project
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover/link:translate-x-0.5">
                <FaArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          )}
          {liveUrl && repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              title="GitHub repository"
              className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-colors duration-200"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          )}
        </div>
        <p className="text-sm font-semibold text-neutral-800 text-right line-clamp-2 max-w-[45%]">{project.title}</p>
      </div>
    </div>
  );
};

// An uploaded logo (company/school/issuer) when there is one, otherwise the dark icon badge
const LogoOrIcon: React.FC<{ logo?: string; fit?: LogoFit; icon: IconType; alt: string }> = ({
  logo,
  fit,
  icon: Icon,
  alt,
}) =>
  logo ? (
    <div
      className={`w-14 h-14 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden ${
        fit === 'cover' ? '' : 'p-1.5'
      }`}
    >
      <img
        src={logo}
        alt={alt}
        className={fit === 'cover' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}
      />
    </div>
  ) : (
    <div className={iconBadgeClass}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  );

// Shared scroll-reveal spring config for section headings (Motion/Framer Motion)
const headingMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// Section title: bold heading with a handwritten caption tucked underneath, overlapping it slightly
const SectionTitle: React.FC<{ title: string; caption: string; className?: string }> = ({
  title,
  caption,
  className = 'mb-12',
}) => (
  <motion.div {...headingMotion} className={`text-center ${className}`}>
    <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h2>
    <span
      aria-hidden
      className="relative block -mt-2.5 sm:-mt-3.5 pl-12 sm:pl-20 font-script text-[1.9rem] sm:text-[2.6rem] leading-none text-teal-500 -rotate-[4deg] select-none"
    >
      {caption}
    </span>
  </motion.div>
);

// Shared hover-lift spring for cards, kept separate from each card's own entrance transition
const cardHover = {
  whileHover: { y: -6, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  viewport: { once: true, margin: '-60px' },
};

// Types out each phrase, pauses, then moves to the next (phrases come from the editable hero)
const TypewriterEffect: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const list = phrases.filter((p) => p.trim()).length ? phrases.filter((p) => p.trim()) : [''];
  const listKey = list.join('|');
  const [phase, setPhase] = useState(0);
  const [index, setIndex] = useState(0);
  const full = list[phase % list.length];

  // Start over when the phrases change (e.g. once the saved hero loads)
  useEffect(() => {
    setPhase(0);
    setIndex(0);
  }, [listKey]);

  useEffect(() => {
    const timeout =
      index <= full.length
        ? setTimeout(() => setIndex(index + 1), 100)
        : setTimeout(() => {
            setIndex(0);
            setPhase((p) => p + 1);
          }, 2000);
    return () => clearTimeout(timeout);
  }, [index, full]);

  return (
    <div className="h-6 overflow-hidden">
      <span className="inline-block font-semibold text-white border-r-2 border-teal-400 whitespace-nowrap overflow-hidden pr-0.5">
        {full.slice(0, index)}
      </span>
    </div>
  );
};

const navItems = ['Home', 'Skills', 'Projects', 'Experience', 'Education', 'Certifications', 'Contact'];
const pillNavItems = navItems.filter((item) => item !== 'Contact');

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Nav shrinks, darkens, and grows a shadow as the page scrolls
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)']);
  const navHeight = useTransform(scrollY, [0, 80], [64, 56]);
  const navShadow = useTransform(
    scrollY,
    [0, 80],
    ['0 0px 0px rgba(0,0,0,0)', '0 8px 24px rgba(0,0,0,0.25)']
  );

  // Hero content/glow drift + fade as the hero scrolls out of view
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroProgress, [0, 1], [0, 50]);
  const heroContentOpacity = useTransform(heroProgress, [0, 1], [1, 0.2]);

  // Starts from the bundled seed content so the page never looks empty,
  // then swaps in live data from Firestore once it arrives (if configured).
  const [skills, setSkills] = useState<SkillDoc[]>(seedSkills);
  const [projects, setProjects] = useState<ProjectDoc[]>(seedProjects);
  const [openCert, setOpenCert] = useState<CertificationDoc | null>(null);
  // Homepage hero text, editable from admin -> Overview
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  useEffect(() => {
    fetchHero().then(setHero).catch(() => setHero(DEFAULT_HERO));
  }, []);
  // Latest "My Corner" articles for the homepage deck (the /corner page has them all)
  const [cornerPosts, setCornerPosts] = useState<Post[]>([]);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  useEffect(() => {
    fetchPosts()
      .then((p) => setCornerPosts(p.slice(0, 10)))
      .catch(() => setCornerPosts([]));
  }, []);
  useEffect(() => {
    if (!openCert) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenCert(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openCert]);
  const [experiences, setExperiences] = useState<ExperienceDoc[]>(seedExperiences);
  const [education, setEducation] = useState<EducationDoc[]>(seedEducation);
  const [certifications, setCertifications] = useState<CertificationDoc[]>(seedCertifications);
  // Activities are personal and change often, so the bundled defaults are only a fallback for when
  // Firebase isn't configured - otherwise start empty and show exactly what's in Firestore (no flash
  // of the defaults before the real cards arrive)
  const [activities, setActivities] = useState<ActivityDoc[]>(firebaseEnabled ? [] : seedActivities);

  useEffect(() => {
    if (!firebaseEnabled) return;
    fetchAll<SkillDoc>('skills').then((data) => data.length && setSkills(data));
    fetchAll<ProjectDoc>('projects').then((data) => data.length && setProjects(data));
    fetchAll<ExperienceDoc>('experiences').then((data) => data.length && setExperiences(data));
    fetchAll<EducationDoc>('education').then((data) => data.length && setEducation(data));
    fetchAll<CertificationDoc>('certifications').then((data) => data.length && setCertifications(data));
    if (firebaseEnabled) fetchAll<ActivityDoc>('activities').then(setActivities).catch(() => setActivities(seedActivities));
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

  // Project tech tags don't store a colour, so borrow the matching skill's brand colour
  // (by name, then by icon); white is skipped since it would vanish on the light cards
  const skillColorFor = (name: string, iconName: string) => {
    const usable = skills.filter((sk) => sk.color && sk.color.toLowerCase() !== '#ffffff');
    const match =
      usable.find((sk) => sk.name.trim().toLowerCase() === name.trim().toLowerCase()) ??
      usable.find((sk) => sk.iconName === iconName);
    return match?.color ?? '#14b8a6';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 relative font-sans">
      <ScrollProgress />

      <motion.nav
        style={{ backgroundColor: navBg, boxShadow: navShadow }}
        className="fixed top-0 left-0 right-0 backdrop-blur-md z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div style={{ height: navHeight }} className="flex justify-between items-center">
            <a href="#home" className="text-base">
              <TypewriterEffect phrases={hero.typewriter} />
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
                <a
                  href="/corner"
                  className="px-4 py-2 rounded-full text-sm font-medium text-teal-300/80 hover:text-teal-300 transition-colors duration-200 whitespace-nowrap"
                >
                  My Corner
                </a>
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
                <a href="/corner" className="block px-2 py-3 text-sm font-medium text-teal-300/80 hover:text-teal-300 transition-colors duration-200">
                  My Corner
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="flex-grow relative z-10">
        {/* Hero Section - dark, matches the reference's dark hero bookend */}
        <section
          ref={heroRef}
          id="home"
          className="scroll-mt-20 min-h-screen min-h-[100svh] flex items-center justify-center relative pt-24 pb-12 overflow-hidden bg-black text-white"
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent z-0" />
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
                  {hero.eyebrow}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                >
                  <span className="text-white">{hero.firstName}</span>
                  <br />
                  <span className="text-teal-400">{hero.lastName}.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-6 text-base sm:text-lg text-white/55 max-w-xl mx-auto md:mx-0"
                >
                  {hero.summary}
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
                <HeroPhoto src={charImage} alt={`${hero.firstName} ${hero.lastName}`} roles={hero.roles} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Strip - cards start gathered in the middle and spread to their places as you scroll in;
            teal accent, lift and watermark icon on hover */}
        <section className="relative py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SpreadGrid
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
              baseCols={2}
              lgCols={4}
            >
              {[
                { label: 'Years Experience', caption: 'Data analytics & AI', value: 1, suffix: '+', icon: FaBriefcase },
                {
                  label: 'Companies',
                  caption: 'Hands-on industry work',
                  // Several roles can share one company, so count distinct company names
                  value: new Set(experiences.map((e) => e.company.trim().toLowerCase())).size,
                  suffix: '',
                  icon: FaIndustry,
                },
                { label: 'Certifications', caption: 'Industry-recognised', value: certifications.length, suffix: '', icon: FaCertificate },
                { label: 'Core Skills', caption: 'Tools & technologies', value: skills.length, suffix: '+', icon: FaGraduationCap },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,118,110,0.12)]"
                  >
                    {/* Accent bar that sweeps across the top on hover */}
                    <span className="absolute top-0 left-0 h-1 w-0 bg-teal-400 transition-all duration-500 group-hover:w-full" />
                    {/* Oversized faint icon in the corner for depth */}
                    <Icon className="absolute -right-5 -bottom-5 w-28 h-28 sm:w-32 sm:h-32 text-neutral-900/[0.04] transition-all duration-500 group-hover:text-teal-500/10 group-hover:-rotate-12 group-hover:scale-110" />

                    {/* Numbers lead - no icon badge; the faint watermark icon carries the theme */}
                    <div className="relative">
                      <p className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-none transition-colors duration-300 group-hover:text-teal-600">
                        <CountUp end={stat.value} />
                        {stat.suffix && <span className="text-teal-500">{stat.suffix}</span>}
                      </p>
                      <p className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-800 mt-4 sm:mt-5">{stat.label}</p>
                      <p className="text-sm sm:text-base text-neutral-500 mt-1">{stat.caption}</p>
                    </div>
                  </div>
                );
              })}
            </SpreadGrid>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-20 py-20 relative bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Skills" caption="that matter" className="mb-12" />

            {/* Single row scrolling right to left - grey until hovered, and hovering pauses it */}
            <div className="overflow-hidden -mx-4 sm:mx-0">
              <div
                className="marquee"
                style={{ '--marquee-duration': `${Math.max(skills.length, 6) * 3}s` } as React.CSSProperties}
              >
                {[0, 1].map((copy) =>
                  skills.map((skill) => {
                    const Icon = getIcon(skill.iconName);
                    return (
                      <div
                        key={`${copy}-${skill.id ?? skill.name}`}
                        aria-hidden={copy === 1}
                        className="group flex-shrink-0 pr-8"
                        style={{ '--skill-color': skill.color } as React.CSSProperties}
                      >
                        <div className="flex flex-col items-center justify-center px-4 py-3 min-w-[120px] transition-transform duration-300 group-hover:-translate-y-1">
                          <Icon className="w-16 h-16 mb-4 text-neutral-400 transition-colors duration-300 group-hover:text-[var(--skill-color)]" />
                          <p className="text-sm font-medium text-center text-neutral-500 whitespace-nowrap transition-colors duration-300 group-hover:text-neutral-900">
                            {skill.name}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Extra Activities - same card as Education: info on the left, a photo fading in from the
            right, and an optional "View" link */}
        {activities.length > 0 && (
          <section id="activities" className="scroll-mt-20 py-20 relative bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle title="Extra Activities" caption="beyond the desk" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activities.map((activity, index) => {
                  const Icon = getIcon(activity.iconName);
                  const link = toExternalUrl(activity.link);
                  return (
                    <motion.div
                      key={activity.id ?? activity.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      {...cardHover}
                      transition={{ delay: (index % 2) * 0.1 }}
                      className="group relative h-full overflow-hidden rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(15,118,110,0.12)]"
                    >
                      {activity.image && <img src={activity.image} alt="" aria-hidden className={cardPhotoClass} />}
                      <div className={`relative h-full flex flex-col ${activity.image ? 'md:w-[60%]' : ''}`}>
                        <div className={iconBadgeClass}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="mt-5 text-lg sm:text-xl font-bold text-neutral-900 leading-snug">{activity.title}</h3>
                        {activity.description && (
                          <p className="mt-2 text-neutral-600 leading-relaxed">{activity.description}</p>
                        )}
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link mt-auto pt-5 inline-flex items-center gap-2 w-fit text-sm font-semibold text-teal-600 hover:text-teal-700"
                          >
                            View
                            <FaArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section - a deck of cards; scrolling flings each one aside to reveal the next */}
        <section id="projects" className="scroll-mt-20 py-20 relative bg-white overflow-x-clip">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <CardStack
              header={
                <SectionTitle title="Projects" caption="built with purpose" className="mb-8 md:mb-10" />
              }
              cards={projects.flatMap((project, index) => {
                const key = project.id ?? project.title;
                return [
                  <ProjectInfoCard key={`${key}-info`} project={project} index={index} tagColor={skillColorFor} />,
                  <ProjectImageCard key={`${key}-image`} project={project} />,
                ];
              })}
            />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-20 py-20 relative bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Experience" caption="the journey so far" className="mb-12" />
            <JourneyTimeline>
              {experiences.map((exp, index) => {
                const Icon = getIcon(exp.iconName);
                const CompanyIcon = getIcon(exp.companyIconName);
                return (
                <TimelineStop key={exp.id ?? index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  {...cardHover}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(15,118,110,0.12)] group-data-[reached=true]/stop:ring-teal-400/40"
                >
                  {/* Teal edge that fills in once the timeline pin reaches this stop */}
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-teal-600 origin-top scale-y-0 transition-transform duration-700 group-data-[reached=true]/stop:scale-y-100" />
                  {/* Photo on the right that fades into the card (a banner on top on phones) */}
                  {exp.image && <img src={exp.image} alt="" aria-hidden className={cardPhotoClass} />}
                  <div className={exp.image ? 'relative md:w-[60%]' : 'relative'}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                      <LogoOrIcon logo={exp.logo} fit={exp.logoFit} icon={Icon} alt={`${exp.company} logo`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">{exp.title}</h3>
                          <span className={dateChipClass}>
                            <FaCalendarAlt className="w-3 h-3" />
                            {exp.period}
                          </span>
                        </div>
                        <p className="mt-1.5 text-neutral-600 font-medium flex items-center gap-2">
                          <CompanyIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="sm:pl-[76px]">
                      {exp.description && <p className="mt-5 text-neutral-600 leading-relaxed">{exp.description}</p>}
                      {exp.achievements.length > 0 && (
                        <ul className="mt-4 space-y-2.5">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {exp.skills.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-wrap gap-x-5 gap-y-3">
                          {exp.skills.map((skill, i) => (
                            <ColorTag
                              key={i}
                              icon={getIcon(skill.iconName)}
                              name={skill.name}
                              color={skillColorFor(skill.name, skill.iconName)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                </TimelineStop>
                );
              })}
            </JourneyTimeline>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="scroll-mt-20 py-20 relative bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Education" caption="where it all began" className="mb-12" />
            <JourneyTimeline>
              {education.map((edu, index) => {
                const Icon = getIcon(edu.iconName);
                return (
                <TimelineStop key={edu.id ?? index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  {...cardHover}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(15,118,110,0.12)] group-data-[reached=true]/stop:ring-teal-400/40"
                >
                  {/* Teal edge that fills in once the timeline pin reaches this stop */}
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-teal-600 origin-top scale-y-0 transition-transform duration-700 group-data-[reached=true]/stop:scale-y-100" />
                  {/* Photo on the right that fades into the card (a banner on top on phones) */}
                  {edu.image && <img src={edu.image} alt="" aria-hidden className={cardPhotoClass} />}
                  <div className={edu.image ? 'relative md:w-[60%]' : 'relative'}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                      <LogoOrIcon logo={edu.logo} fit={edu.logoFit} icon={Icon} alt={`${edu.institution} logo`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">{edu.degree}</h3>
                          <span className={dateChipClass}>
                            <FaCalendarAlt className="w-3 h-3" />
                            {edu.year}
                          </span>
                        </div>
                        <p className="mt-1.5 text-neutral-600 font-medium flex items-start gap-2">
                          <FaUniversity className="w-4 h-4 mt-1 text-neutral-400 flex-shrink-0" />
                          {edu.institution}
                        </p>
                      </div>
                    </div>

                    <div className="sm:pl-[76px]">
                      {edu.description && (
                        <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900 text-white">
                          <FaAward className="w-4 h-4 text-teal-400" />
                          <span className="font-bold tracking-tight">{edu.description}</span>
                        </div>
                      )}
                      {edu.achievements.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                          {edu.achievements.map((achievement, i) => (
                            <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600">
                              <FaMedal className="w-4 h-4 text-amber-500" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                </TimelineStop>
                );
              })}
            </JourneyTimeline>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="scroll-mt-20 py-20 relative bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Certifications" caption="proof of learning" className="mb-12" />
            {certifications.length > 3 ? (
              // More than fit in one row: drift slowly right to left like the skills (hover pauses),
              // with the edges fading out
              <div className="overflow-hidden -mx-4 sm:mx-0 py-4 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
                <div
                  className="marquee"
                  style={{ '--marquee-duration': `${certifications.length * 9}s` } as React.CSSProperties}
                >
                  {[0, 1].map((copy) =>
                    certifications.map((cert, index) => (
                      <div
                        key={`${copy}-${cert.id ?? index}`}
                        aria-hidden={copy === 1}
                        className="w-[280px] sm:w-[340px] flex-shrink-0 pr-8"
                      >
                        <CertificateFrame cert={cert} onOpen={() => setOpenCert(cert)} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              // A few certificates: gathered in the middle, spreading to their places as you scroll in
              <SpreadGrid
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                baseCols={1}
                smCols={2}
                lgCols={3}
              >
                {certifications.map((cert, index) => (
                  <div key={cert.id ?? index} className="rounded-xl bg-white">
                    <CertificateFrame cert={cert} onOpen={() => setOpenCert(cert)} />
                  </div>
                ))}
              </SpreadGrid>
            )}
          </div>
        </section>

        {/* My Corner - latest articles in the same scroll deck as Projects, one card per article */}
        {cornerPosts.length > 0 && (
          <section id="corner" className="scroll-mt-20 py-20 relative bg-white overflow-x-clip">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <CardStack
                header={
                  <div className="text-center mb-8 md:mb-10">
                    <SectionTitle title="My Corner" caption="life beyond data" className="mb-1" />
                    <a
                      href="/corner"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-teal-600 hover:text-teal-700"
                    >
                      View all posts <FaArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                }
                // A little narrower than the Projects deck - these are single photo cards
                widthClass="max-w-md"
                cards={cornerPosts.map((post) => (
                  <CornerCard key={post.id} post={post} onOpen={() => setOpenPost(post)} />
                ))}
              />
            </div>
          </section>
        )}
        {createPortal(
          <AnimatePresence>{openPost && <PostModal post={openPost} onClose={() => setOpenPost(null)} />}</AnimatePresence>,
          document.body
        )}

        {/* Full-size certificate viewer - portalled to <body>, since <main> is its own stacking
            context below the fixed nav, which would otherwise cover the viewer's top */}
        {createPortal(
        <AnimatePresence>
          {openCert?.image && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenCert(null)}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
            >
              <button
                onClick={() => setOpenCert(null)}
                aria-label="Close"
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white text-black font-bold shadow-lg hover:bg-neutral-200 transition-colors duration-200"
              >
                ✕
              </button>
              <motion.div
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.94 }}
                className="flex flex-col items-center max-w-5xl w-full cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Frame hugs the image; the image is capped so the whole thing (plus caption) fits the screen */}
                <div className="rounded-xl p-[2px] max-w-full" style={goldFrameStyle}>
                  <div className="rounded-[10px] bg-white p-2 sm:p-3">
                    <img
                      src={openCert.image}
                      alt={`${openCert.title} certificate`}
                      className="block max-w-full max-h-[calc(100vh-10rem)] w-auto h-auto object-contain"
                    />
                  </div>
                </div>
                <p className="mt-4 text-center text-white font-semibold text-lg">{openCert.title}</p>
                <p className="text-center text-[#e8cf7a] text-xs uppercase tracking-[0.2em] mt-1">{openCert.issuer}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
        )}

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20 py-20 relative bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Contact Me" caption="let's build together" className="mb-12" />

            {/* Contact Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 mb-12"
            >
              <a
                href="tel:+919325109257"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 transition-colors duration-200 group"
                title="Call me"
              >
                <FaPhoneAlt className="w-4 h-4 text-neutral-600 group-hover:text-black transform -rotate-90" />
              </a>
              <a
                href="mailto:lalitshirsath008@gmail.com"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 transition-colors duration-200 group"
                title="Email me"
              >
                <FaEnvelope className="w-4 h-4 text-neutral-600 group-hover:text-black" />
              </a>
              <a
                href="https://github.com/lalitshirsath008"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 transition-colors duration-200 group"
                title="GitHub"
              >
                <FaGithub className="w-4 h-4 text-neutral-600 group-hover:text-black" />
              </a>
              <a
                href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 transition-colors duration-200 group"
                title="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4 text-neutral-600 group-hover:text-black" />
              </a>
              <a
                href="https://www.instagram.com/_lalitz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 transition-colors duration-200 group"
                title="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-neutral-600 group-hover:text-black" />
              </a>
            </motion.div>

            {/* Contact Form */}
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-neutral-500">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full rounded-lg bg-white border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-teal-400 focus:outline-none transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-neutral-500">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-2 block w-full rounded-lg bg-white border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-teal-400 focus:outline-none transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-neutral-500">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="mt-2 block w-full rounded-lg bg-white border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:border-teal-400 focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Your message"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={formStatus.submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-neutral-900 text-white py-3.5 px-4 rounded-full font-semibold hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? 'Sending...' : 'Send Message'}
                </motion.button>
                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-center"
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
                    className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center"
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

      {/* Footer - dark bookend matching the reference, with a teal radial glow */}
      <footer className="relative overflow-hidden bg-black pt-20 pb-8 z-10">
        <img
          src={dotTexture}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[700px] opacity-30 pointer-events-none select-none"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xl font-bold text-white mb-2">Lalit Shirsath</p>
              {/* Every name people search for, in plain text (helps Google tie them to this site) */}
              <p className="text-white/50 text-sm leading-relaxed">
                Lalit Sanjay Shirsath, also known as{' '}
                <a href="https://www.instagram.com/jhakaas.lalit/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-teal-400">
                  Jhakaas Lalit
                </a>{' '}
                - Data Analyst &amp; AI Developer, and Marathi content creator.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Explore</p>
              <div className="flex flex-col gap-2.5 text-sm">
                {pillNavItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit"
                  >
                    {item}
                  </a>
                ))}
                <a href="/corner" className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit">
                  My Corner
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Connect</p>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="mailto:lalitshirsath008@gmail.com" className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit">
                  Email
                </a>
                <a href="tel:+919325109257" className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit">
                  Phone
                </a>
                <a
                  href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/lalitshirsath008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-teal-400 transition-colors duration-200 w-fit"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Social</p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/_lalitz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black text-white/70 transition-colors duration-200"
                  title="Instagram"
                >
                  <FaInstagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/jhakaas.lalit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-full border border-white/15 inline-flex items-center gap-1.5 text-xs font-semibold hover:border-teal-400 hover:bg-teal-400 hover:text-black text-white/70 transition-colors duration-200"
                  title="Jhakaas Lalit on Instagram"
                >
                  <FaInstagram className="w-3.5 h-3.5" /> @jhakaas.lalit
                </a>
                <a
                  href="https://github.com/lalitshirsath008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black text-white/70 transition-colors duration-200"
                  title="GitHub"
                >
                  <FaGithub className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/lalit-shirsath-2a6526310/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-teal-400 hover:bg-teal-400 hover:text-black text-white/70 transition-colors duration-200"
                  title="LinkedIn"
                >
                  <FaLinkedin className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
          <p className="pt-8 text-center text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Lalit Shirsath. All rights reserved.
          </p>
        </div>
      </footer>

      <JackChat />
    </div>
  );
}

export default App;
