import React from 'react';
import { DisputeCase } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import { Calendar, ArrowUpRight, CheckSquare, Paperclip, AlertCircle } from 'lucide-react';

interface CaseCardProps {
  disputeCase: DisputeCase;
  isActive: boolean;
  onSelect: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ disputeCase, isActive, onSelect }) => {
  const completedSteps = disputeCase.actionSteps.filter(s => s.isCompleted).length;
  const totalSteps = disputeCase.actionSteps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const deadline = getDeadlineStatus(disputeCase.statutoryDeadlineDate);

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${
        isActive
          ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/10'
          : 'bg-white/80 hover:bg-white border-amber-900/10 hover:border-amber-900/20 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <StatusBadge status={disputeCase.status} size="sm" />
        {disputeCase.statutoryDeadlineDate && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${deadline.badgeColor}`}>
            {deadline.isOverdue && <AlertCircle className="w-3 h-3 text-rose-600" />}
            {deadline.text}
          </span>
        )}
      </div>

      <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition-colors">
        {disputeCase.title}
      </h3>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
        <span className="font-semibold text-slate-700">{disputeCase.merchantName}</span>
        <span className="font-bold text-sm text-slate-900">
          {disputeCase.currency}{disputeCase.claimAmount.toFixed(2)}
        </span>
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
        {disputeCase.initialNarrative}
      </p>

      {/* Action Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-brand-600" />
            <span>Resolution Steps: {completedSteps}/{totalSteps}</span>
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Opened {formatDate(disputeCase.createdAt)}</span>
        </span>
        <span className="flex items-center gap-2">
          {disputeCase.evidence.length > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip className="w-3 h-3" />
              {disputeCase.evidence.length}
            </span>
          )}
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-slate-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </span>
      </div>
    </div>
  );
};
