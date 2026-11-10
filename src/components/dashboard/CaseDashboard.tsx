import React, { useState } from 'react';
import { DisputeCase } from '../../types/case';
import { CaseCard } from './CaseCard';
import { getDeadlineStatus } from '../../utils/dateUtils';
import { Plus, Search, AlertCircle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

interface CaseDashboardProps {
  cases: DisputeCase[];
  activeCaseId: string | null;
  onSelectCase: (id: string) => void;
  onStartNewCase: () => void;
}

export const CaseDashboard: React.FC<CaseDashboardProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onStartNewCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'urgent' | 'active' | 'resolved'>('all');

  // Metrics
  const activeCases = cases.filter(c => c.status !== 'resolved');
  const resolvedCases = cases.filter(c => c.status === 'resolved');
  const urgentCases = cases.filter(c => {
    if (c.status === 'resolved') return false;
    const deadline = getDeadlineStatus(c.statutoryDeadlineDate);
    return deadline.isOverdue || deadline.daysLeft <= 3 || c.status === 'follow_up_due';
  });
  const totalAmountAtStake = cases
    .filter(c => c.status !== 'resolved')
    .reduce((sum, c) => sum + (c.claimAmount || 0), 0);

  // Filter logic
  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.orderNumber && c.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === 'urgent') {
      const deadline = getDeadlineStatus(c.statutoryDeadlineDate);
      return c.status !== 'resolved' && (deadline.isOverdue || deadline.daysLeft <= 3 || c.status === 'follow_up_due');
    }
    if (filterTab === 'active') return c.status !== 'resolved';
    if (filterTab === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Disputes</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeCases.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Under active management</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Urgent / Overdue</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{urgentCases.length}</p>
          <p className="text-[11px] text-rose-500 mt-0.5">Statutory windows expired</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total at Stake</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">£{totalAmountAtStake.toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Pending refunds & claims</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{resolvedCases.length}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Successfully recovered</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-amber-900/10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by merchant, order #, or issue..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#faf8f5] rounded-xl border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'all' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            All ({cases.length})
          </button>
          <button
            onClick={() => setFilterTab('urgent')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'urgent' ? 'bg-rose-600 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Urgent ({urgentCases.length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'active' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Active ({activeCases.length})
          </button>
          <button
            onClick={() => setFilterTab('resolved')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              filterTab === 'resolved' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'
            }`}
          >
            Resolved ({resolvedCases.length})
          </button>
        </div>
      </div>

      {/* Case Grid */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map(c => (
            <CaseCard
              key={c.id}
              disputeCase={c}
              isActive={c.id === activeCaseId}
              onSelect={() => onSelectCase(c.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-amber-900/20 p-8">
          <p className="text-sm font-bold text-slate-700">No dispute cases found</p>
          <p className="text-xs text-slate-500 mt-1">Start by capturing a problem with SmartClaim</p>
          <button
            onClick={onStartNewCase}
            className="mt-4 inline-flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-brand-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open New Dispute</span>
          </button>
        </div>
      )}
    </div>
  );
};
