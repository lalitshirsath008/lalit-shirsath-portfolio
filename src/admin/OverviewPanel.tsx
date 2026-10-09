import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { replaceCollection } from '../lib/content';
import HeroEditor from './HeroEditor';
import {
  seedSkills,
  seedProjects,
  seedExperiences,
  seedEducation,
  seedCertifications,
} from '../lib/seedData';

const OverviewPanel: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const runSeed = async () => {
    if (
      !window.confirm(
        'This makes every collection match the bundled starter content exactly: it overwrites items that ' +
          'share an id with the starter set, and DELETES anything else - including items you added yourself ' +
          'or content from a previous version of this site. Continue?'
      )
    ) {
      return;
    }
    setSeeding(true);
    setMessage('');
    try {
      await replaceCollection('skills', seedSkills);
      await replaceCollection('projects', seedProjects);
      await replaceCollection('experiences', seedExperiences);
      await replaceCollection('education', seedEducation);
      await replaceCollection('certifications', seedCertifications);
      setMessage('Starter content seeded. Switch tabs to see it, or refresh the public site.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Seeding failed.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
      <p className="text-white/55 mb-6 max-w-2xl">
        Edit the homepage hero below, and use the tabs above to add, edit, reorder or delete Skills, Projects,
        Experience, Education, Certifications, Activities and My Corner posts. Changes save straight to Firestore and
        show up on the public site the next time it loads.
      </p>

      <HeroEditor />

      <div className="p-6 rounded-2xl border border-white/15 mb-6 max-w-xl">
        <h4 className="font-semibold text-white mb-2">Reset to resume content</h4>
        <p className="text-white/55 text-sm mb-4">
          Syncs every collection to exactly match the bundled starter content (sourced from the latest resume).
          Use this the first time you connect Firebase, or any time you want to wipe out old/test data and start
          clean - it deletes anything not in the starter set, so don't use it if you've added your own entries
          you want to keep.
        </p>
        <button
          onClick={runSeed}
          disabled={seeding}
          className="px-5 py-2 bg-white text-black font-semibold text-sm rounded-full hover:bg-white/85 transition-colors duration-200 disabled:opacity-50"
        >
          {seeding ? 'Seeding...' : 'Seed starter content'}
        </button>
        {message && <p className="mt-3 text-white/70 text-sm">{message}</p>}
      </div>

      <button
        onClick={() => auth && signOut(auth)}
        className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/10 hover:border-red-500/60 transition-colors duration-200"
      >
        Sign out
      </button>
    </div>
  );
};

export default OverviewPanel;
