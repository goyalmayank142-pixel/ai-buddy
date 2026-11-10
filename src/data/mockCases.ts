import { DisputeCase } from '../types/case';
import { addDays } from '../utils/dateUtils';

const today = new Date();
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fourDaysAgoStr = fourDaysAgo.toISOString().split('T')[0];

const sixDaysAgo = new Date(today);
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
const sixDaysAgoStr = sixDaysAgo.toISOString().split('T')[0];

const deadlineDate = addDays(fourDaysAgoStr, 2); // 48-hour grievance officer compliance window

export const INITIAL_MOCK_CASES: DisputeCase[] = [
  {
    id: 'case-demo-flipkart',
    title: 'Defective boAt Headphones Delivered — Return Rejected by Flipkart',
    merchantName: 'Flipkart Internet Pvt Ltd',
    claimAmount: 1499.00,
    currency: '₹',
    category: 'damaged_goods',
    status: 'follow_up_due',
    jurisdiction: 'IN',
    createdAt: fourDaysAgoStr,
    updatedAt: today.toISOString().split('T')[0],
    orderNumber: 'OD129948210492',
    purchaseDate: sixDaysAgoStr,
    incidentDate: fourDaysAgoStr,
    statutoryDeadlineDays: 2, // 48 hours for E-Commerce Grievance Officer
    statutoryDeadlineDate: deadlineDate,
    initialNarrative: 'Ordered boAt Rockerz headphones for ₹1,499 on Flipkart. Arrived with snapped plastic headband and left ear cup dead. Applied for replacement within 24 hours, but seller rejected claiming "customer induced physical damage". Customer care bot refuses to reopen ticket.',
    evidence: [
      {
        id: 'ev-1',
        name: 'Flipkart_GST_Tax_Invoice_OD1299.pdf',
        type: 'receipt',
        description: 'Official GST invoice showing ₹1,499 paid via UPI (PhonePe)',
        uploadedAt: sixDaysAgoStr,
        fileSize: '380 KB'
      },
      {
        id: 'ev-2',
        name: 'Unboxing_Snapped_Headband_Proof.jpg',
        type: 'photo',
        description: 'Photo showing snapped plastic band inside original unopened bubble wrap',
        uploadedAt: fourDaysAgoStr,
        fileSize: '1.4 MB'
      },
      {
        id: 'ev-3',
        name: 'Chat_Support_Rejection_Screenshot.png',
        type: 'screenshot',
        description: 'Chat screenshot of Flipkart support closing ticket without human review',
        uploadedAt: fourDaysAgoStr,
        fileSize: '620 KB'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        date: sixDaysAgoStr,
        title: 'Order Placed on Flipkart App',
        description: 'Paid ₹1,499 via UPI. Expected delivery within 2 days.',
        category: 'purchase'
      },
      {
        id: 'tl-2',
        date: fourDaysAgoStr,
        title: 'Delivery Received & Defect Reported',
        description: 'Package received from Ekart logistics. Headphone band snapped. Return ticket OD1299 created.',
        category: 'delivery'
      },
      {
        id: 'tl-3',
        date: addDays(fourDaysAgoStr, 1),
        title: 'Seller Arbitrarily Rejected Return',
        description: 'Seller RetailNet rejected return without technician inspection, violating CPA 2019 Section 86.',
        category: 'communication'
      },
      {
        id: 'tl-4',
        date: deadlineDate,
        title: '48h Statutory Grievance Response Limit Expired',
        description: 'Mandatory resolution window under Rule 5 Consumer Protection (E-Commerce) Rules 2020.',
        category: 'statutory_deadline',
        isStatutoryNotice: true
      }
    ],
    actionSteps: [
      {
        id: 'as-1',
        title: 'Unboxing photos and GST invoice preserved',
        description: 'Evidence documented in local locker.',
        isCompleted: true
      },
      {
        id: 'as-2',
        title: 'Send Notice to Flipkart Grievance Officer',
        description: 'Issue formal 48-hour notice citing Rule 5 of E-Commerce Rules 2020.',
        isCompleted: false,
        recommendedTemplateId: 'in_grievance_notice'
      },
      {
        id: 'as-3',
        title: 'Lodge Grievance on National Consumer Helpline (1915)',
        description: 'Register docket on consumerhelpline.gov.in or WhatsApp 8800001915.',
        isCompleted: false,
        isEscalationStep: true,
        officialResourceId: 'in-nch'
      },
      {
        id: 'as-4',
        title: 'File E-Petition on E-Daakhil Portal',
        description: 'Submit online complaint to District Consumer Commission claiming ₹1,499 + ₹10,000 compensation.',
        isCompleted: false,
        isEscalationStep: true,
        officialResourceId: 'in-edaakhil'
      }
    ],
    notes: 'Support supervisor named Priya promised call back within 24 hours on Wednesday, but no call was received.'
  }
];
