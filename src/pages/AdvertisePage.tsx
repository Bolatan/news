import React, { useState } from 'react';
import { ChevronRight, Percent, Monitor, MessageSquare, Mail, CheckCircle } from 'lucide-react';

type AdvertisePageProps = {
  onNavigate: (path: string) => void;
};

export default function AdvertisePage({ onNavigate }: AdvertisePageProps) {
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('banner');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setCompany('');
      setContactName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Advertise</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        Advertise with IGBE News
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        Promote your brand, product, or community event to a highly engaged local audience in the Ikorodu division.
      </p>

      {/* Intro Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <div className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg mb-2">Display Banner Ads</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Place prominent header leaderboards, responsive sidebar cards, or inline-article banners. Benefit from high-visibility impressions across all device types.
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 mt-4 block">Starts at ₦25,000 / month</span>
        </div>

        <div className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg mb-2">Sponsored Articles</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Publish expertly crafted editorial features, profile pieces, or corporate announcements. Includes promotion across our newsfeed, categories, and tags.
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 mt-4 block">Starts at ₦40,000 / article</span>
        </div>

        <div className="p-6 border border-neutral-200 rounded-xl bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-lg mb-2">Social & Newsletter</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Blast your brand straight to our dedicated community newsletter and active Facebook, Instagram, and LinkedIn channels covering the division.
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 mt-4 block">Starts at ₦15,000 / blast</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Why Partner With Us?</h2>
          <p className="text-neutral-700 leading-relaxed">
            As the dedicated, hyper-local news aggregator and journal for Ikorodu, <strong>IGBE News</strong> reaches thousands of business owners, local residents, decision-makers, and commuters every day.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Our readers trust us because of our strict editorial standards and dedication to truth. By placing your advertisements with IGBE News, you are positioning your brand directly in front of an active, highly localized demographic in Lagos State's fastest growing division.
          </p>
          <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">Download Media Kit</h4>
            <p className="text-xs text-neutral-500">
              Get our comprehensive rate sheet, demographic breakdown, traffic statistics, and customized ad dimension requirements.
            </p>
            <a
              href="mailto:ad-sales@igbenews.com?subject=Requesting%20Media%20Kit"
              className="inline-flex items-center gap-2 text-xs bg-neutral-800 hover:bg-neutral-950 text-white font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Request Rate Card & Kit
            </a>
          </div>
        </div>

        {/* Ad Inquiry Form */}
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Inquiry Submitted Successfully!</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Thank you for your interest in advertising with IGBE News. Our ad operations desk will review your details and contact you with customized packages within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900">Request Advertising Info</h3>
              <p className="text-xs text-neutral-500">
                Let us know what you need and our sales specialists will draft a custom quote tailored to your budget.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Company Name *</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder="e.g. Ikorodu Trading Corp"
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Contact Person *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    placeholder="Ade Adebayo"
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="sales@company.com"
                    className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Advertising Format Interest</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="banner">Display Banner Advertising</option>
                  <option value="sponsored">Sponsored Editorial Articles</option>
                  <option value="social-blast">Social Media & Newsletter Blasts</option>
                  <option value="custom">All / Custom Partnership Package</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Estimated Budget & Campaign Goals</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your brand, budget, and when you want to launch..."
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
              >
                {submitting ? 'Sending Request...' : 'Send Inquiry Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
