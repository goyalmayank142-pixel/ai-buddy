export type CaseCategory =
  | 'delayed_refund'
  | 'damaged_goods'
  | 'unresponsive_service'
  | 'subscription_charge'
  | 'lost_delivery'
  | 'flight_cancellation'
  | 'other';

export type CaseStatus =
  | 'evidence_gathering'
  | 'notice_sent'
  | 'follow_up_due'
  | 'deadlock'
  | 'bank_chargeback'
  | 'ombudsman_escalated'
  | 'resolved';

export type Jurisdiction = 'IN' | 'UK' | 'US' | 'EU';

export interface EvidenceItem {
  id: string;
  name: string;
  type: 'receipt' | 'photo' | 'screenshot' | 'email' | 'tracking' | 'other';
  fileUrl?: string;
  description: string;
  uploadedAt: string;
  fileSize?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'purchase' | 'delivery' | 'return' | 'communication' | 'statutory_deadline' | 'escalation' | 'resolution';
  isStatutoryNotice?: boolean;
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  isCompleted: boolean;
  isEscalationStep?: boolean;
  recommendedTemplateId?: string;
  officialResourceId?: string;
}

export interface DisputeCase {
  id: string;
  title: string;
  merchantName: string;
  claimAmount: number;
  currency: string;
  category: CaseCategory;
  status: CaseStatus;
  jurisdiction: Jurisdiction;
  createdAt: string;
  updatedAt: string;
  initialNarrative: string;
  orderNumber?: string;
  purchaseDate?: string;
  incidentDate?: string;
  statutoryDeadlineDays?: number; // e.g. 14 days for refund in UK
  statutoryDeadlineDate?: string;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  actionSteps: ActionStep[];
  notes?: string;
}

export interface OfficialResource {
  id: string;
  name: string;
  jurisdiction: Jurisdiction;
  sector: 'general' | 'financial' | 'retail' | 'travel' | 'telecom' | 'energy';
  description: string;
  website: string;
  phone?: string;
  whenToContact: string;
  typicalWaitDays?: string;
  tags: string[];
}

export interface LetterTemplate {
  id: string;
  title: string;
  stage: 'initial_nudge' | 'statutory_notice' | 'deadlock_lba' | 'bank_chargeback';
  jurisdiction: Jurisdiction;
  description: string;
  legalBasis: string;
  subjectTemplate: string;
  bodyTemplate: string;
}
