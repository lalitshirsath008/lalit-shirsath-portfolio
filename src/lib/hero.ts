import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/** Editable homepage hero (admin -> Overview). Stored as one Firestore doc: site/hero. */
export interface HeroContent {
  typewriter: string[]; // phrases typed out in the nav, top-left
  eyebrow: string; // small teal line above the name
  firstName: string; // white
  lastName: string; // teal
  summary: string; // paragraph under the name
  roles: string[]; // name plates around the photo on hover (up to 5)
}

export const MAX_HERO_ROLES = 5;

export const DEFAULT_HERO: HeroContent = {
  typewriter: ['Lalit Shirsath', 'Data Analyst', 'Business Intelligence', 'Power BI'],
  eyebrow: 'Data Analyst',
  firstName: 'Lalit',
  lastName: 'Shirsath',
  summary:
    'Data Analyst with 1 year of experience in SQL, Python, Excel, and Power BI, specializing in business intelligence, KPI reporting, and predictive analytics. I build dashboards, automate data workflows, and turn raw data into decisions.',
  roles: ['AI Developer', 'Data Analyst', 'Influencer', 'AI Trainer', 'Photo & Video Editor'],
};

const heroRef = () => (db ? doc(db, 'site', 'hero') : null);

/** Saved hero merged over the defaults, so a missing or partial doc still renders fully. */
export async function fetchHero(): Promise<HeroContent> {
  const ref = heroRef();
  if (!ref) return DEFAULT_HERO;
  const snap = await getDoc(ref);
  return snap.exists() ? { ...DEFAULT_HERO, ...(snap.data() as Partial<HeroContent>) } : DEFAULT_HERO;
}

export async function saveHero(hero: HeroContent) {
  const ref = heroRef();
  if (!ref) throw new Error('Firebase is not configured yet.');
  await setDoc(ref, hero);
}
