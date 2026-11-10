import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatMessage, 
  CollectedCaseData, 
  getNextAiResponse, 
  buildCaseFromInvestigation 
} from '../../services/aiChatService';
import { extractDataFromScreenshot } from '../../services/ocrService';
import { DisputeCase, EvidenceItem } from '../../types/case';
import { 
  ArrowLeft, 
  Send, 
  Camera, 
  CheckCircle2, 
  Paperclip,
  ScanEye 
} from 'lucide-react';
import { YouTubeVideoCard } from '../video/YouTubeVideoCard';

interface AiInvestigatorChatProps {
  initialComplaint: string;
  initialAttachments?: EvidenceItem[];
  onCaseComplete: (newCase: DisputeCase) => void;
  onBack: () => void;
}

export const AiInvestigatorChat: React.FC<AiInvestigatorChatProps> = ({
  initialComplaint,
  initialAttachments = [],
  onCaseComplete,
  onBack
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'msg-1',
        sender: 'user',
        text: initialComplaint,
        timestamp: time,
        attachedEvidence: initialAttachments
      },
      {
        id: 'msg-2',
        sender: 'ai',
        text: "I've reviewed your complaint. In India, e-commerce platforms are governed by the Consumer Protection (E-Commerce) Rules, 2020 and cannot dismiss returns with automated bot replies.\n\nTo build an airtight legal claim, **please upload a screenshot of your order page, damaged product, or chat support rejection**.",
        timestamp: time,
        requestedAction: 'upload_photo',
        quickReplies: ['I will upload screenshot now', 'Seller rejected return', 'Chat bot closed my ticket']
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [caseData, setCaseData] = useState<CollectedCaseData>({
    disputeSummary: initialComplaint,
    evidenceItems: [...initialAttachments],
    readinessScore: 40
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isScanningOcr]);

  const handleSendMessage = async (textToSend?: string, attachedEvidence?: EvidenceItem[]) => {
    const text = (textToSend || inputText).trim();
    if (!text && (!attachedEvidence || attachedEvidence.length === 0)) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text || 'Uploaded requested evidence documents.',
      timestamp: time,
      attachedEvidence
    };

    const newConversation = [...messages, userMsg];
    setMessages(newConversation);
    setInputText('');
    setIsTyping(true);

    try {
      const { reply, updatedData } = await getNextAiResponse(newConversation, caseData);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, reply]);
        setCaseData(updatedData);
      }, 700);
    } catch (err) {
      setIsTyping(false);
      console.error('AI chat failed:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsScanningOcr(true);
    const newEvidence: EvidenceItem[] = [];
    const firstFile = files[0];

    // Run Vision OCR on screenshot
    const ocrResult = await extractDataFromScreenshot(firstFile);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      newEvidence.push({
        id: `ev-chat-${Date.now()}-${i}`,
        name: file.name,
        type: isImg ? 'photo' : 'receipt',
        fileUrl: isImg ? URL.createObjectURL(file) : undefined,
        description: ocrResult.extractedTextSummary || 'Evidence provided during investigation',
        uploadedAt: new Date().toISOString().split('T')[0],
        fileSize: `${Math.round(file.size / 1024)} KB`
      });
    }

    // Auto-update case data from OCR findings
    setCaseData(prev => ({
      ...prev,
      merchantName: ocrResult.merchantName || prev.merchantName,
      orderNumber: ocrResult.orderNumber || prev.orderNumber,
      claimAmount: ocrResult.claimAmount || prev.claimAmount,
      readinessScore: Math.min(100, prev.readinessScore + 30)
    }));

    setIsScanningOcr(false);

    const ocrSummaryMsg = `📸 Uploaded ${firstFile.name}\n🔍 OCR Extracted: ${ocrResult.merchantName || 'Merchant'} | Order: ${ocrResult.orderNumber || 'Detected'} | Disputed: ₹${ocrResult.claimAmount || 'Detected'}`;
    handleSendMessage(ocrSummaryMsg, newEvidence);

    if (e.target) e.target.value = '';
  };

  const handleCompleteCase = () => {
    const finalCase = buildCaseFromInvestigation(caseData);
    onCaseComplete(finalCase);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-[#fbf8f3] text-slate-900 select-none overflow-hidden h-full">
      {/* Top Header Bar */}
      <div className="shrink-0 bg-white border-b border-[#ede3d5] px-4 py-2.5 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#de7b35] shadow-xs">
              <img src="/assistant-avatar.png" alt="AI Lawyer" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">AI Case Investigator</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Vision OCR & Legal Diagnosis
              </p>
            </div>
          </div>
        </div>

        {/* Live Case Readiness Meter */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Case Readiness</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-16 bg-[#ede3d5] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#de7b35] h-full rounded-full transition-all duration-500"
                style={{ width: `${caseData.readinessScore}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#de7b35]">{caseData.readinessScore}%</span>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 rounded-bl-xs border border-[#ede3d5]'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Render Attached Evidence Pill */}
              {msg.attachedEvidence && msg.attachedEvidence.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 space-y-1">
                  {msg.attachedEvidence.map(ev => (
                    <div key={ev.id} className="flex items-center gap-1.5 text-[10.5px] bg-white/10 px-2 py-1 rounded-lg">
                      <Paperclip className="w-3 h-3 text-[#de7b35]" />
                      <span className="truncate">{ev.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Action Request */}
              {msg.requestedAction && msg.requestedAction !== 'none' && msg.sender === 'ai' && (
                <div className="mt-2.5 pt-2 border-t border-[#f2ede4]">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faede2] hover:bg-[#f6dfcb] text-[#de7b35] font-bold text-[11px] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Screenshot (Auto-OCR)</span>
                  </button>
                </div>
              )}

              {/* Recommended YouTube Video Guides */}
              {msg.recommendedVideos && msg.recommendedVideos.length > 0 && msg.sender === 'ai' && (
                <div className="mt-3 pt-2.5 border-t border-[#f2ede4] space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                    <span>▶ Recommended Legal Video Guide:</span>
                  </div>
                  {msg.recommendedVideos.map(vid => (
                    <YouTubeVideoCard key={vid.id} video={vid} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Replies Chips */}
            {msg.quickReplies && msg.sender === 'ai' && msg.id === messages[messages.length - 1]?.id && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {msg.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (reply.includes('Legal Action Dossier')) {
                        handleCompleteCase();
                      } else {
                        handleSendMessage(reply);
                      }
                    }}
                    className="text-[10.5px] font-semibold bg-[#faf6f0] hover:bg-[#f2ece0] text-slate-700 border border-[#eedfcb] px-2.5 py-1 rounded-full transition-all active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isScanningOcr && (
          <div className="flex items-center gap-2 text-xs text-[#de7b35] font-bold pl-2 bg-[#faede2] p-2.5 rounded-xl border border-[#eedfcb]">
            <ScanEye className="w-4 h-4 animate-spin text-[#de7b35]" />
            <span>Scanning screenshot with Multimodal Vision OCR...</span>
          </div>
        )}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
            <div className="w-5 h-5 rounded-full bg-[#de7b35] flex items-center justify-center text-white text-[9px] animate-bounce">
              ⚖️
            </div>
            <span>AI Advocate is reviewing your evidence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Case Complete Banner */}
      {caseData.readinessScore >= 80 && (
        <div className="p-3 mx-4 mb-2 bg-[#faede2] rounded-2xl border border-[#eedfcb] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] font-bold text-slate-900">All evidence collected!</p>
          </div>
          <button
            onClick={handleCompleteCase}
            className="px-3 py-1.5 bg-[#de7b35] hover:bg-[#c96a28] text-white text-[11px] font-bold rounded-xl shadow-xs"
          >
            Generate Dossier →
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-3 bg-white border-t border-[#ede3d5] shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-[#faf6f0] text-slate-600 hover:text-slate-900 hover:bg-[#f2ece0] transition-colors"
            title="Upload Screenshot (Auto-OCR)"
          >
            <Camera className="w-4 h-4 text-[#de7b35]" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type answer or upload screenshot..."
            className="flex-1 px-3 py-2 text-xs bg-[#faf8f5] rounded-xl border border-[#ede3d5] focus:outline-none focus:border-[#de7b35]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-xl text-white transition-all ${
              inputText.trim() ? 'bg-slate-900 hover:bg-black' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
