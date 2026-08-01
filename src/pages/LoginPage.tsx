import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

type LoginPageProps = {
  onNavigate: (path: string) => void;
};

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Standard email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      // Navigate to admin if it's admin credentials, else home page
      if (email.toLowerCase() === 'admin@igbenews.com') {
        onNavigate('/admin');
      } else {
        onNavigate('/');
      }
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-stretch">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">

        {/* Left Column (Hero Section) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-neutral-900 relative items-center justify-center p-12 text-white overflow-hidden">
          {/* Ambient Background Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

          {/* Journalistic theme overlay images or visuals */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/80 via-neutral-950 to-neutral-900 opacity-95 z-0" />

          <div className="relative z-10 max-w-lg space-y-8">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-white">IGBE</span>
                <span className="text-4xl font-extrabold tracking-tight text-red-600">NEWS</span>
              </div>
              <p className="text-neutral-400 text-sm uppercase tracking-widest font-bold">
                Ikorodu Division's Digital Pulse
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
              Empowering communities through accurate, local journalism.
            </h2>

            <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
              <p>
                Access your editor portal to manage active news feeds, write stories, adjust homepage pinned settings, and coordinate reporting across the eight key towns of our division.
              </p>
              <p className="text-xs text-neutral-500 italic">
                Reporting directly from Igbe Laara, Igbogbo, Igboke, Ginti, Ijede, Oreyo, Ebute, and Elepe.
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>© {new Date().getFullYear()} IGBE News</span>
              <span>Standards & Ethics Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Column (Login Form Section) */}
        <div className="col-span-11 lg:col-span-6 xl:col-span-5 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-16 bg-white">
          <div className="w-full max-w-md space-y-8">

            {/* Header mobile brand info */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <button
                onClick={() => onNavigate('/')}
                className="self-start inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                Back to Home
              </button>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-extrabold tracking-tight text-neutral-900">IGBE</span>
                <span className="text-3xl font-extrabold tracking-tight text-red-600">NEWS</span>
              </div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Ikorodu Division's Digital Pulse
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-neutral-500">
                Welcome back! Enter your portal credentials below to continue.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4.5 h-4.5 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="editor@igbenews.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setError('Please contact your administrator for password recovery.')}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4.5 h-4.5 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 outline-none focus:bg-white focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Keep me logged in */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-red-600 focus:ring-red-600/30 accent-red-600"
                  />
                  <span className="text-sm text-neutral-600 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-neutral-200 text-center">
              <p className="text-xs text-neutral-500">
                Are you a local citizen contributor with stories? <br />
                <button
                  onClick={() => onNavigate('/contact')}
                  className="mt-1.5 text-red-600 hover:text-red-700 hover:underline font-bold"
                >
                  Apply to become an Editor &rarr;
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
