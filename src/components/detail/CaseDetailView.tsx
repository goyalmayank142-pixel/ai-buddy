import React, { useState } from 'react';
import { DisputeCase, CaseStatus, EvidenceItem, TimelineEvent, ActionStep } from '../../types/case';
import { CaseOverviewCard } from './CaseOverviewCard';
import { CaseTimeline } from './CaseTimeline';
import { EvidenceGallery } from './EvidenceGallery';
import { ActionChecklist } from './ActionChecklist';
import { CheckSquare, Clock, Paperclip, FileEdit, ArrowLeft } from 'lucide-react';

interface CaseDetailViewProps {
  disputeCase: DisputeCase;
  onBackToDashboard: () => void;
  onUpdateStatus: (status: CaseStatus) => void;
  onToggleActionStep: (stepId: string) => void;
  onAddEvidence: (item: EvidenceItem) => void;
  onAddTimelineEvent: (event: TimelineEvent) => void;
  onAddCustomStep: (step: ActionStep) => void;
  onUpdateNotes: (notes: string) => void;
  onOpenLetterGenerator: (templateId?: string) => void;
  onOpenResource: (resourceId?: string) => void;
  onPrintDossier: () => void;
  onDeleteCase: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  disputeCase,
  onBackToDashboard,
  onUpdateStatus,
  onToggleActionStep,
  onAddEvidence,
  onAddTimelineEvent,
  onAddCustomStep,
  onUpdateNotes,
  onOpenLetterGenerator,
  onOpenResource,
  onPrintDossier,
  onDeleteCase
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'timeline' | 'evidence' | 'notes'>('plan');
  const [notesText, setNotesText] = useState(disputeCase.notes || '');

  const handleNotesBlur = () => {
    onUpdateNotes(notesText);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Cases</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Case ID: {disputeCase.id}
        </span>
      </div>

      {/* Case Overview & Statutory Countdown Header */}
      <CaseOverviewCard
        disputeCase={disputeCase}
        onUpdateStatus={onUpdateStatus}
        onOpenLetterGenerator={() => onOpenLetterGenerator()}
        onPrintDossier={onPrintDossier}
        onDeleteCase={onDeleteCase}
      />

      {/* Section Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-amber-900/10 no-print">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'plan'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Resolution Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'timeline'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timeline ({disputeCase.timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'evidence'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Paperclip className="w-4 h-4" />
          <span>Evidence Locker ({disputeCase.evidence.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Log & Notes</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'plan' && (
          <ActionChecklist
            actionSteps={disputeCase.actionSteps}
            onToggleStep={onToggleActionStep}
            onOpenTemplate={onOpenLetterGenerator}
            onOpenResource={onOpenResource}
            onAddCustomStep={onAddCustomStep}
          />
        )}

        {activeTab === 'timeline' && (
          <CaseTimeline
            timeline={disputeCase.timeline}
            onAddEvent={onAddTimelineEvent}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceGallery
            evidence={disputeCase.evidence}
            onAddEvidence={onAddEvidence}
          />
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Case Log & Customer Support Notes</h2>
              <p className="text-xs text-slate-500">Record phone call logs, representative names, and private remarks</p>
            </div>
            <textarea
              rows={8}
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="e.g. Called customer service on 14th Oct at 11:20 AM. Spoke with Sarah (Agent ID: 442). She promised callback within 48h..."
              className="w-full p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
            />
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Automatically saved on focus out</span>
              <button
                onClick={handleNotesBlur}
                className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-black"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
