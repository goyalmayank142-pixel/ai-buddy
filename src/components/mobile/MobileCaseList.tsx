import React, { useState } from 'react';
import { DisputeCase } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import { Plus, Search, ChevronRight, AlertCircle } from 'lucide-react';

interface MobileCaseListProps {
  cases: DisputeCase[];
  activeCaseId: string | null;
  onSelectCase: (id: string) => void;
  onNewCase: () => void;
}

export const MobileCaseList: React.FC<MobileCaseListProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onNewCase
}) => {
  const [search, setSearch] = useState('');

  const filtered = cases.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.merchantName.toLowerCase().includes(search.toLowerCase()) ||
    (c.orderNumber && c.orderNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-4 py-2 bg-[#fbf8f3] text-slate-900 select-none overflow-y-auto no-scrollbar">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Active Cases</h1>
            <p className="text-[11px] text-slate-500">{cases.length} consumer claims tracked</p>
          </div>
          <button
            onClick={onNewCase}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#de7b35] text-white shadow-xs hover:bg-[#c96a28]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Claim</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search disputes or merchants..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-white rounded-xl border border-[#ede3d5] focus:outline-none focus:border-[#de7b35]"
          />
        </div>

        {/* List of Cases */}
        <div className="space-y-2.5 pt-1">
          {filtered.map(c => {
            const deadline = getDeadlineStatus(c.statutoryDeadlineDate);
            const isSelected = c.id === activeCaseId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#de7b35] shadow-xs ring-1 ring-[#de7b35]/20'
                    : 'bg-white hover:bg-[#fcfbf9] border-[#ede3d5]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status={c.status} size="sm" />
                  <span className="font-extrabold text-sm text-slate-900">
                    {c.currency}{c.claimAmount.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-800 mt-2 line-clamp-1">
                  {c.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {c.initialNarrative}
                </p>

                <div className="mt-2.5 pt-2 border-t border-[#f2ede4] flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{formatDate(c.createdAt)}</span>
                  {c.statutoryDeadlineDate && (
                    <span className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded ${deadline.badgeColor}`}>
                      {deadline.isOverdue && <AlertCircle className="w-2.5 h-2.5 text-rose-600" />}
                      {deadline.text}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
