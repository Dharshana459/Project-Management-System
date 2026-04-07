import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers } from 'lucide-react';

const Login = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    let success = false;

    if (isLogin) {
      success = await login(email, password);
      if (!success) setError('Invalid login credentials or unverified email.');
    } else {
      success = await signup(email, password);
      if (!success) setError('Failed to sign up. Ensure password is secure.');
      else setError('Success! If email verification is enabled, please check your inbox.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative z-10">
      {/* Decorative background elements for premium feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 dotted-bg">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-secondary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="bg-surface/90 backdrop-blur-xl p-8 rounded-3xl shadow-modal border border-borderLight/60 w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg text-white font-bold text-2xl">
            K
          </div>
          <h1 className="text-2xl font-bold text-textMain tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-textMuted text-sm mt-1">{isLogin ? 'Sign in to your workspace' : 'Join the kanban workspace'}</p>
        </div>

        {error && (
          <div className={`mb-6 p-3 ${error.includes('Success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'} border rounded-xl text-sm font-medium text-center`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-textMain mb-1.5 px-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-cardHover border border-borderLight rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all duration-200 text-textMain placeholder:text-textSoft font-medium shadow-sm"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMain mb-1.5 px-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-cardHover border border-borderLight rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all duration-200 text-textMain shadow-sm font-medium"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-premium mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium border-t border-borderLight/60 pt-6">
          <p className="text-textMuted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-primary hover:underline font-bold"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
