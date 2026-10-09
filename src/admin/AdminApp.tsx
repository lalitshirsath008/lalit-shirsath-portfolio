import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import LoginForm from './LoginForm';
import OverviewPanel from './OverviewPanel';
import CornerPanel from './CornerPanel';
import { SkillsPanel, ProjectsPanel, ExperiencePanel, EducationPanel, CertificationsPanel, ActivitiesPanel } from './panels';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'activities', label: 'Activities' },
  { key: 'corner', label: 'My Corner' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const AdminApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('overview');

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="font-semibold text-white text-sm hover:text-white/70 transition-colors duration-200">
              ← Lalit Shirsath Portfolio
            </a>
            <p className="text-white/40 text-xs truncate max-w-[200px]">{user.email}</p>
          </div>
          <div className="flex overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 border-b-2 ${
                  tab === t.key ? 'text-white border-white' : 'text-white/45 border-transparent hover:text-white/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tab === 'overview' && <OverviewPanel />}
        {tab === 'skills' && <SkillsPanel />}
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'experience' && <ExperiencePanel />}
        {tab === 'education' && <EducationPanel />}
        {tab === 'certifications' && <CertificationsPanel />}
        {tab === 'activities' && <ActivitiesPanel />}
        {tab === 'corner' && <CornerPanel />}
      </main>
    </div>
  );
};

export default AdminApp;
