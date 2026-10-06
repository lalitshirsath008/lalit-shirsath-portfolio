import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import LoginForm from './LoginForm';
import OverviewPanel from './OverviewPanel';
import { SkillsPanel, ProjectsPanel, ExperiencePanel, EducationPanel } from './panels';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
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
      <div className="min-h-screen bg-black flex items-center justify-center text-bauhaus-cream font-sans">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-black text-bauhaus-cream font-sans">
      <nav className="border-b-4 border-bauhaus-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="font-display uppercase text-bauhaus-yellow text-sm">
              ← Lalit Shirsath Portfolio
            </a>
            <p className="text-bauhaus-cream/50 text-xs truncate max-w-[200px]">{user.email}</p>
          </div>
          <div className="flex overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-2 px-4 font-bold uppercase tracking-wide text-sm whitespace-nowrap transition-colors duration-150 ${
                  tab === t.key ? 'bg-bauhaus-yellow text-black' : 'text-bauhaus-cream hover:bg-bauhaus-cream hover:text-black'
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
      </main>
    </div>
  );
};

export default AdminApp;
