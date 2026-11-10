import React, { useState } from 'react';
import { Jurisdiction } from '../../types/case';
import { OFFICIAL_RESOURCES } from '../../data/officialResources';
import { Search, ExternalLink, Phone, Clock, Scale, ShieldCheck } from 'lucide-react';

interface EscalationDirectoryProps {
  currentJurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
  selectedResourceId?: string | null;
}

export const EscalationDirectory: React.FC<EscalationDirectoryProps> = ({
  currentJurisdiction,
  onSelectJurisdiction,
  selectedResourceId
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const filtered = OFFICIAL_RESOURCES.filter(r => {
    const matchesJur = r.jurisdiction === currentJurisdiction;
    const matchesSector = selectedSector === 'all' || r.sector === selectedSector;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesJur && matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Directory Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-900 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5 text-brand-600" />
            <span>Official Government & Statutory Adjudication Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Where to Escalate When Merchants Refuse
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Verified official regulators, statutory ombudsman services, and approved ADR schemes. These bodies have legal authority to issue binding financial orders against rogue traders.
          </p>
        </div>

        {/* Jurisdiction Selector Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
          {(['UK', 'US', 'EU'] as Jurisdiction[]).map(j => (
            <button
              key={j}
              onClick={() => onSelectJurisdiction(j)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentJurisdiction === j
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {j === 'UK' ? '🇬🇧 United Kingdom' : j === 'US' ? '🇺🇸 United States' : '🇪🇺 European Union'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-amber-900/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ombudsman, credit card chargebacks, flight delays, retail..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#faf8f5] rounded-xl border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold text-slate-600">
          {['all', 'general', 'retail', 'financial', 'travel', 'telecom'].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-xl capitalize whitespace-nowrap transition-all ${
                selectedSector === sec ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(r => {
          const isHighlighted = selectedResourceId === r.id;
          return (
            <div
              key={r.id}
              className={`bg-white rounded-3xl p-5 border transition-all ${
                isHighlighted
                  ? 'border-brand-500 ring-2 ring-brand-500/15 shadow-md'
                  : 'border-amber-900/10 hover:border-amber-900/20 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                    {r.sector} ADR / Regulatory
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{r.name}</h3>
                </div>
                <a
                  href={r.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-brand-600 hover:text-brand-800 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors shrink-0"
                  title="Open official website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{r.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">When to escalate: </span>
                    <span className="text-slate-600">{r.whenToContact}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  {r.phone && (
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Phone className="w-3 h-3 text-brand-600" />
                      {r.phone}
                    </span>
                  )}
                  {r.typicalWaitDays && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {r.typicalWaitDays}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
