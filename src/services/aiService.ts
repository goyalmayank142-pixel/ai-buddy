/**
 * Real AI Service for ResolveIt India
 * Connects to Gemini API for live LLM reasoning, with a comprehensive
 * Indian Consumer Law dynamic reasoning engine as fallback/default.
 */

import { DisputeCase, ActionStep, TimelineEvent } from '../types/case';
import { addDays } from '../utils/dateUtils';

export interface AIAnalysisResult {
  merchantName: string;
  claimAmount: number;
  currency: string;
  category: DisputeCase['category'];
  title: string;
  legalAct: string;
  statuteViolationSummary: string;
  timeline: TimelineEvent[];
  actionSteps: ActionStep[];
  formalNoticeDraft: {
    subject: string;
    body: string;
    recipientRole: string;
  };
  recommendedHelpline: {
    name: string;
    contact: string;
    action: string;
  };
}

const GEMINI_API_KEY_STORAGE = 'resolveit_gemini_api_key';

export function getStoredGeminiKey(): string {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
}

export function saveStoredGeminiKey(key: string): void {
  if (key) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  }
}

/**
 * Main Analysis Entry Point:
 * Uses live Gemini API if key is available, or our rich dynamic Indian Law engine.
 */
export async function analyzeConsumerDispute(
  narrative: string,
  userApiKey?: string
): Promise<AIAnalysisResult> {
  const apiKey = userApiKey || getStoredGeminiKey();

  if (apiKey) {
    try {
      const geminiResult = await callGeminiAPI(narrative, apiKey);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic Indian legal reasoning engine:', err);
    }
  }

  // High-fidelity dynamic reasoning engine tailored to Indian consumer laws
  return runDynamicIndianLegalAnalysis(narrative);
}

/**
 * Live Google Gemini 1.5 Flash API Integration
 */
async function callGeminiAPI(narrative: string, apiKey: string): Promise<AIAnalysisResult | null> {
  const systemPrompt = `You are ResolveIt India's Senior Consumer Rights Advocate and Legal Assistant.
Analyze the user's consumer complaint according to Indian Consumer Laws (Consumer Protection Act 2019, Consumer Protection E-Commerce Rules 2020, RBI circular on UPI / electronic transactions DPSS.CO.PD No.629/02.01.014/2019-20, DGCA Passenger Charter, or CCPA).

Return a strictly valid JSON object with:
{
  "merchantName": "Name of company/merchant in India",
  "claimAmount": number (in INR, 0 if not mentioned),
  "currency": "₹",
  "category": "delayed_refund" | "damaged_goods" | "unresponsive_service" | "subscription_charge" | "lost_delivery" | "flight_cancellation" | "other",
  "title": "Short punchy case title",
  "legalAct": "Exact Indian Law, Section, or RBI Circular violated",
  "statuteViolationSummary": "2-3 sentences explaining exactly how the merchant violated Indian law and consumer rights",
  "timeline": [
    {"id": "t1", "date": "YYYY-MM-DD", "title": "Milestone title", "description": "details", "category": "purchase|return|delivery|communication|statutory_deadline"}
  ],
  "actionSteps": [
    {"id": "s1", "title": "Action title", "description": "Clear step instructions for Indian consumer", "isCompleted": false, "isEscalationStep": false}
  ],
  "formalNoticeDraft": {
    "subject": "Formal Legal Notice under Consumer Protection Act 2019...",
    "body": "Full professional legal notice to the Grievance Officer of the company citing sections, timelines, and 48-hour compliance window",
    "recipientRole": "Nodal Grievance Officer"
  },
  "recommendedHelpline": {
    "name": "National Consumer Helpline (NCH) 1915 / E-Daakhil / RBI Ombudsman",
    "contact": "1915 or WhatsApp +91 88000 01915",
    "action": "How to register complaint"
  }
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Complaint:\n"${narrative}"` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) return null;

  return JSON.parse(textContent) as AIAnalysisResult;
}

/**
 * Intelligent Dynamic Indian Legal Analysis Engine
 * Evaluates context, entities, merchant, breach type, and computes dynamic legal guidance.
 */
export function runDynamicIndianLegalAnalysis(narrative: string): AIAnalysisResult {
  const text = narrative.trim();
  const lower = text.toLowerCase();
  const today = new Date().toISOString().split('T')[0];

  // 1. Merchant Detection in India
  let merchant = 'Merchant / E-Commerce Provider';
  const indianMerchants = [
    { key: 'swiggy', name: 'Swiggy (Bundl Technologies)' },
    { key: 'zomato', name: 'Zomato Limited' },
    { key: 'flipkart', name: 'Flipkart Internet Pvt Ltd' },
    { key: 'amazon', name: 'Amazon India (ASSPL)' },
    { key: 'meesho', name: 'Meesho (Fashnear)' },
    { key: 'blinkit', name: 'Blinkit (Commerce)' },
    { key: 'zepto', name: 'Zepto (KiranaKart)' },
    { key: 'phonepe', name: 'PhonePe Private Limited' },
    { key: 'gpay', name: 'Google Pay India' },
    { key: 'paytm', name: 'Paytm (One97 Communications)' },
    { key: 'sbi', name: 'State Bank of India (SBI)' },
    { key: 'hdfc', name: 'HDFC Bank' },
    { key: 'icici', name: 'ICICI Bank' },
    { key: 'indigo', name: 'IndiGo Airlines (InterGlobe)' },
    { key: 'air india', name: 'Air India Limited' },
    { key: 'spicejet', name: 'SpiceJet Limited' },
    { key: 'jio', name: 'Reliance Jio Infocomm' },
    { key: 'airtel', name: 'Bharti Airtel Limited' },
    { key: 'boat', name: 'boAt Lifestyle (Imagine Marketing)' },
    { key: 'urban company', name: 'Urban Company' },
    { key: 'ola', name: 'Ola Cabs (ANI Tech)' },
    { key: 'uber', name: 'Uber India Systems' }
  ];

  for (const m of indianMerchants) {
    if (lower.includes(m.key)) {
      merchant = m.name;
      break;
    }
  }

  // 2. Disputed Amount Extraction (₹, Rs, INR, numbers)
  let claimAmount = 0;
  const amountMatch =
    text.match(/(?:₹|rs\.?|inr)\s?([0-9,]+(?:\.[0-9]{2})?)/i) ||
    text.match(/([0-9,]+(?:\.[0-9]{2})?)\s?(?:₹|rs\.?|rupees|inr)/i) ||
    text.match(/\$\s?([0-9,]+(?:\.[0-9]{2})?)/);

  if (amountMatch) {
    claimAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 3. Category & Statutory Breach Classification
  let category: DisputeCase['category'] = 'other';
  let legalAct = 'Consumer Protection Act, 2019';
  let statuteViolationSummary = '';
  let deadlineDays = 14;

  if (lower.includes('upi') || lower.includes('phonepe') || lower.includes('gpay') || lower.includes('debited') || lower.includes('bank')) {
    category = 'unresponsive_service';
    legalAct = 'RBI Circular DPSS.CO.PD No.629/02.01.014/2019-20 (Harmonisation of Turn Around Time)';
    statuteViolationSummary = 'Under RBI TAT guidelines, failed UPI transactions where account is debited must be reversed within T + 1 business day. If delayed beyond this, the customer is entitled to ₹100 per day compensation.';
    deadlineDays = 1;
  } else if (lower.includes('flight') || lower.includes('airline') || lower.includes('indigo') || lower.includes('spicejet') || lower.includes('voucher')) {
    category = 'flight_cancellation';
    legalAct = 'DGCA Passenger Charter of Rights & Supreme Court Pravasi Legal Cell vs UOI (2020)';
    statuteViolationSummary = 'Airlines cannot unilaterally issue credit shells or vouchers for flights cancelled or rescheduled without consent. Full bank refund must be completed within 7 working days.';
    deadlineDays = 7;
  } else if (lower.includes('damaged') || lower.includes('broken') || lower.includes('defect') || lower.includes('wrong item') || lower.includes('fake')) {
    category = 'damaged_goods';
    legalAct = 'Section 2(47) & Section 86 Consumer Protection Act 2019 (Product Liability & Defective Goods)';
    statuteViolationSummary = 'The seller and marketplace platform are jointly liable for supply of defective or adulterated goods. The platform cannot evade liability by hiding behind third-party vendor disclaimers.';
    deadlineDays = 7;
  } else if (lower.includes('refund') || lower.includes('returned') || lower.includes('return')) {
    category = 'delayed_refund';
    legalAct = 'Rule 5(3)(e) Consumer Protection (E-Commerce) Rules, 2020';
    statuteViolationSummary = 'Every e-commerce entity is legally mandated to effect refund requests within a reasonable time, not exceeding standard refund processing timelines. Failing to credit refund constitutes Deficiency of Service under Section 2(11).';
    deadlineDays = 5;
  } else if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('food') || lower.includes('blinkit') || lower.includes('zepto')) {
    category = 'damaged_goods';
    legalAct = 'FSSAI Act 2006 & Consumer Protection (E-Commerce) Rules 2020';
    statuteViolationSummary = 'Delivery of contaminated, sub-standard, or mismatched food items violates food safety standards. Arbitrary refusal of refund by customer service bots constitutes Unfair Trade Practice under CPA 2019.';
    deadlineDays = 3;
  } else {
    statuteViolationSummary = 'Under Section 2(11) of the Consumer Protection Act, 2019, any fault, imperfection, or shortcoming in the quality, quantity, or standard of service constitutes Deficiency of Service.';
  }

  // 4. Construct Case Title
  const amountStr = claimAmount > 0 ? ` (₹${claimAmount.toLocaleString('en-IN')})` : '';
  const title = `${category === 'damaged_goods' ? 'Defective Product / Food' : category === 'delayed_refund' ? 'Unprocessed Refund' : 'Consumer Rights Dispute'} with ${merchant.split(' ')[0]}${amountStr}`;

  // 5. Build Dynamic Timeline
  const timeline: TimelineEvent[] = [
    {
      id: `evt-${Date.now()}-1`,
      date: today,
      title: 'Dispute & Complaint Logged',
      description: text.slice(0, 150) + (text.length > 150 ? '...' : ''),
      category: 'communication'
    },
    {
      id: `evt-${Date.now()}-2`,
      date: addDays(today, 2),
      title: 'Grievance Officer 48h Response Window',
      description: `Mandatory statutory acknowledgment requirement under Rule 5(4) of Consumer Protection (E-Commerce) Rules 2020.`,
      category: 'statutory_deadline',
      isStatutoryNotice: true
    },
    {
      id: `evt-${Date.now()}-3`,
      date: addDays(today, deadlineDays),
      title: 'Statutory Resolution Deadline',
      description: `If unresolved by ${merchant}, escalate directly to National Consumer Helpline 1915 or E-Daakhil.`,
      category: 'escalation'
    }
  ];

  // 6. Action Steps Tailored to India
  const actionSteps: ActionStep[] = [
    {
      id: 'as-1',
      title: 'Preserve Invoices, Order ID & Chat Logs',
      description: `Save the GST invoice, order confirmation screenshot, courier delivery note, and initial chat support screenshots.`,
      isCompleted: true
    },
    {
      id: 'as-2',
      title: 'Send Formal Statutory Notice to Grievance Officer',
      description: `Send formal email citing ${legalAct} giving ${merchant} 48 hours to rectify before regulatory filing.`,
      isCompleted: false,
      recommendedTemplateId: 'statutory_notice'
    },
    {
      id: 'as-3',
      title: 'Lodge Grievance on National Consumer Helpline (NCH - 1915)',
      description: `File an online consumer docket via consumerhelpline.gov.in or WhatsApp 8800001915 (Department of Consumer Affairs, Govt of India).`,
      isCompleted: false,
      isEscalationStep: true,
      officialResourceId: 'in-nch'
    },
    {
      id: 'as-4',
      title: category === 'unresponsive_service'
        ? 'File Complaint with RBI Banking Ombudsman (CMS)'
        : 'File Consumer Case on E-Daakhil Portal (Online Consumer Court)',
      description: category === 'unresponsive_service'
        ? 'Lodge complaint on cms.rbi.org.in for failed electronic debit under RBI T+1 turnaround rules.'
        : 'File e-pleading directly to District Consumer Disputes Redressal Commission without physical court visit.',
      isCompleted: false,
      isEscalationStep: true,
      officialResourceId: category === 'unresponsive_service' ? 'in-rbi' : 'in-edaakhil'
    }
  ];

  // 7. Dynamic Formal Notice to Grievance Officer
  const formalNoticeDraft = {
    subject: `LEGAL NOTICE: Deficiency in Service & Statutory Refund Claim of ₹${claimAmount || 'Disputed Amount'} - ${merchant}`,
    body: `To: The Resident Grievance Officer, ${merchant}
Pursuant to Consumer Protection (E-Commerce) Rules, 2020 & Consumer Protection Act, 2019

Sir/Madam,

I am writing this formal legal notice regarding an unresolved consumer dispute:
- Aggrieved Consumer: [YOUR_NAME]
- Contact Number: [YOUR_PHONE]
- Transaction/Order Reference: [ORDER_NUMBER]
- Total Disputed Amount: ₹${claimAmount || '[AMOUNT]'}

FACTS OF THE DISPUTE:
"${text}"

LEGAL INFRACTIONS:
1. The aforementioned conduct constitutes a "Deficiency of Service" under Section 2(11) of the Consumer Protection Act, 2019.
2. The denial or delay of legitimate refund constitutes an "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.
3. Under ${legalAct}, ${merchant} is legally mandated to address consumer grievances within 48 hours and effect complete redressal.

DEMAND:
I hereby demand the immediate reversal/refund of ₹${claimAmount || '[AMOUNT]'} to my original payment method within forty-eight (48) hours of receipt of this notice.

TAKE NOTICE:
If this dispute is not resolved within 48 hours, I will initiate the following enforcement actions without further intimation:
1. Formal docket registration with the National Consumer Helpline (NCH / INGRAM - Ministry of Consumer Affairs, Govt. of India).
2. Online petition filing on the E-Daakhil portal before the District Consumer Commission seeking compensation for mental harassment and litigation costs under Section 35 of CPA 2019.
3. Lodging a formal complaint with the Central Consumer Protection Authority (CCPA) for unfair trade practice.

Yours sincerely,
[YOUR_NAME]
Mobile: [YOUR_PHONE]`,
    recipientRole: 'Nodal Grievance Officer'
  };

  return {
    merchantName: merchant,
    claimAmount,
    currency: '₹',
    category,
    title,
    legalAct,
    statuteViolationSummary,
    timeline,
    actionSteps,
    formalNoticeDraft,
    recommendedHelpline: {
      name: 'National Consumer Helpline (NCH - 1915)',
      contact: 'Call 1915 / WhatsApp +91 88000 01915',
      action: 'File grievance docket with Department of Consumer Affairs'
    }
  };
}
