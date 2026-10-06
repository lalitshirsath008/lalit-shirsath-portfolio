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
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/[0.03] border border-white/15 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>

        {!firebaseEnabled && (
          <p className="mb-4 p-3 rounded-lg border border-white/20 text-white/70 text-sm">
            Firebase isn't configured yet. Fill in <code>.env</code> (see <code>.env.example</code>) and restart
            the dev server.
          </p>
        )}

        <div className="mb-4">
          <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full rounded-lg bg-white/[0.03] border border-white/15 px-3 py-2 text-white focus:border-white/50 focus:outline-none transition-colors duration-200"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full rounded-lg bg-white/[0.03] border border-white/15 px-3 py-2 text-white focus:border-white/50 focus:outline-none transition-colors duration-200"
          />
        </div>
        {error && <p className="mb-4 text-white/70 text-sm font-medium">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-white/85 transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <a href="/" className="block mt-4 text-center text-xs text-white/40 hover:text-white transition-colors duration-200">
          ← Back to site
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
