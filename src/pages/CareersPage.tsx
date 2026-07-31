import React, { useState } from 'react';
import { ChevronRight, Briefcase, MapPin, FileText, CheckCircle } from 'lucide-react';

type CareersPageProps = {
  onNavigate: (path: string) => void;
};

export default function CareersPage({ onNavigate }: CareersPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('reporter');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setNotes('');
    }, 1000);
  };

  const jobs = [
    {
      id: 'reporter',
      title: 'Community Reporter (Igbogbo / Ijede)',
      type: 'Full-time / Hybrid',
      location: 'Ikorodu Division, Lagos',
      desc: 'On-the-ground reporting covering local town halls, cultural events, infrastructure developments, and profiling community figures. Journalism degree or equivalent field experience required.',
    },
    {
      id: 'curator',
      title: 'Digital Content Curator & Editor',
      type: 'Full-time',
      location: 'Igbe Laara Office, Ikorodu',
      desc: 'Manage RSS feed ingestion, refine aggregated content, write catchy headlines, and coordinate publishing schedules. Proficient in HTML, markdown, and CMS tooling.',
    },
    {
      id: 'photo',
      title: 'Freelance Photojournalist',
      type: 'Contract',
      location: 'Division-wide',
      desc: 'Capture vibrant high-resolution photography and video representing the heartbeat of Ikorodu. Own professional gear and be capable of rapid turnaround on breaking news assignments.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Careers</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        Careers at IGBE News
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        Join our passionate team and help tell the stories that shape the future of the Ikorodu division.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        {/* Open Roles */}
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-2xl font-bold text-neutral-900">Current Job Openings</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 border border-neutral-200 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                <h3 className="font-bold text-neutral-900 text-lg mb-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {job.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 border border-red-100 rounded-xl bg-red-50/50">
            <h4 className="font-bold text-red-950 text-sm mb-1">Looking for Freelance Opportunities?</h4>
            <p className="text-red-900 text-xs leading-relaxed">
              We are always on the lookout for freelance contributors, community columnists, and citizen journalists living anywhere across Ikorodu. Pitch your stories directly to <strong className="text-red-950">editorial@igbenews.com</strong>.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Application Submitted!</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Thank you for applying to join the IGBE News crew. Our managing editor will review your application and portfolio clips. We will be in touch if your background aligns with our requirements.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                Quick Application Form
              </h3>
              <p className="text-xs text-neutral-500">
                Interested in any of the open roles? Submit your initial details here and email your full CV to careers@igbenews.com.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Amara Okafor"
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
                  placeholder="amara@example.com"
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Position of Interest</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="border border-neutral-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="reporter">Community Reporter (Igbogbo / Ijede)</option>
                  <option value="curator">Digital Content Curator & Editor</option>
                  <option value="photo">Freelance Photojournalist</option>
                  <option value="freelance">General Pitch / Freelance Contributor</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Brief Intro & Links to Published Clips</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Write a brief cover sentence and paste links to your writing portfolio or photog archive..."
                  className="border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting Application...' : 'Apply Now'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
