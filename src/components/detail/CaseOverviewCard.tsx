import React from 'react';
import { DisputeCase, CaseStatus } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import { getLegalFramework } from '../../utils/caseExtractor';
import { 
  Building2, 
  Calendar, 
  Printer, 
  Trash2, 
  Clock,
  Sparkles
} from 'lucide-react';

interface CaseOverviewCardProps {
  disputeCase: DisputeCase;
  onUpdateStatus: (status: CaseStatus) => void;
  onOpenLetterGenerator: () => void;
  onPrintDossier: () => void;
  onDeleteCase: () => void;
}

export const CaseOverviewCard: React.FC<CaseOverviewCardProps> = ({
  disputeCase,
  onUpdateStatus,
  onOpenLetterGenerator,
  onPrintDossier,
  onDeleteCase
}) => {
  const deadline = getDeadlineStatus(disputeCase.statutoryDeadlineDate);
  const legalBasis = getLegalFramework(disputeCase.category, disputeCase.jurisdiction);

  const statuses: { value: CaseStatus; label: string }[] = [
    { value: 'evidence_gathering', label: '1. Gathering Evidence' },
    { value: 'notice_sent', label: '2. Formal Notice Sent' },
    { value: 'follow_up_due', label: '3. Follow-up Overdue' },
    { value: 'deadlock', label: '4. Merchant Deadlock' },
    { value: 'bank_chargeback', label: '5. Bank Chargeback Filed' },
    { value: 'ombudsman_escalated', label: '6. Ombudsman Adjudication' },
    { value: 'resolved', label: '7. Resolved & Refunded' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={disputeCase.status} size="lg" />
          <select
            value={disputeCase.status}
            onChange={(e) => onUpdateStatus(e.target.value as CaseStatus)}
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none transition-colors"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick action tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenLetterGenerator}
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Draft Statutory Letter</span>
          </button>

          <button
            onClick={onPrintDossier}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            title="Export / Print official dispute dossier for bank chargeback or court"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={onDeleteCase}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete this case"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Key Numbers */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {disputeCase.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              {disputeCase.merchantName}
            </span>
            {disputeCase.orderNumber && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700 font-semibold">
                Ref: #{disputeCase.orderNumber}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Incident date: {formatDate(disputeCase.incidentDate)}
            </span>
          </div>
        </div>

        {/* Claim Value Card */}
        <div className="bg-[#faf8f5] border border-amber-900/10 p-3.5 rounded-2xl shrink-0 text-right">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Disputed Amount</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {disputeCase.currency}{disputeCase.claimAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Statutory Countdown & Legal Safeguard Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        deadline.isOverdue
          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
          : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
            <Clock className={`w-5 h-5 ${deadline.isOverdue ? 'text-rose-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">
                {deadline.isOverdue ? 'Statutory Window Expired' : 'Statutory Compliance Deadline'}
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${deadline.badgeColor}`}>
                {deadline.text}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Legal framework: <strong className="text-slate-800">{legalBasis}</strong>. Target resolution date was {formatDate(disputeCase.statutoryDeadlineDate)}.
            </p>
          </div>
        </div>

        {deadline.isOverdue && (
          <button
            onClick={onOpenLetterGenerator}
            className="sm:shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 text-white shadow-xs hover:bg-rose-700"
          >
            <span>Escalate Notice</span>
          </button>
        )}
      </div>
    </div>
  );
};
