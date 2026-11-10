import React, { useState } from 'react';
import { TimelineEvent } from '../../types/case';
import { formatDate } from '../../utils/dateUtils';
import { 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Send, 
  ShoppingBag, 
  Scale, 
  RotateCcw 
} from 'lucide-react';

interface CaseTimelineProps {
  timeline: TimelineEvent[];
  onAddEvent: (event: TimelineEvent) => void;
}

export const CaseTimeline: React.FC<CaseTimelineProps> = ({ timeline, onAddEvent }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState<TimelineEvent['category']>('communication');
  const [newDescription, setNewDescription] = useState('');

  const getEventIcon = (category: TimelineEvent['category'], isStatutory?: boolean) => {
    if (isStatutory) return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    switch (category) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'delivery':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'return':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'communication':
        return <Send className="w-4 h-4 text-emerald-600" />;
      case 'escalation':
        return <Scale className="w-4 h-4 text-rose-600" />;
      case 'resolution':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const event: TimelineEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      category: newCategory,
      description: newDescription.trim()
    };

    onAddEvent(event);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Evidentiary Timeline</h2>
          <p className="text-xs text-slate-500">Chronological chain of events, courier scans, and deadlines</p>
        </div>

        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Inline Form to Add Event */}
      {showAddModal && (
        <form onSubmit={handleCreateEvent} className="p-4 bg-[#faf8f5] rounded-2xl border border-amber-900/10 space-y-3 text-xs">
          <div className="font-bold text-slate-800">Add Timeline Milestone</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-500 mb-1">Event Date</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Type</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as TimelineEvent['category'])}
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
              >
                <option value="communication">Message / Email Sent</option>
                <option value="return">Return Dispatched / Drop-off</option>
                <option value="delivery">Courier Delivered</option>
                <option value="escalation">Bank / Ombudsman Claim</option>
                <option value="resolution">Refund / Settlement</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Sent formal statutory notice"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-500 mb-1">Details (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Received automated acknowledgment from customer support..."
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Dot Icon */}
            <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shadow-xs ${
              event.isStatutoryNotice
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-300'
            }`}>
              {getEventIcon(event.category, event.isStatutoryNotice)}
            </div>

            {/* Event Content Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              event.isStatutoryNotice
                ? 'bg-amber-50/60 border-amber-200/80 shadow-xs'
                : 'bg-[#faf8f5]/80 hover:bg-[#faf8f5] border-amber-900/5'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{event.title}</span>
                  {event.isStatutoryNotice && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold">
                      Statutory Limit
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {formatDate(event.date)}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
