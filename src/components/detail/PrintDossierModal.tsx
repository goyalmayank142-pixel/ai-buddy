import React, { useState } from 'react';
import { DisputeCase } from '../../types/case';
import { formatDate } from '../../utils/dateUtils';
import { getLegalFramework } from '../../utils/caseExtractor';
import { findGrievanceOfficer } from '../../data/indianGrievanceDirectory';
import { X, Printer, Mail, Scale } from 'lucide-react';

interface PrintDossierModalProps {
  disputeCase: DisputeCase;
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({ disputeCase, onClose }) => {
  const [docType, setDocType] = useState<'speed_post' | 'edaakhil'>('speed_post');

  const handlePrint = () => {
    window.print();
  };

  const legalBasis = getLegalFramework(disputeCase.category, disputeCase.jurisdiction);
  const officer = findGrievanceOfficer(disputeCase.merchantName);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          {/* Format Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setDocType('speed_post')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                docType === 'speed_post' ? 'bg-[#de7b35] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>India Post Speed Post Notice</span>
            </button>
            <button
              onClick={() => setDocType('edaakhil')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                docType === 'edaakhil' ? 'bg-[#de7b35] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>E-Daakhil Court Petition</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-6 text-slate-800 bg-white font-serif" id="printable-dossier">
          {docType === 'speed_post' ? (
            /* India Post Speed Post Format */
            <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between font-sans">
                <div>
                  <p className="font-extrabold uppercase text-[#de7b35] tracking-wider text-xs">
                    BY SPEED POST WITH ACKNOWLEDGMENT DUE (RPAD)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Formal Pre-Action Legal Notice under Consumer Protection Act, 2019</p>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <p>Ref: RES/IN/{disputeCase.id.slice(-6).toUpperCase()}</p>
                  <p>Date: {formatDate(new Date().toISOString())}</p>
                </div>
              </div>

              {/* Addressee (Grievance Officer) */}
              <div className="font-sans text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">TO:</p>
                <p className="font-bold text-slate-800">{officer?.grievanceOfficerName || 'The Resident Grievance Officer'}</p>
                <p className="font-semibold text-slate-700">{officer?.legalEntityName || disputeCase.merchantName}</p>
                <p className="text-slate-600 mt-1 whitespace-pre-line">{officer?.registeredOffice || 'Corporate Head Office, India'}</p>
                <p className="text-slate-500 font-mono mt-1">Email: {officer?.grievanceEmail || 'grievance.officer@flipkart.com'}</p>
              </div>

              {/* Subject */}
              <div className="font-sans font-bold text-xs uppercase bg-[#faede2] p-2.5 rounded-lg border border-[#eedfcb] text-slate-900">
                SUBJECT: STATUTORY LEGAL DEMAND FOR REFUND OF ₹{disputeCase.claimAmount.toLocaleString('en-IN')} REGARDING ORDER #{disputeCase.orderNumber || 'REF-DISPUTE'}
              </div>

              {/* Body */}
              <p>Sir/Madam,</p>
              <p>
                Under instructions and authority from the aggrieved consumer, this formal statutory notice is served upon you regarding <strong>Order #{disputeCase.orderNumber || 'N/A'}</strong> dated {formatDate(disputeCase.purchaseDate || disputeCase.incidentDate)}.
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-sans text-xs">
                <p className="font-bold">FACTS OF UNLAWFUL DENIAL:</p>
                <p className="mt-1 text-slate-700 italic">"{disputeCase.initialNarrative}"</p>
              </div>

              <p>
                Your refusal to remedy the defect or credit the refund of <strong>₹{disputeCase.claimAmount.toLocaleString('en-IN')}</strong> constitutes <em>Deficiency in Service</em> under Section 2(11) and <em>Unfair Trade Practice</em> under Section 2(47) of the Consumer Protection Act, 2019. Furthermore, Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020 explicitly mandates acknowledgment within 48 hours and complete redressal within one month.
              </p>

              <div className="font-sans font-bold text-xs text-rose-900 bg-rose-50 p-3 rounded-lg border border-rose-200">
                DEMAND & 7-DAY STATUTORY WARNING:
                <p className="font-normal text-rose-800 mt-1">
                  You are called upon to credit the full sum of ₹{disputeCase.claimAmount.toLocaleString('en-IN')} within seven (7) days of delivery of this Speed Post notice. If you fail to do so, legal proceedings will be instituted on the E-Daakhil portal before the Consumer Commission for refund, ₹25,000 compensation for mental harassment, and legal costs.
                </p>
              </div>

              <div className="pt-6 font-sans flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold">Aggrieved Consumer: ______________________</p>
                  <p className="text-slate-500">Contact: +91 98765 43210</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">National Consumer Helpline Docket: Ready</p>
                </div>
              </div>
            </div>
          ) : (
            /* E-Daakhil Online Consumer Forum Petition Format */
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="text-center font-sans space-y-1 border-b-2 border-slate-900 pb-4">
                <p className="font-extrabold text-xs uppercase tracking-wider text-slate-500">FORMAT AS PRESCRIBED UNDER SECTION 35, CPA 2019</p>
                <p className="font-black text-sm">BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION</p>
                <p className="text-xs text-slate-600">CONSUMER COMPLAINT NO. ______ OF {new Date().getFullYear()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 font-sans text-xs bg-slate-50 p-3 rounded-xl border">
                <div>
                  <p className="font-bold text-slate-900">COMPLAINANT:</p>
                  <p>Aarav Sharma</p>
                  <p className="text-slate-500">Resident of Delhi / India</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">OPPOSITE PARTY (O.P.):</p>
                  <p>{officer?.legalEntityName || disputeCase.merchantName}</p>
                  <p className="text-slate-500">{officer?.registeredOffice || 'Corporate Office'}</p>
                </div>
              </div>

              <p className="font-sans font-bold text-xs uppercase text-center py-1 bg-slate-100 rounded">
                COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019
              </p>

              <div className="space-y-2 text-xs">
                <p><strong>1. BRIEF FACTS:</strong> On {formatDate(disputeCase.purchaseDate)}, Complainant paid ₹{disputeCase.claimAmount} for order #{disputeCase.orderNumber}. The item was defective / rejected wrongfully by Opposite Party.</p>
                <p><strong>2. CAUSE OF ACTION:</strong> Arose when Opposite Party arbitrarily refused legitimate refund under {legalBasis}.</p>
                <p><strong>3. JURISDICTION:</strong> This Hon'ble Commission has territorial and pecuniary jurisdiction under Section 34 of CPA 2019.</p>
                <p><strong>4. PRAYER / RELIEF SOUGHT:</strong> Complainant prays for an order directing O.P. to: (a) Refund ₹{disputeCase.claimAmount}; (b) Pay ₹20,000 as compensation for mental agony; (c) Pay ₹5,000 towards litigation costs.</p>
              </div>

              <div className="pt-4 font-sans text-xs flex justify-between">
                <span>Verification: Verified on oath by Complainant</span>
                <span>Signature: ________________</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
