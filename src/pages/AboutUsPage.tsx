import { ChevronRight, Users, BookOpen, Target, Globe } from 'lucide-react';

type AboutUsPageProps = {
  onNavigate: (path: string) => void;
};

export default function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1 text-sm text-neutral-500 mb-4">
        <button onClick={() => onNavigate('/')} className="hover:text-red-600">
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 font-semibold">About Us</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 border-l-4 border-red-600 pl-4">
        About IGBE News
      </h1>
      <p className="text-neutral-600 mb-8 pl-4">
        Your trusted independent news source for the Ikorodu division and beyond.
      </p>

      <div className="prose prose-neutral max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-neutral-700">
          Founded on the values of truth, integrity, and local focus, <strong>IGBE News</strong> serves as the premier digital news platform dedicated entirely to the communities of the Ikorodu division in Lagos State, Nigeria.
        </p>

        <p className="leading-relaxed text-neutral-700">
          We report live from every corner of the division, including Igbe Laara, Igbogbo, Igboke, Ginti, Ijede, Oreyo, Ebute, and Elepe. We understand that local communities are often underrepresented in mainstream national media, and we exist to bridge that gap.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="p-5 border border-neutral-200 rounded-xl bg-neutral-50">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <Target className="w-6 h-6" />
              <h3 className="text-lg font-bold text-neutral-900">Our Mission</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              To deliver accurate, objective, and timely reporting that empowers residents, fosters community growth, and holds local leadership accountable.
            </p>
          </div>

          <div className="p-5 border border-neutral-200 rounded-xl bg-neutral-50">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <Globe className="w-6 h-6" />
              <h3 className="text-lg font-bold text-neutral-900">Live Aggregation</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We aggregate breaking local and regional developments with live updates from Nigeria's most reputable national publications, giving you a complete overview of Lagos and national affairs in one single place.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Our Journey</h2>
        <p className="leading-relaxed text-neutral-700">
          IGBE News was established to create a modern media voice for one of the most vibrant and rapidly expanding areas in Lagos State. Over the years, we have grown from a small community-centric blog into a sophisticated news outlet staffed by professional journalists, local editors, and contributors.
        </p>

        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl my-8">
          <div className="flex items-center gap-3 mb-2 text-red-800">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold">Fact-Centered Journalism</span>
          </div>
          <p className="text-sm text-red-900 leading-relaxed">
            Every story we publish—whether reported on the field by our dedicated correspondents or curated through our live aggregation engine—undergoes strict verification to ensure accuracy and fairness.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Meet the Team</h2>
        <p className="leading-relaxed text-neutral-700">
          Behind every headline is a team of passionate journalists, photojournalists, and digital editors who care deeply about community development and the power of communication.
        </p>

        <div className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl bg-white shadow-sm my-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900">Independent Voices</h4>
            <p className="text-xs text-neutral-500">Connecting our communities through authentic stories.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
