import { Twitter, Facebook, Linkedin, Youtube, Instagram, Send } from 'lucide-react';
import { CATEGORIES, CATEGORY_SLUGS, COMMUNITIES, COMMUNITY_SLUGS } from '@/lib/utils';

type FooterProps = {
  onNavigate: (path: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  const socials = [
    { icon: Twitter, label: 'Twitter' },
    { icon: Facebook, label: 'Facebook' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold tracking-tight text-white">IGBE</span>
              <span className="text-2xl font-bold tracking-tight text-red-600">NEWS</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Your trusted source for news and stories from across the Ikorodu
              division of Lagos State, Nigeria. Reporting from Igbe Laara,
              Igbogbo, Igboke, Ginti, Ijede, Oreyo, Ebute, and Elepe — with live
              aggregation from Nigeria's leading news sources.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              News
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate(`/category/${CATEGORY_SLUGS[cat]}`)}
                    className="text-sm hover:text-red-500 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Communities
            </h4>
            <ul className="space-y-2.5">
              {COMMUNITIES.map((community) => (
                <li key={community}>
                  <button
                    onClick={() =>
                      onNavigate(`/community/${COMMUNITY_SLUGS[community]}`)
                    }
                    className="text-sm hover:text-red-500 transition-colors text-left"
                  >
                    {community}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              About
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Advertise', 'Careers', 'Editorial Standards'].map(
                (link) => (
                  <li key={link}>
                    <button
                      onClick={() => onNavigate('/')}
                      className="text-sm hover:text-red-500 transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} IGBE News. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Send className="w-3 h-3" />
            <span>Aggregating live from Nigeria's leading news sources</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
