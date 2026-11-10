import React, { useState } from 'react';
import { Jurisdiction } from '../../types/case';
import { OFFICIAL_RESOURCES } from '../../data/officialResources';
import { Search, ExternalLink, Phone, ShieldCheck } from 'lucide-react';

interface MobileDirectoryViewProps {
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
}

export const MobileDirectoryView: React.FC<MobileDirectoryViewProps> = ({
  jurisdiction,
  onSelectJurisdiction
}) => {
  const [search, setSearch] = useState('');

  const filtered = OFFICIAL_RESOURCES.filter(r =>
    r.jurisdiction === jurisdiction &&
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
     r.description.toLowerCase().includes(search.toLowerCase()) ||
     r.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-4 py-2 bg-[#fbf8f3] text-slate-900 select-none overflow-y-auto no-scrollbar">
      <div className="space-y-3">
        {/* Header */}
        <div className="pt-1">
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Official Help Directory</h1>
          <p className="text-[11px] text-slate-500">Government ombudsman & consumer adjudication</p>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex bg-[#ede3d5] p-1 rounded-xl text-xs font-bold text-slate-700">
          {(['UK', 'US', 'EU'] as Jurisdiction[]).map(j => (
            <button
              key={j}
              onClick={() => onSelectJurisdiction(j)}
              className={`flex-1 py-1 rounded-lg transition-all ${
                jurisdiction === j ? 'bg-[#de7b35] text-white shadow-xs' : ''
              }`}
            >
              {j === 'UK' ? '🇬🇧 UK' : j === 'US' ? '🇺🇸 US' : '🇪🇺 EU'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search RetailADR, FOS, CFPB..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-white rounded-xl border border-[#ede3d5] focus:outline-none focus:border-[#de7b35]"
          />
        </div>

        {/* Resource Cards */}
        <div className="space-y-2.5 pt-1">
          {filtered.map(r => (
            <div
              key={r.id}
              className="p-3.5 rounded-2xl bg-white border border-[#ede3d5] space-y-2 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#de7b35] bg-[#faede2] px-1.5 py-0.5 rounded">
                    {r.sector}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 mt-1">{r.name}</h3>
                </div>
                <a
                  href={r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#faede2] text-[#de7b35] hover:bg-[#f3ded0]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">{r.description}</p>

              <div className="pt-2 border-t border-[#f4ede4] flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Official Body</span>
                </span>
                {r.phone && (
                  <span className="flex items-center gap-1 font-mono text-slate-600">
                    <Phone className="w-2.5 h-2.5 text-[#de7b35]" />
                    {r.phone}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
