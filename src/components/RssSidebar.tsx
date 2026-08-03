import { Sprout, ExternalLink, Globe, ShoppingBag, ShieldCheck } from 'lucide-react';

type RssSidebarProps = {
  onNavigate?: (path: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function RssSidebar({ onNavigate }: RssSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 text-white rounded-xl p-6 shadow-md border border-emerald-700/50 space-y-5 relative overflow-hidden">
        {/* Abstract Background Shapes for Design Depth */}
        <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-emerald-600/10 pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-28 h-28 rounded-full bg-green-500/10 pointer-events-none" />

        {/* Ad Badge */}
        <div className="flex items-center justify-between border-b border-emerald-700/40 pb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
            Sponsored Partner
          </span>
          <span className="text-[9px] bg-emerald-700/60 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-600/30">
            Ad
          </span>
        </div>

        {/* Brand Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm border border-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              FarmersHub
            </h2>
          </div>
          <p className="text-xs font-semibold text-emerald-300 leading-snug">
            Bridge the Gap Between Farmers & Global Markets
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-100/95 leading-relaxed">
          Empowering Nigerian farmers to reach international buyers while providing global access to premium African agricultural products. Join Africa's fastest-growing agritech platform today.
        </p>

        {/* Feature Highlights */}
        <div className="space-y-3 pt-1">
          <h3 className="text-[10px] font-bold tracking-wider uppercase text-emerald-300">
            What They Offer:
          </h3>
          <ul className="space-y-2.5 text-xs text-neutral-200">
            <li className="flex items-start gap-2.5">
              <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Inputs & Supplies</span>
                <p className="text-[11px] text-neutral-300">Seeds, fertilizers, pesticides & modern machinery.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Fresh Produce & Grains</span>
                <p className="text-[11px] text-neutral-300">Premium quality crops, tubers & livestock direct from farms.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Agri-Services & Land</span>
                <p className="text-[11px] text-neutral-300">Agronomy, professional logistics & arable farmland listings.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Call to Action Button */}
        <div className="pt-2">
          <a
            href="https://www.farmershub.com.ng/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-900 font-bold text-xs py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5 hover:shadow"
          >
            <span>Visit FarmersHub Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
