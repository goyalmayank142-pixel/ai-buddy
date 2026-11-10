import React, { useState, useEffect } from 'react';
import { DisputeCase } from '../../types/case';
import { LETTER_TEMPLATES } from '../../data/letterTemplates';
import { formatDate, daysBetween } from '../../utils/dateUtils';
import { X, Copy, Download, Check, Sparkles, Scale } from 'lucide-react';

interface LetterGeneratorModalProps {
  disputeCase: DisputeCase;
  initialTemplateId?: string;
  onClose: () => void;
}

export const LetterGeneratorModal: React.FC<LetterGeneratorModalProps> = ({
  disputeCase,
  initialTemplateId,
  onClose
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || 'statutory_notice'
  );
  const [userName, setUserName] = useState('Aarav Sharma');
  const [userEmail, setUserEmail] = useState('aarav.sharma@gmail.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [bankName, setBankName] = useState('State Bank of India (SBI) / HDFC Bank');

  const [subjectText, setSubjectText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [copied, setCopied] = useState(false);

  const currentTemplate = LETTER_TEMPLATES.find(t => t.id === selectedTemplateId) || LETTER_TEMPLATES[0];

  useEffect(() => {
    if (!currentTemplate) return;

    const elapsedDays = disputeCase.incidentDate
      ? Math.max(1, daysBetween(disputeCase.incidentDate, new Date()))
      : 14;

    const amountFormatted = `${disputeCase.currency}${disputeCase.claimAmount.toFixed(2)}`;
    const orderNum = disputeCase.orderNumber || 'AH-99412';
    const incidentDateFormatted = formatDate(disputeCase.incidentDate);
    const purchaseDateFormatted = formatDate(disputeCase.purchaseDate || disputeCase.incidentDate);

    // Replace placeholders in subject
    let subject = currentTemplate.subjectTemplate
      .replace(/\[ORDER_NUMBER\]/g, orderNum)
      .replace(/\[MERCHANT_NAME\]/g, disputeCase.merchantName)
      .replace(/\[CLAIM_AMOUNT\]/g, amountFormatted);

    // Replace placeholders in body
    let body = currentTemplate.bodyTemplate
      .replace(/\[MERCHANT_NAME\]/g, disputeCase.merchantName)
      .replace(/\[ORDER_NUMBER\]/g, orderNum)
      .replace(/\[CLAIM_AMOUNT\]/g, amountFormatted)
      .replace(/\[INCIDENT_DATE\]/g, incidentDateFormatted)
      .replace(/\[PURCHASE_DATE\]/g, purchaseDateFormatted)
      .replace(/\[ELAPSED_DAYS\]/g, elapsedDays.toString())
      .replace(/\[TRACKING_INFO\]/g, disputeCase.evidence.find(e => e.type === 'receipt')?.name || 'Royal Mail Tracked Return #GB778291032')
      .replace(/\[YOUR_NAME\]/g, userName)
      .replace(/\[YOUR_EMAIL\]/g, userEmail)
      .replace(/\[YOUR_PHONE\]/g, userPhone)
      .replace(/\[YOUR_BANK_NAME\]/g, bankName);

    setSubjectText(subject);
    setBodyText(body);
  }, [selectedTemplateId, disputeCase, userName, userEmail, userPhone, bankName]);

  const handleCopy = () => {
    const fullText = `Subject: ${subjectText}\n\n${bodyText}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `Subject: ${subjectText}\n\n${bodyText}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dispute_Letter_${disputeCase.merchantName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#fcf9f5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Statutory Letter & Message Generator</h2>
              <p className="text-xs text-slate-500">
                Pre-configured legally enforceable notices citing consumer protection laws
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Template Selector Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Dispute Stage & Legal Notice:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {LETTER_TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/10 text-brand-950 font-semibold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tmpl.legalBasis}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Legal Citation Pill */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Statutory Basis:</strong> {currentTemplate.legalBasis}
            </span>
          </div>

          {/* User Variable Personalization */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-amber-900/10 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="mt-1 w-full p-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Your Email</label>
              <input
                type="text"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="mt-1 w-full p-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
              <input
                type="text"
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
                className="mt-1 w-full p-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Card Provider / Bank</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="mt-1 w-full p-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Subject Line</label>
            <input
              type="text"
              value={subjectText}
              onChange={e => setSubjectText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-900"
            />
          </div>

          {/* Body Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Notice Body</label>
            <textarea
              rows={11}
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#faf8f5] flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Copy into merchant email or print for physical post
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
