import { ChevronRight, ShieldCheck, Scale, RefreshCw, Heart } from 'lucide-react';

type EditorialStandardsPageProps = {
  onNavigate: (path: string) => void;
};

export default function EditorialStandardsPage({ onNavigate }: EditorialStandardsPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">Editorial Standards</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        Editorial Standards & Ethics
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        Our core code of practice, guiding principles, and commitment to responsible community journalism.
      </p>

      <div className="prose prose-neutral max-w-none space-y-8">
        <p className="text-lg leading-relaxed text-neutral-700">
          At <strong>IGBE News</strong>, our first loyalty is to our readers and the communities of the Ikorodu division. We believe that public trust is our most valuable asset. To earn and maintain that trust, our editors, reporters, and aggregated sources adhere to strict standards of truthfulness, independence, and accountability.
        </p>

        <hr className="border-neutral-200" />

        {/* 4 Pillars */}
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">1. Accuracy & Fact-Checking</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We strive to report facts accurately and in context. Our original stories are subject to rigorous verification, including corroborating testimonies and multi-source crosschecking. When reporting on aggregated content from outside partners, we utilize local knowledge to confirm relevancy and credibility before syndication.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">2. Independence & Impartiality</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                IGBE News is an independent media platform. We do not accept payment in exchange for favorable news coverage, nor do we align ourselves with any political party, interest group, or corporation. Our commercial and advertising contracts are strictly separated from our editorial decision-making processes.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">3. Corrections and Accountability</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                While we strive for perfection, errors sometimes occur. When we make mistakes, we acknowledge them openly and correct them promptly on the same article page. We welcome corrections and critiques from our readers and investigate all valid complaints with transparency.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">4. Community Integrity & Upliftment</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We believe in constructive journalism. Our reporting does not seek to sensationalize or divide. Instead, we highlight developments, youth achievements, civic responsibility, and infrastructural challenges in order to inspire positive change across Igbe, Ijede, Elepe, and the broader Ikorodu area.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-neutral-200" />

        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mt-8">
          <h3 className="text-base font-bold text-neutral-900 mb-2">Report a Correction or Grievance</h3>
          <p className="text-sm text-neutral-600 leading-relaxed mb-4">
            If you believe an article published on IGBE News contains factual errors or violates our code of ethics, please contact our Managing Editor with a link to the article and the specific details needing review.
          </p>
          <a
            href="mailto:editorial@igbenews.com?subject=Correction%20Request"
            className="text-sm font-bold text-red-600 hover:underline inline-flex items-center gap-1"
          >
            Email Standards Desk: editorial@igbenews.com &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
