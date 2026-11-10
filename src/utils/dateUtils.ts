/**
 * Date and statutory timeline calculation utilities
 */

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not specified';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function daysBetween(from: string | Date, to: string | Date = new Date()): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(dateStr: string | Date, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export interface DeadlineStatus {
  daysLeft: number;
  isOverdue: boolean;
  text: string;
  badgeColor: string;
}

export function getDeadlineStatus(deadlineDate?: string): DeadlineStatus {
  if (!deadlineDate) {
    return { daysLeft: 0, isOverdue: false, text: 'No statutory date set', badgeColor: 'bg-slate-100 text-slate-700' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    const daysOverdue = Math.abs(daysLeft);
    return {
      daysLeft,
      isOverdue: true,
      text: `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} past deadline`,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  } else if (daysLeft === 0) {
    return {
      daysLeft: 0,
      isOverdue: false,
      text: 'Statutory deadline is today',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else if (daysLeft <= 3) {
    return {
      daysLeft,
      isOverdue: false,
      text: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left to comply`,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else {
    return {
      daysLeft,
      isOverdue: false,
      text: `${daysLeft} days remaining`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
}
