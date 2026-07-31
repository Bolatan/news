import React, { useState } from 'react';
import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

type ContactPageProps = {
  onNavigate: (path: string) => void;
};

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
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
        <span className="text-neutral-900 font-semibold">Contact</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        Contact IGBE News
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        Have a story tip, a feedback, or business inquiry? Get in touch with our editorial and sales team.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Message Sent Successfully!</h3>
              <p className="text-neutral-600 mb-6">
                Thank you for reaching out. A member of our team will review your submission and respond to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold text-neutral-900 mb-1">Send Us a Message</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Fill out the form below and we will route your inquiry to the appropriate department.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="border border-neutral-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="border border-neutral-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="e.g. Story Tip, Advertising, General Inquiry"
                  className="border border-neutral-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">Your Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Write your message details here..."
                  className="border border-neutral-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-red-600 bg-neutral-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-8 bg-neutral-50 border border-neutral-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-neutral-900">Official Contact Details</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Prefer direct communication? Reach out to our physical offices or email any of our departments directly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-1">Our Newsroom & Office</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    IGBE News Office, Igbe Laara Road,<br />
                    Igbogbo-Bayeku LCDA, Ikorodu Division,<br />
                    Lagos State, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-1">Email Departments</h4>
                  <p className="text-sm text-neutral-600">
                    <strong className="text-neutral-700">Editorial/Tips:</strong> editorial@igbenews.com<br />
                    <strong className="text-neutral-700">Advertising:</strong> ad-sales@igbenews.com<br />
                    <strong className="text-neutral-700">Careers:</strong> careers@igbenews.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm mb-1">Phone Helpline</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    +234 (0) 803 123 4567<br />
                    Monday – Friday, 8:00 AM – 5:00 PM (WAT)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl text-center">
            <h4 className="font-bold text-red-950 text-sm mb-1">Are you an Editor or Contributor?</h4>
            <p className="text-red-900 text-xs leading-relaxed mb-4">
              Access the administrative system to submit articles or manage platform settings.
            </p>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
