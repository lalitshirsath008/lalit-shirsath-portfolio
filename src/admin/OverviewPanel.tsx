import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { seedItem } from '../lib/content';
import { seedSkills, seedProjects, seedExperiences, seedEducation } from '../lib/seedData';

const OverviewPanel: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const runSeed = async () => {
    if (
      !window.confirm(
        'This writes the original portfolio content into Firestore, using fixed ids. ' +
          'If you already edited an item that shares one of those ids, this will overwrite it back to the original. Continue?'
      )
    ) {
      return;
    }
    setSeeding(true);
    setMessage('');
    try {
      for (const { id, ...rest } of seedSkills) await seedItem('skills', id, rest);
      for (const { id, ...rest } of seedProjects) await seedItem('projects', id, rest);
      for (const { id, ...rest } of seedExperiences) await seedItem('experiences', id, rest);
      for (const { id, ...rest } of seedEducation) await seedItem('education', id, rest);
      setMessage('Starter content seeded. Switch tabs to see it, or refresh the public site.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Seeding failed.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <h3 className="font-display uppercase text-xl text-bauhaus-cream mb-4">Overview</h3>
      <p className="text-bauhaus-cream/70 mb-6 max-w-2xl">
        Use the tabs above to add, edit, reorder or delete Skills, Projects, Experience and Education. Changes save
        straight to Firestore and show up on the public site the next time it loads.
      </p>

      <div className="p-6 border-4 border-bauhaus-yellow mb-6 max-w-xl">
        <h4 className="font-display uppercase text-bauhaus-cream mb-2">First time here?</h4>
        <p className="text-bauhaus-cream/70 text-sm mb-4">
          If your collections are empty, seed them with the portfolio's original content as a starting point — then
          edit or delete from there.
        </p>
        <button
          onClick={runSeed}
          disabled={seeding}
          className="px-5 py-2 bg-bauhaus-yellow text-black font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#F2ECDE] hover:shadow-[0px_0px_0_0_#F2ECDE] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150 disabled:opacity-50"
        >
          {seeding ? 'Seeding...' : 'Seed starter content'}
        </button>
        {message && <p className="mt-3 text-bauhaus-cream/80 text-sm">{message}</p>}
      </div>

      <button
        onClick={() => auth && signOut(auth)}
        className="px-4 py-2 border-2 border-bauhaus-red text-bauhaus-red font-bold uppercase text-sm hover:bg-bauhaus-red hover:text-black transition-colors duration-150"
      >
        Sign out
      </button>
    </div>
  );
};

export default OverviewPanel;
