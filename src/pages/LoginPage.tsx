import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Newspaper, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

type LoginPageProps = {
  onNavigate: (path: string) => void;
};

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    // Mock authentication API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      // After a short delay, navigate back to home or admin
      setTimeout(() => {
        onNavigate('/');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:grid md:grid-cols-2 bg-neutral-50">
      {/* Left Column: Hero Section */}
      <div className="relative hidden md:flex flex-col justify-between p-12 bg-neutral-950 text-white overflow-hidden">
        {/* Background Decorative Pattern / Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=1200"
            alt=""
            className="w-full h-full object-cover filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent" />
        </div>

        {/* Content Container (Top) */}
        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-baseline gap-1 focus:outline-none"
            aria-label="IGBE News home"
          >
            <span className="text-3xl font-extrabold tracking-tight text-white">
              IGBE
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-red-500">
              NEWS
            </span>
          </button>
        </div>

        {/* Content Container (Middle - Hero message) */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
            <Newspaper className="w-3.5 h-3.5" />
            Ikorodu Division's No. 1 Voice
          </span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Stay Connected. <br />
            <span className="text-red-500">Stay Informed.</span>
          </h1>
          <p className="text-neutral-300 text-base leading-relaxed">
            Get instant access to verified reporting, live RSS news aggregation, and community-driven stories from across Igbe Laara, Igbogbo, Ijede, Ebute, Elepe, and beyond.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <span>Reporting from local communities in Lagos State</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>Real-time news aggregation & analysis</span>
            </div>
          </div>
        </div>

        {/* Content Container (Bottom) */}
        <div className="relative z-10 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} IGBE News. Built for the Ikorodu community.</p>
        </div>
      </div>

      {/* Right Column: Input Form for User Credentials */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            {/* Mobile Header Logo */}
            <div className="flex md:hidden items-center justify-between mb-6">
              <button
                onClick={() => onNavigate('/')}
                className="flex items-baseline gap-1"
              >
                <span className="text-2xl font-bold tracking-tight text-neutral-900">
                  IGBE
                </span>
                <span className="text-2xl font-bold tracking-tight text-red-600">
                  NEWS
                </span>
              </button>
              <button
                onClick={() => onNavigate('/')}
                className="p-1 text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label="Back to home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-neutral-500 text-sm">
              Enter your credentials below to access your IGBE News dashboard
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Login successful! Redirecting to home...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-neutral-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-neutral-900 placeholder:text-neutral-400 text-sm transition-colors disabled:bg-neutral-50 disabled:text-neutral-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setError('Password reset is not configured.')}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-neutral-900 placeholder:text-neutral-400 text-sm transition-colors disabled:bg-neutral-50 disabled:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading || success}
                  className="w-4 h-4 rounded border-neutral-300 text-red-600 focus:ring-red-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-600">
                  Remember me for 30 days
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-55 shadow-sm"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-500">
              Don't have an account yet?{' '}
              <button
                onClick={() => setError('Registration is currently restricted to administrators.')}
                className="font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
