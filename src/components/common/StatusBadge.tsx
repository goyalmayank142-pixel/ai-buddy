import React from 'react';
import { CaseStatus } from '../../types/case';
import { CheckCircle2, Clock, AlertTriangle, Send, Scale, Building2, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  const getStatusConfig = (st: CaseStatus) => {
    switch (st) {
      case 'evidence_gathering':
        return {
          label: 'Gathering Evidence',
          icon: HelpCircle,
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'notice_sent':
        return {
          label: 'Notice Sent',
          icon: Send,
          className: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'follow_up_due':
        return {
          label: 'Follow-up Due',
          icon: Clock,
          className: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
        };
      case 'deadlock':
        return {
          label: 'Merchant Deadlock',
          icon: AlertTriangle,
          className: 'bg-orange-50 text-orange-800 border-orange-300'
        };
      case 'bank_chargeback':
        return {
          label: 'Bank Chargeback Active',
          icon: Building2,
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'ombudsman_escalated':
        return {
          label: 'Escalated to Ombudsman',
          icon: Scale,
          className: 'bg-rose-50 text-rose-800 border-rose-300'
        };
      case 'resolved':
        return {
          label: 'Resolved & Closed',
          icon: CheckCircle2,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      default:
        return {
          label: 'Active',
          icon: Clock,
          className: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-xs transition-colors ${sizeClasses[size]} ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
