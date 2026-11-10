import React, { useState } from 'react';
import { DisputeCase } from '../../types/case';
import { StatusBadge } from '../common/StatusBadge';
import { getDeadlineStatus, formatDate } from '../../utils/dateUtils';
import { findGrievanceOfficer } from '../../data/indianGrievanceDirectory';
import { getRecommendedVideos } from '../../data/youtubeLegalVideos';
import { YouTubeVideoCard } from '../video/YouTubeVideoCard';
import { 
  Clock, 
  Sparkles, 
  Printer, 
  CheckSquare, 
  Square, 
  ChevronRight, 
  ArrowLeft, 
  Paperclip, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Send, 
  Building2,
  HeartHandshake,
  Scale
} from 'lucide-react';

interface MobileDetailViewProps {
  disputeCase: DisputeCase;
  onBack: () => void;
  onToggleActionStep: (stepId: string) => void;
  onOpenLetterGenerator: (templateId?: string) => void;
  onPrintDossier: () => void;
  onDeleteCase: () => void;
}

export const MobileDetailView: React.FC<MobileDetailViewProps> = ({
  disputeCase,
  onBack,
  onToggleActionStep,
  onOpenLetterGenerator,
  onPrintDossier,
  onDeleteCase
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'videos' | 'timeline' | 'evidence'>('checklist');
  const [viewMode, setViewMode] = useState<'buddy' | 'lawyer'>('buddy');

  const deadline = getDeadlineStatus(disputeCase.statutoryDeadlineDate);
  const completedCount = disputeCase.actionSteps.filter(s => s.isCompleted).length;
  const totalCount = disputeCase.actionSteps.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const grievanceOfficer = findGrievanceOfficer(disputeCase.merchantName);
  const relatedVideos = getRecommendedVideos(disputeCase.initialNarrative + ' ' + disputeCase.category);

  const targetEmail = grievanceOfficer?.grievanceEmail || 'grievance.officer@flipkart.com';
  const mailSubject = encodeURIComponent(`LEGAL NOTICE: Deficiency in Service & Refund Demand - Ref #${disputeCase.orderNumber || 'Dispute'}`);
  const mailBody = encodeURIComponent(
    `To: The Resident Grievance Officer, ${disputeCase.merchantName}\n\n` +
    `Pursuant to Rule 5 of Consumer Protection (E-Commerce) Rules 2020 & Section 2(11) of CPA 2019.\n\n` +
    `Dispute Summary:\n"${disputeCase.initialNarrative}"\n\n` +
    `Claim Amount: ₹${disputeCase.claimAmount.toLocaleString('en-IN')}\nOrder Ref: #${disputeCase.orderNumber || 'Pending'}\n\n` +
    `You are hereby called upon to process the full reimbursement within 48 hours, failing which this matter stands escalated to National Consumer Helpline 1915 and E-Daakhil court.\n\nRegards.`
  );
  const mailtoLink = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-4 py-2 bg-[#fbf8f3] text-slate-900 select-none overflow-y-auto no-scrollbar">
      <div className="space-y-3">
        {/* Top Mobile Bar */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 p-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Claims</span>
          </button>

          <StatusBadge status={disputeCase.status} size="sm" />

          <div className="flex items-center gap-1">
            <button
              onClick={onPrintDossier}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/50"
              title="Print Speed Post Notice / Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDeleteCase}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
              title="Delete Case"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hybrid Mode Toggle (Buddy Mode vs Lawyer Mode) */}
        <div className="flex items-center bg-[#ede3d5] p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setViewMode('buddy')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'buddy' ? 'bg-[#de7b35] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Buddy Mode (Simple)</span>
          </button>
          <button
            onClick={() => setViewMode('lawyer')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              viewMode === 'lawyer' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Lawyer Pro Mode</span>
          </button>
        </div>

        {/* Buddy Advice Callout (when in Buddy Mode) */}
        {viewMode === 'buddy' && (
          <div className="p-3 rounded-2xl bg-[#faede2] border border-[#eedfcb] space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-[#de7b35] font-bold text-[11.5px]">
              <span>🤝</span>
              <span>Your Legal Buddy's Honest Advice:</span>
            </div>
            <p className="text-[11px] text-slate-800 leading-relaxed">
              Dost, don't worry at all. <strong>{disputeCase.merchantName}</strong> cannot run away with your ₹{disputeCase.claimAmount.toLocaleString('en-IN')}. They rely on customer care bots to make you give up. Watch the YouTube video guide below, send the 1-tap Grievance Notice, and their team will contact you.
            </p>
          </div>
        )}

        {/* Claim Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ede3d5] space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {viewMode === 'buddy' ? 'Company Involved' : 'Respondent / Opposite Party'}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-1">
                {disputeCase.merchantName}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900">
                {disputeCase.currency}{disputeCase.claimAmount.toLocaleString('en-IN')}
              </span>
              {disputeCase.orderNumber && (
                <p className="text-[10px] text-slate-400 font-mono">Ref: #{disputeCase.orderNumber}</p>
              )}
            </div>
          </div>

          {/* Grievance Officer Card */}
          <div className="p-2.5 rounded-xl bg-[#faf5ee] border border-[#eedfcb] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                <Building2 className="w-3 h-3 text-[#de7b35]" />
                <span>Nodal Grievance Officer</span>
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                Verified Rule 5 E-Commerce
              </span>
            </div>
            <p className="text-[10.5px] font-mono text-slate-600 truncate">{targetEmail}</p>

            <a
              href={mailtoLink}
              className="mt-1 w-full py-1.5 px-3 rounded-lg bg-[#de7b35] hover:bg-[#c96a28] text-white font-bold text-[10.5px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>1-Tap Send Notice via Email App</span>
            </a>
          </div>

          {/* Statutory Countdown */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
            deadline.isOverdue
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-[#faf5ee] border-[#eedfcb] text-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#de7b35]" />
              <span className="font-bold text-[11px]">{deadline.text}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">
              Target: {formatDate(disputeCase.statutoryDeadlineDate)}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
              <span>Steps: {completedCount}/{totalCount} Completed</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full bg-[#f2e9dc] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#de7b35] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 1-Tap Government Escalation Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="tel:1915"
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-[#ede3d5] text-slate-800 text-xs font-bold hover:bg-slate-50 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call NCH 1915</span>
          </a>
          <a
            href="https://wa.me/918800001915?text=Hello%20NCH%2C%20I%20want%20to%20register%20a%20consumer%20complaint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-[#ede3d5] text-slate-800 text-xs font-bold hover:bg-slate-50 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp 1915</span>
          </a>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center bg-[#ede3d5]/70 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-xs' : ''
            }`}
          >
            Action Plan
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'videos' ? 'bg-white text-slate-900 shadow-xs' : ''
            }`}
          >
            ▶ Videos ({relatedVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : ''
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
              activeTab === 'evidence' ? 'bg-white text-slate-900 shadow-xs' : ''
            }`}
          >
            Evidence
          </button>
        </div>

        {/* Subtab 1: Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-2">
            {disputeCase.actionSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all text-xs flex items-start justify-between gap-3 ${
                  step.isCompleted ? 'bg-slate-50/80 border-slate-200 opacity-60' : 'bg-white border-[#ede3d5] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button onClick={() => onToggleActionStep(step.id)} className="mt-0.5 text-[#de7b35]">
                    {step.isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                  </button>
                  <div>
                    <p className={`font-bold ${step.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>{idx + 1}. {step.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.description}</p>
                  </div>
                </div>

                {!step.isCompleted && step.recommendedTemplateId && (
                  <button
                    onClick={() => onOpenLetterGenerator(step.recommendedTemplateId)}
                    className="shrink-0 p-1.5 rounded-lg bg-[#faede2] text-[#de7b35] hover:bg-[#f6dfcb]"
                    title="Open notice template"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Subtab 2: YouTube Video Guides */}
        {activeTab === 'videos' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600 font-medium px-1">
              Watch step-by-step video explainers from verified Indian legal educators:
            </p>
            {relatedVideos.map(video => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {/* Subtab 3: Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl p-4 border border-[#ede3d5] space-y-3">
            <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {disputeCase.timeline.map((event) => (
                <div key={event.id} className="relative text-xs">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#de7b35] border-2 border-white shadow-xs" />
                  <p className="font-bold text-slate-900">{event.title}</p>
                  <p className="text-[11px] text-slate-500">{event.description}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{formatDate(event.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab 4: Evidence */}
        {activeTab === 'evidence' && (
          <div className="space-y-2">
            {disputeCase.evidence.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-white border border-[#ede3d5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Paperclip className="w-4 h-4 text-[#de7b35] shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.fileSize || 'Attached'}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{formatDate(item.uploadedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="pt-3">
        <button
          onClick={() => onOpenLetterGenerator('in_grievance_notice')}
          className="w-full py-3 px-4 rounded-full text-xs font-bold bg-[#181818] hover:bg-black text-white flex items-center justify-center gap-2 shadow-md active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{viewMode === 'buddy' ? 'Generate & Send Legal Demand' : 'Draft Formal Pre-Action Legal Notice'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
