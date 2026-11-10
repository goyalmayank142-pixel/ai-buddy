import { CaseCategory, ActionStep, TimelineEvent, Jurisdiction } from '../types/case';
import { addDays } from './dateUtils';

export interface ExtractedCaseDraft {
  title: string;
  merchantName: string;
  claimAmount: number;
  currency: string;
  category: CaseCategory;
  orderNumber?: string;
  purchaseDate?: string;
  incidentDate?: string;
  statutoryDeadlineDays: number;
  suggestedActionSteps: ActionStep[];
  suggestedTimeline: TimelineEvent[];
}

/**
 * Intelligent parser that extracts structured entities and builds an action plan from freeform text
 */
export function extractCaseDetails(narrative: string, jurisdiction: Jurisdiction = 'UK'): ExtractedCaseDraft {
  const text = narrative.trim();
  const lower = text.toLowerCase();

  // 1. Detect Category
  let category: CaseCategory = 'other';
  if (lower.includes('refund') || lower.includes('return') || lower.includes('money back')) {
    category = 'delayed_refund';
  } else if (lower.includes('damaged') || lower.includes('broken') || lower.includes('faulty') || lower.includes('crack')) {
    category = 'damaged_goods';
  } else if (lower.includes('subscription') || lower.includes('cancelled') || lower.includes('recurring charge')) {
    category = 'subscription_charge';
  } else if (lower.includes('flight') || lower.includes('airline') || lower.includes('delayed flight') || lower.includes('canceled')) {
    category = 'flight_cancellation';
  } else if (lower.includes('lost') || lower.includes('never arrived') || lower.includes('not delivered') || lower.includes('missing parcel')) {
    category = 'lost_delivery';
  } else if (lower.includes('ghosted') || lower.includes('unresponsive') || lower.includes('refuse') || lower.includes('poor service')) {
    category = 'unresponsive_service';
  }

  // 2. Extract Currency & Amount
  let currency = jurisdiction === 'IN' ? '₹' : jurisdiction === 'US' ? '$' : jurisdiction === 'EU' ? '€' : '£';
  let claimAmount = 0;

  const moneyMatch = text.match(/(₹|Rs\.?|INR|£|\$|€)\s?([0-9,]+(?:\.\d{2})?)/i) ||
                     text.match(/([0-9,]+(?:\.\d{2})?)\s?(₹|Rs\.?|rupees|inr|pounds|dollars|euros)/i);

  if (moneyMatch) {
    const rawVal = (moneyMatch[1].match(/[0-9]/) ? moneyMatch[1] : moneyMatch[2]).replace(/,/g, '');
    claimAmount = parseFloat(rawVal) || 0;
    if (moneyMatch[1].includes('₹') || moneyMatch[1].toLowerCase().includes('rs') || moneyMatch[1].toUpperCase() === 'INR') {
      currency = '₹';
    } else if (['$', '£', '€'].includes(moneyMatch[1])) {
      currency = moneyMatch[1];
    }
  }

  // 3. Extract Order Number
  let orderNumber: string | undefined;
  const orderMatch = text.match(/(?:order|ref|invoice|case)\s*(?:#|no\.?|num)?\s*([A-Za-z0-9-_]{4,20})/i);
  if (orderMatch) {
    orderNumber = orderMatch[1].toUpperCase();
  }

  // 4. Extract Merchant Name
  let merchantName = 'Merchant / Company';
  const fromMatch = text.match(/(?:from|at|by|with|bought from)\s+([A-Z][A-Za-z0-9&.\s'-]{2,25}?)(?=\s+(?:for|on|in|order|yesterday|ago|\.|\,|$))/);
  if (fromMatch && fromMatch[1].trim().length > 2) {
    merchantName = fromMatch[1].trim();
  } else {
    // Look for common merchant names or capitalize
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      if (['amazon', 'currys', 'apple', 'asos', 'zara', 'argos', 'soundpro', 'ryanair', 'easyjet', 'deliveroo', 'uber'].includes(words[i].toLowerCase())) {
        merchantName = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        break;
      }
    }
  }

  // 5. Extract Days Ago / Dates
  const today = new Date();
  let incidentDate = today.toISOString().split('T')[0];
  const daysAgoMatch = text.match(/(\d+)\s+days?\s+ago/i);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1], 10);
    const incidentDateObj = new Date();
    incidentDateObj.setDate(incidentDateObj.getDate() - daysAgo);
    incidentDate = incidentDateObj.toISOString().split('T')[0];
  }

  // 6. Statutory Deadlines & Regulations
  let statutoryDeadlineDays = 14; // Default under Consumer Contracts Regulations for refunds
  if (category === 'damaged_goods') {
    statutoryDeadlineDays = 30; // 30-day right to reject in UK CRA 2015
  } else if (category === 'flight_cancellation') {
    statutoryDeadlineDays = 7; // UK261 / EU261 7-day refund requirement
  }

  // Generate Title
  const title = generateTitle(category, merchantName, claimAmount, currency);

  // Suggested Timeline Events
  const suggestedTimeline: TimelineEvent[] = [
    {
      id: `evt-${Date.now()}-1`,
      date: incidentDate,
      title: getInitialEventTitle(category),
      description: text.slice(0, 160) + (text.length > 160 ? '...' : ''),
      category: category === 'delayed_refund' ? 'return' : category === 'damaged_goods' ? 'delivery' : 'purchase'
    },
    {
      id: `evt-${Date.now()}-2`,
      date: addDays(incidentDate, statutoryDeadlineDays),
      title: `Statutory Window Expiration (${statutoryDeadlineDays} Days)`,
      description: `Maximum legal window under ${getLegalFramework(category, jurisdiction)} for resolution without escalation.`,
      category: 'statutory_deadline',
      isStatutoryNotice: true
    }
  ];

  // Suggested Action Steps
  const suggestedActionSteps: ActionStep[] = generateActionSteps(category, jurisdiction);

  return {
    title,
    merchantName,
    claimAmount,
    currency,
    category,
    orderNumber,
    incidentDate,
    statutoryDeadlineDays,
    suggestedTimeline,
    suggestedActionSteps
  };
}

function generateTitle(category: CaseCategory, merchant: string, amount: number, currency: string): string {
  const priceStr = amount > 0 ? ` (${currency}${amount.toFixed(2)})` : '';
  switch (category) {
    case 'delayed_refund':
      return `Unprocessed Refund from ${merchant}${priceStr}`;
    case 'damaged_goods':
      return `Damaged Delivery Dispute with ${merchant}${priceStr}`;
    case 'subscription_charge':
      return `Unauthorized Recurring Billing from ${merchant}${priceStr}`;
    case 'flight_cancellation':
      return `Flight Compensation / Refund from ${merchant}${priceStr}`;
    case 'lost_delivery':
      return `Non-Delivery / Lost Parcel from ${merchant}${priceStr}`;
    default:
      return `Consumer Dispute with ${merchant}${priceStr}`;
  }
}

function getInitialEventTitle(category: CaseCategory): string {
  switch (category) {
    case 'delayed_refund':
      return 'Item Returned / Return Drop-off Recorded';
    case 'damaged_goods':
      return 'Damaged Parcel Delivered & Inspected';
    case 'subscription_charge':
      return 'Cancellation Requested / Billed in Error';
    case 'flight_cancellation':
      return 'Flight Canceled / Re-routing Refused';
    default:
      return 'Initial Purchase & Issue Reported';
  }
}

export function getLegalFramework(category: CaseCategory, jurisdiction: Jurisdiction): string {
  if (jurisdiction === 'IN') {
    if (category === 'delayed_refund') return 'Rule 5 Consumer Protection (E-Commerce) Rules 2020';
    if (category === 'damaged_goods') return 'Section 86 Consumer Protection Act 2019 (Product Liability)';
    if (category === 'flight_cancellation') return 'DGCA Passenger Charter & Supreme Court Guidelines';
    if (category === 'unresponsive_service') return 'RBI Failed Electronic Transactions Circular (T+1 Rule)';
    return 'Consumer Protection Act, 2019 (CPA 2019)';
  } else if (jurisdiction === 'UK') {
    if (category === 'delayed_refund') return 'Consumer Contracts Regulations 2013 (14-day rule)';
    if (category === 'damaged_goods') return 'Consumer Rights Act 2015 (30-day short-term right to reject)';
    if (category === 'flight_cancellation') return 'UK261 Air Passenger Rights';
    return 'Consumer Rights Act 2015';
  } else if (jurisdiction === 'US') {
    if (category === 'delayed_refund' || category === 'lost_delivery') return 'FTC Mail, Internet, or Telephone Order Merchandise Rule';
    if (category === 'subscription_charge') return 'Restore Online Shoppers Confidence Act (ROSCA)';
    return 'Federal Trade Commission Act / Fair Credit Billing Act';
  }
  return 'EU Consumer Rights Directive 2011/83/EU';
}

function generateActionSteps(_category: CaseCategory, jurisdiction: Jurisdiction): ActionStep[] {
  const steps: ActionStep[] = [
    {
      id: `step-1`,
      title: 'Consolidate proof & tracking receipts',
      description: 'Ensure postal tracking number, drop-off receipt, and photos of packaging are attached to this case.',
      isCompleted: true
    },
    {
      id: `step-2`,
      title: 'Send Formal Statutory Letter',
      description: `Issue a written formal claim citing your statutory rights under ${jurisdiction === 'UK' ? 'Consumer Contracts Regs / CRA 2015' : 'Consumer Protection Regulations'}.`,
      isCompleted: false,
      recommendedTemplateId: 'statutory_notice'
    },
    {
      id: `step-3`,
      title: 'Calendar 7-day compliance window',
      description: 'Allow standard 7 calendar days for customer service escalation before initiating financial deadlock.',
      isCompleted: false
    },
    {
      id: `step-4`,
      title: 'Request Letter of Deadlock / Escalate to Bank',
      description: jurisdiction === 'UK'
        ? 'If unpaid after deadline, initiate Section 75 claim (credit card > £100) or Visa/Mastercard Chargeback.'
        : 'File a Fair Credit Billing dispute / Chargeback with your credit card provider.',
      isCompleted: false,
      isEscalationStep: true,
      recommendedTemplateId: 'bank_chargeback'
    },
    {
      id: `step-5`,
      title: 'Lodge dispute with Official Ombudsman / Regulatory Body',
      description: jurisdiction === 'UK'
        ? 'Submit formal complaint to RetailADR, Financial Ombudsman (FOS), or Citizens Advice.'
        : 'Submit complaint to the CFPB (Consumer Financial Protection Bureau) or State AG.',
      isCompleted: false,
      isEscalationStep: true,
      officialResourceId: jurisdiction === 'UK' ? 'uk-retail-adr' : 'us-cfpb'
    }
  ];

  return steps;
}
