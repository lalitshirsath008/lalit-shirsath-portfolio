import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseEnabled } from '../lib/firebase';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError('Firebase is not configured yet. Add your .env values and restart the dev server.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-black border-4 border-bauhaus-cream p-8">
        <h1 className="font-display uppercase text-2xl text-bauhaus-cream mb-6 flex items-center gap-3">
          <span className="w-4 h-4 bg-bauhaus-red flex-shrink-0" />
          Admin Login
        </h1>

        {!firebaseEnabled && (
          <p className="mb-4 p-3 border-2 border-bauhaus-yellow text-bauhaus-yellow text-sm">
            Firebase isn't configured yet. Fill in <code>.env</code> (see <code>.env.example</code>) and restart
            the dev server.
          </p>
        )}

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/70 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full bg-black border-2 border-bauhaus-cream px-3 py-2 text-bauhaus-cream focus:border-bauhaus-yellow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-bauhaus-cream/70 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full bg-black border-2 border-bauhaus-cream px-3 py-2 text-bauhaus-cream focus:border-bauhaus-yellow focus:outline-none"
          />
        </div>
        {error && <p className="mb-4 text-bauhaus-red text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-bauhaus-yellow text-black py-3 font-bold uppercase border-2 border-black shadow-[6px_6px_0_0_#F2ECDE] hover:shadow-[0px_0px_0_0_#F2ECDE] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-150 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <a href="/" className="block mt-4 text-center text-xs text-bauhaus-cream/50 hover:text-bauhaus-cream">
          ← Back to site
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
