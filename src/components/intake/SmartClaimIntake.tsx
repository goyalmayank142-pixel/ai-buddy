import React, { useState, useRef } from 'react';
import { Sparkles, X, Play, HelpCircle, Key } from 'lucide-react';
import { DisputeCase, EvidenceItem } from '../../types/case';
import { analyzeConsumerDispute } from '../../services/aiService';
import { addDays } from '../../utils/dateUtils';
import { MobileHeader } from '../mobile/MobileHeader';

interface SmartClaimIntakeProps {
  onCaseCreated: (newCase: DisputeCase) => void;
  onClose: () => void;
  onOpenExplainer: () => void;
  onOpenAiSettings: () => void;
}

export const SmartClaimIntake: React.FC<SmartClaimIntakeProps> = ({
  onCaseCreated,
  onClose,
  onOpenExplainer,
  onOpenAiSettings
}) => {
  const [narrative, setNarrative] = useState(
    "Ordered boAt Rockerz headphones for ₹1,499 from Flipkart. Arrived with snapped plastic headband and dead left ear cup. Seller rejected return claiming 'customer physical damage'. Flipkart customer care bot closed ticket without refund."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisStep, setAiAnalysisStep] = useState(0);

  const [attachments, setAttachments] = useState<EvidenceItem[]>([
    {
      id: 'media-1',
      name: 'broken_headphone_unboxing.mp4',
      type: 'photo',
      description: 'Video unboxing proof of damaged item',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '1.8 MB'
    },
    {
      id: 'media-2',
      name: 'flipkart_invoice_1499.pdf',
      type: 'receipt',
      description: 'Official GST invoice showing ₹1,499 paid via UPI',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '340 KB'
    },
    {
      id: 'media-3',
      name: 'seller_rejection_chat.png',
      type: 'screenshot',
      description: 'Chat screenshot of bot closing complaint',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '480 KB'
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCamera = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      const fileUrl = isImg ? URL.createObjectURL(file) : undefined;
      const sizeKb = Math.round(file.size / 1024);

      const newItem: EvidenceItem = {
        id: `att-${Date.now()}-${i}`,
        name: file.name,
        type: isImg ? 'photo' : 'receipt',
        fileUrl,
        description: isCamera ? 'Camera photo evidence' : 'Attached evidence file',
        uploadedAt: new Date().toISOString().split('T')[0],
        fileSize: `${sizeKb} KB`
      };

      setAttachments(prev => [...prev, newItem]);
    }
    if (e.target) e.target.value = '';
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      const voiceDemo = " Also I spoke with delivery person who refused to take back the parcel at the door.";
      let charIdx = 0;
      const timer = setInterval(() => {
        if (charIdx < voiceDemo.length) {
          setNarrative(prev => prev + voiceDemo.charAt(charIdx));
          charIdx++;
        } else {
          clearInterval(timer);
          setIsRecording(false);
        }
      }, 40);
    } else {
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!narrative.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAiAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAiAnalysisStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const aiResult = await analyzeConsumerDispute(narrative);
      clearInterval(stepInterval);

      const todayStr = new Date().toISOString().split('T')[0];
      const deadlineDate = addDays(todayStr, 2); // 48h grievance officer window

      const newCase: DisputeCase = {
        id: `case-${Date.now()}`,
        title: aiResult.title,
        merchantName: aiResult.merchantName,
        claimAmount: aiResult.claimAmount,
        currency: aiResult.currency || '₹',
        category: aiResult.category,
        status: 'evidence_gathering',
        jurisdiction: 'IN',
        createdAt: todayStr,
        updatedAt: todayStr,
        initialNarrative: narrative,
        orderNumber: 'OD-' + Math.floor(100000000 + Math.random() * 900000000),
        incidentDate: todayStr,
        statutoryDeadlineDays: 2,
        statutoryDeadlineDate: deadlineDate,
        evidence: attachments,
        timeline: aiResult.timeline,
        actionSteps: aiResult.actionSteps,
        notes: `AI Legal Finding: ${aiResult.statuteViolationSummary}`
      };

      setIsAnalyzing(false);
      onCaseCreated(newCase);
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      console.error('AI Analysis failed:', err);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-5 pt-1 pb-4 bg-[#fbf8f3] text-slate-900 select-none">
      <div>
        {/* Mobile Header with Stepper and Close */}
        <MobileHeader currentStep={1} totalSteps={4} onClose={onClose} title="ResolveIt India" />

        {/* Explain & Config Pills */}
        <div className="flex items-center justify-between px-1 pt-1 pb-2 text-[10px] text-slate-500">
          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 font-bold text-[#de7b35] bg-[#faede2] px-2.5 py-1 rounded-full hover:bg-[#f5e0cf] transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>What does this app do?</span>
          </button>

          <button
            onClick={onOpenAiSettings}
            className="flex items-center gap-1 font-semibold text-slate-600 bg-white border border-[#e8ddce] px-2.5 py-1 rounded-full hover:bg-slate-50 transition-colors"
          >
            <Key className="w-3 h-3 text-purple-600" />
            <span>AI Settings</span>
          </button>
        </div>

        {/* Hero Section with Title and Assistant Avatar */}
        <div className="flex items-start justify-between px-1 pt-1 pb-2">
          <div className="pr-2">
            <h1 className="text-[20px] font-normal text-slate-800 leading-tight">
              Feel free
            </h1>
            <h2 className="text-[21px] font-black tracking-tight text-slate-900 leading-tight">
              to tell us everything
            </h2>
            <p className="text-[11.5px] text-[#8c7e70] font-medium mt-0.5">
              Flipkart, Swiggy, UPI, or flight issues — in any format!
            </p>
          </div>

          <div className="relative shrink-0 -mt-1 -mr-1">
            <div className="w-[66px] h-[66px] rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-[#3b2b23] to-[#715444]">
              <img
                src="/assistant-avatar.png"
                alt="AI Consumer Lawyer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        </div>

        {/* Real Indian Consumer Scenarios */}
        <div className="flex items-center gap-1.5 px-1 pb-2.5 overflow-x-auto text-[11px] font-medium text-slate-600 no-scrollbar">
          <button
            type="button"
            onClick={() => setNarrative("Ordered boAt Rockerz headphones for ₹1,499 from Flipkart. Arrived with snapped plastic headband. Seller rejected return claiming 'customer physical damage'. Customer care bot closed ticket without refund.")}
            className="px-2.5 py-1 rounded-full bg-[#f1e8db] hover:bg-[#e7dccb] text-slate-800 whitespace-nowrap transition-colors"
          >
            📱 Flipkart Damaged (₹1,499)
          </button>
          <button
            type="button"
            onClick={() => setNarrative("Swiggy delivered spoiled chicken biryani smelling foul for ₹420. Delivery boy refused to take back and chat support closed with 'no refund policy'. Food safety violation.")}
            className="px-2.5 py-1 rounded-full bg-[#f1e8db] hover:bg-[#e7dccb] text-slate-800 whitespace-nowrap transition-colors"
          >
            🍕 Swiggy Spoiled Food (₹420)
          </button>
          <button
            type="button"
            onClick={() => setNarrative("Paid ₹2,500 via PhonePe UPI to grocery store. Amount debited from my SBI bank account but merchant did not receive money. It's been 5 days and bank hasn't reversed.")}
            className="px-2.5 py-1 rounded-full bg-[#f1e8db] hover:bg-[#e7dccb] text-slate-800 whitespace-nowrap transition-colors"
          >
            💸 UPI Debit Failed (₹2,500)
          </button>
        </div>

        {/* Main Smart Input Box Card */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-[#ede3d5] flex flex-col justify-between min-h-[310px]">
          {/* Top: Attachments Thumbnail Carousel */}
          {attachments.length > 0 && (
            <div className="flex items-center gap-2 pb-2.5 overflow-x-auto no-scrollbar">
              {attachments.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group shrink-0 w-[64px] h-[48px] rounded-xl overflow-hidden border border-[#e8ddce] bg-[#fdfbf7] flex items-center justify-center"
                >
                  {idx === 0 ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                      <Play className="w-3.5 h-3.5 text-white fill-white opacity-85" />
                      <span className="absolute bottom-1 right-1 text-[7px] text-white/80 font-mono">0:18</span>
                    </div>
                  ) : idx === 1 ? (
                    <div className="w-full h-full p-1.5 flex flex-col justify-between bg-amber-50/50">
                      <div className="space-y-1">
                        <div className="h-1 bg-amber-300 rounded-full w-3/4" />
                        <div className="h-1 bg-amber-300 rounded-full w-1/2" />
                      </div>
                      <span className="text-[7.5px] font-bold text-amber-800">GST BILL</span>
                    </div>
                  ) : (
                    <div className="w-full h-full p-1.5 flex flex-col justify-between bg-blue-50/50">
                      <div className="space-y-1">
                        <div className="h-1 bg-blue-300 rounded-full w-4/5" />
                        <div className="h-1 bg-blue-300 rounded-full w-2/3" />
                      </div>
                      <span className="text-[7.5px] font-bold text-blue-800 font-mono">CHAT LOG</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter(a => a.id !== item.id))}
                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Input */}
          <textarea
            rows={attachments.length > 0 ? 5 : 7}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Type or speak what happened in Hindi, English or Hinglish..."
            maxLength={2000}
            className="w-full bg-transparent text-[13px] leading-relaxed text-slate-800 placeholder-[#b6a99a] focus:outline-none resize-none font-sans"
          />

          {/* Toolbar inside card */}
          <div className="pt-2.5 border-t border-[#f4ede4] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => handleFileUpload(e, true)}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10.5px] font-semibold bg-[#faf6f0] hover:bg-[#f3ece0] text-slate-700 transition-colors border border-[#eedfcb]"
              >
                <span>📷</span>
                <span>Camera</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10.5px] font-semibold transition-colors border ${
                  isRecording
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-[#faf6f0] hover:bg-[#f3ece0] text-slate-700 border-[#eedfcb]'
                }`}
              >
                <span>🎙️</span>
                <span>{isRecording ? 'Listening...' : 'Voice'}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={e => handleFileUpload(e, false)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10.5px] font-semibold bg-[#faf6f0] hover:bg-[#f3ece0] text-slate-700 transition-colors border border-[#eedfcb]"
              >
                <span>📁</span>
                <span>File</span>
              </button>
            </div>

            <span className="text-[10px] font-mono text-[#b3a595]">
              {narrative.length}/2000
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom AI Analyze Button */}
      <div className="pt-2.5">
        <button
          type="button"
          disabled={!narrative.trim() || isAnalyzing}
          onClick={handleAnalyze}
          className={`w-full py-3.5 px-6 rounded-full text-[13px] font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all ${
            !narrative.trim() || isAnalyzing
              ? 'bg-slate-700 opacity-90'
              : 'bg-[#181818] hover:bg-black active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-[12px]">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>
                {aiAnalysisStep === 1 && "Reading complaint details..."}
                {aiAnalysisStep === 2 && "Checking Consumer Protection Act 2019..."}
                {aiAnalysisStep >= 3 && "Drafting Grievance Notice & Action Plan..."}
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 stroke-[2.2]" />
              <span className="tracking-wide">AI Analyze & Build Action Plan</span>
            </>
          )}
        </button>

        <div className="w-32 h-1 bg-slate-800/80 rounded-full mx-auto mt-2.5" />
      </div>
    </div>
  );
};
