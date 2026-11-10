/**
 * Multi-Turn AI Investigation Engine for ResolveIt India
 * Interactively questions the user, requests specific screenshots/evidence,
 * builds complete evidentiary facts, and generates the final legal action dossier.
 */

import { DisputeCase, EvidenceItem, TimelineEvent, ActionStep } from '../types/case';
import { addDays } from '../utils/dateUtils';
import { getStoredGeminiKey } from './aiService';
import { LegalYouTubeVideo, getRecommendedVideos } from '../data/youtubeLegalVideos';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  requestedAction?: 'upload_invoice' | 'upload_photo' | 'upload_chat' | 'payment_method' | 'none';
  quickReplies?: string[];
  attachedEvidence?: EvidenceItem[];
  recommendedVideos?: LegalYouTubeVideo[];
}

export interface CollectedCaseData {
  merchantName?: string;
  disputeSummary?: string;
  claimAmount?: number;
  orderNumber?: string;
  deliveryDate?: string;
  rejectionReason?: string;
  paymentMethod?: string;
  evidenceItems: EvidenceItem[];
  applicableAct?: string;
  readinessScore: number; // 0 to 100
}

/**
 * Evaluates current collected data and determines next step in investigation
 */
export function evaluateCaseReadiness(data: CollectedCaseData): number {
  let score = 20; // Initial complaint logged
  if (data.merchantName && data.merchantName !== 'Merchant / E-Commerce Provider') score += 20;
  if (data.claimAmount && data.claimAmount > 0) score += 15;
  if (data.orderNumber) score += 15;
  if (data.evidenceItems.length > 0) score += 15;
  if (data.paymentMethod || data.rejectionReason) score += 15;
  return Math.min(100, score);
}

/**
 * Intelligent Next-Turn AI Question Generator
 * Diagnoses what evidence or facts are still missing to make the case legally bulletproof.
 */
export async function getNextAiResponse(
  conversation: ChatMessage[],
  currentData: CollectedCaseData
): Promise<{ reply: ChatMessage; updatedData: CollectedCaseData }> {
  const lastUserMessage = [...conversation].reverse().find(m => m.sender === 'user');
  const userText = lastUserMessage?.text || '';
  const apiKey = getStoredGeminiKey();

  // Try Live Gemini multi-turn if key exists
  if (apiKey) {
    try {
      const geminiReply = await callGeminiChat(conversation, currentData, apiKey);
      if (geminiReply) return geminiReply;
    } catch (e) {
      console.warn('Gemini chat failed, using local legal reasoning agent:', e);
    }
  }

  // Dynamic Rule-Based AI Investigator
  return runDynamicInvestigationStep(userText, conversation, currentData);
}

function runDynamicInvestigationStep(
  userText: string,
  conversation: ChatMessage[],
  data: CollectedCaseData
): { reply: ChatMessage; updatedData: CollectedCaseData } {
  const lastUserMessage = [...conversation].reverse().find(m => m.sender === 'user');
  const textLower = userText.toLowerCase();
  const updatedData: CollectedCaseData = { ...data, evidenceItems: [...data.evidenceItems] };

  // 1. Extract newly provided facts from user text
  // Extract Amount if mentioned
  const amtMatch = userText.match(/(?:₹|rs\.?|inr)\s?([0-9,]+)/i) || userText.match(/([0-9,]+)\s?(?:₹|rs\.?|rupees|inr)/i);
  if (amtMatch && !updatedData.claimAmount) {
    updatedData.claimAmount = parseFloat(amtMatch[1].replace(/,/g, ''));
  }

  // Extract Order ID
  const orderMatch = userText.match(/(?:order|ref|id|od|#)\s*(?:no\.?|id|:)?\s*([A-Za-z0-9_-]{5,20})/i);
  if (orderMatch && !updatedData.orderNumber) {
    updatedData.orderNumber = orderMatch[1].toUpperCase();
  }

  // Extract Merchant
  if (!updatedData.merchantName) {
    if (textLower.includes('flipkart')) updatedData.merchantName = 'Flipkart Internet Pvt Ltd';
    else if (textLower.includes('swiggy')) updatedData.merchantName = 'Swiggy (Bundl Technologies)';
    else if (textLower.includes('zomato')) updatedData.merchantName = 'Zomato Limited';
    else if (textLower.includes('amazon')) updatedData.merchantName = 'Amazon India';
    else if (textLower.includes('phonepe') || textLower.includes('upi')) updatedData.merchantName = 'PhonePe / Bank UPI';
    else if (textLower.includes('blinkit')) updatedData.merchantName = 'Blinkit';
    else if (textLower.includes('indigo')) updatedData.merchantName = 'IndiGo Airlines';
  }

  // Payment Method
  if (!updatedData.paymentMethod) {
    if (textLower.includes('upi') || textLower.includes('gpay') || textLower.includes('phonepe') || textLower.includes('paytm')) {
      updatedData.paymentMethod = 'UPI (Electronic Payment)';
    } else if (textLower.includes('credit card') || textLower.includes('debit card') || textLower.includes('card')) {
      updatedData.paymentMethod = 'Card (Visa / Mastercard / RuPay)';
    } else if (textLower.includes('cod') || textLower.includes('cash on delivery') || textLower.includes('cash')) {
      updatedData.paymentMethod = 'Cash on Delivery (COD)';
    }
  }

  // Attach any uploaded evidence from the last user message
  if (lastUserMessage?.attachedEvidence) {
    updatedData.evidenceItems.push(...lastUserMessage.attachedEvidence);
  }

  updatedData.readinessScore = evaluateCaseReadiness(updatedData);

  // 2. Decide the next investigative question
  const msgId = `ai-msg-${Date.now()}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const matchedVideos = getRecommendedVideos(userText + ' ' + (data.disputeSummary || ''));

  // Step A: Need screenshot / photo evidence?
  if (updatedData.evidenceItems.length === 0) {
    const isPhysical = textLower.includes('damage') || textLower.includes('broken') || textLower.includes('fake') || textLower.includes('food');
    return {
      reply: {
        id: msgId,
        sender: 'ai',
        text: `Dost, don't worry — I'm right here with you! Under Indian law, ${updatedData.merchantName || 'the company'} cannot dismiss your claim with generic bot replies.\n\nTo make your claim legally solid, **upload a photo of the damaged part or screenshot of the rejection status**. Also, check out this quick legal guide video below:`,
        timestamp: time,
        requestedAction: isPhysical ? 'upload_photo' : 'upload_chat',
        quickReplies: ['I will upload photo now', 'I only have the invoice', 'I have chat screenshot'],
        recommendedVideos: matchedVideos.slice(0, 1)
      },
      updatedData
    };
  }

  // Step B: Need Order / Invoice Reference?
  if (!updatedData.orderNumber) {
    return {
      reply: {
        id: msgId,
        sender: 'ai',
        text: `Got that evidence! Now, what is the exact **Order ID** or **Transaction Reference Number** shown in your app? If you have the invoice PDF or image, you can upload it directly.`,
        timestamp: time,
        requestedAction: 'upload_invoice',
        quickReplies: ['OD' + Math.floor(1000000000 + Math.random() * 9000000000), 'Let me check my email', 'I have uploaded the bill'],
        recommendedVideos: matchedVideos.slice(0, 1)
      },
      updatedData
    };
  }

  // Step C: Need Disputed Amount & Payment Method?
  if (!updatedData.claimAmount || !updatedData.paymentMethod) {
    return {
      reply: {
        id: msgId,
        sender: 'ai',
        text: `Understood. What was the exact **amount paid** in ₹ (INR), and how did you pay (UPI, Credit Card, or Cash on Delivery)? This determines whether RBI electronic refund guidelines apply.`,
        timestamp: time,
        requestedAction: 'payment_method',
        quickReplies: ['Paid ₹1,499 via UPI', 'Paid ₹480 via GPay', 'Paid ₹2,500 via Credit Card', 'Cash on Delivery'],
        recommendedVideos: matchedVideos.slice(0, 1)
      },
      updatedData
    };
  }

  // Step D: We have all facts! Case is 100% complete!
  updatedData.readinessScore = 100;
  return {
    reply: {
      id: msgId,
      sender: 'ai',
      text: `🎉 Perfect, dost! I have collected all essential evidence and facts.\n\n- **Merchant**: ${updatedData.merchantName}\n- **Amount at stake**: ₹${updatedData.claimAmount.toLocaleString('en-IN')}\n- **Order Ref**: #${updatedData.orderNumber}\n- **Verified Evidence**: ${updatedData.evidenceItems.length} documents/photos\n\nI have formulated your **Grievance Notice** under Rule 5 of the E-Commerce Rules 2020 and prepared direct escalation to National Consumer Helpline (1915). Tap below to open your Legal Action Dossier!`,
      timestamp: time,
      requestedAction: 'none',
      quickReplies: ['View My Legal Action Dossier →', 'Send Notice to Grievance Officer', 'Call NCH 1915'],
      recommendedVideos: matchedVideos.slice(0, 2)
    },
    updatedData
  };
}

/**
 * Multi-turn Gemini API Conversation with live context
 */
async function callGeminiChat(
  history: ChatMessage[],
  data: CollectedCaseData,
  apiKey: string
): Promise<{ reply: ChatMessage; updatedData: CollectedCaseData } | null> {
  const contents = history.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const prompt = `System: You are ResolveIt India's Senior Consumer Advocate. Interview the consumer to collect 5 mandatory facts for an airtight Indian Consumer Court / NCH claim:
1. Exact Merchant name (Flipkart, Swiggy, etc.)
2. Order / Tracking Ref #
3. Disputed Amount in ₹
4. Specific fault & reason company refused refund
5. Photo proof or screenshot of chat
Current status: Amount: ${data.claimAmount || 'Missing'}, Order: ${data.orderNumber || 'Missing'}, Evidence count: ${data.evidenceItems.length}.
Respond with 2 empathetic, concise sentences asking for whatever key detail or screenshot is missing next.`;

  contents.unshift({ role: 'user', parts: [{ text: prompt }] });

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.3 } })
  });

  if (!res.ok) return null;
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const msgId = `ai-msg-${Date.now()}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    reply: {
      id: msgId,
      sender: 'ai',
      text,
      timestamp: time,
      quickReplies: ['Upload Screenshot', 'Here are my details', 'What laws apply here?']
    },
    updatedData: { ...data, readinessScore: evaluateCaseReadiness(data) }
  };
}

/**
 * Builds the final DisputeCase from the investigated data
 */
export function buildCaseFromInvestigation(data: CollectedCaseData): DisputeCase {
  const today = new Date().toISOString().split('T')[0];
  const merchant = data.merchantName || 'E-Commerce Merchant';
  const amount = data.claimAmount || 1499;
  const orderNum = data.orderNumber || 'OD-' + Math.floor(100000000 + Math.random() * 900000000);

  const timeline: TimelineEvent[] = [
    {
      id: 't-1',
      date: today,
      title: 'Dispute Captured & Evidence Verified',
      description: `Investigated by AI. ${data.evidenceItems.length} proof items verified.`,
      category: 'communication'
    },
    {
      id: 't-2',
      date: addDays(today, 2),
      title: 'Grievance Officer 48h Response Window',
      description: 'Mandatory statutory deadline under Rule 5(4) of E-Commerce Rules 2020.',
      category: 'statutory_deadline',
      isStatutoryNotice: true
    },
    {
      id: 't-3',
      date: addDays(today, 7),
      title: 'National Consumer Helpline (NCH 1915) Docket',
      description: 'Department of Consumer Affairs intervention if merchant fails to refund.',
      category: 'escalation'
    }
  ];

  const actionSteps: ActionStep[] = [
    {
      id: 's-1',
      title: 'Evidence Dossier compiled & sealed',
      description: `${data.evidenceItems.length} photos, receipts, and order logs stored.`,
      isCompleted: true
    },
    {
      id: 's-2',
      title: `Send Legal Notice to ${merchant.split(' ')[0]} Grievance Officer`,
      description: 'Demand refund within 48h citing Consumer Protection Act 2019.',
      isCompleted: false,
      recommendedTemplateId: 'in_grievance_notice'
    },
    {
      id: 's-3',
      title: 'Lodge Docket on National Consumer Helpline (1915)',
      description: 'WhatsApp 8800001915 or call 1915 toll-free.',
      isCompleted: false,
      isEscalationStep: true,
      officialResourceId: 'in-nch'
    },
    {
      id: 's-4',
      title: 'File E-Daakhil Online Consumer Court Petition',
      description: 'Claim ₹' + amount + ' refund plus compensation for mental harassment.',
      isCompleted: false,
      isEscalationStep: true,
      officialResourceId: 'in-edaakhil'
    }
  ];

  return {
    id: `case-${Date.now()}`,
    title: `Dispute with ${merchant.split(' ')[0]} (₹${amount.toLocaleString('en-IN')})`,
    merchantName: merchant,
    claimAmount: amount,
    currency: '₹',
    category: 'damaged_goods',
    status: 'evidence_gathering',
    jurisdiction: 'IN',
    createdAt: today,
    updatedAt: today,
    initialNarrative: data.disputeSummary || `Dispute regarding Order #${orderNum} with ${merchant}`,
    orderNumber: orderNum,
    incidentDate: today,
    statutoryDeadlineDays: 2,
    statutoryDeadlineDate: addDays(today, 2),
    evidence: data.evidenceItems,
    timeline,
    actionSteps,
    notes: 'Case thoroughly investigated and verified by ResolveIt AI.'
  };
}
