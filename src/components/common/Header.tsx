import React from 'react';
import { ShieldCheck, Plus, BookOpen, Layers, RotateCcw } from 'lucide-react';
import { Jurisdiction } from '../../types/case';

interface HeaderProps {
  currentTab: 'dashboard' | 'intake' | 'resources';
  onSelectTab: (tab: 'dashboard' | 'intake' | 'resources') => void;
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
  caseCount: number;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  jurisdiction,
  onSelectJurisdiction,
  caseCount,
  onResetDemo
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-900/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">ResolveIt</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Consumer Protection
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Action-oriented case tracker & resolution assistant</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Nav Tabs */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl text-sm font-medium text-slate-600">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Cases</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700">
                  {caseCount}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('resources')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'resources'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Official Directory</span>
              </button>
            </nav>

            {/* Jurisdiction Pill */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs font-semibold">
              <button
                onClick={() => onSelectJurisdiction('UK')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  jurisdiction === 'UK' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="United Kingdom (Consumer Rights Act 2015)"
              >
                🇬🇧 UK
              </button>
              <button
                onClick={() => onSelectJurisdiction('US')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  jurisdiction === 'US' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="United States (FTC & CFPB)"
              >
                🇺🇸 US
              </button>
              <button
                onClick={() => onSelectJurisdiction('EU')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  jurisdiction === 'EU' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="European Union (ECC-Net)"
              >
                🇪🇺 EU
              </button>
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              title="Reset with sample headphone refund case"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden md:block"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* New Dispute Button */}
            <button
              onClick={() => onSelectTab('intake')}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-brand-600/30 transition-all hover:shadow hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">New Dispute</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
