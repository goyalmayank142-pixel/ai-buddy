import { LetterTemplate } from '../types/case';

export const LETTER_TEMPLATES: LetterTemplate[] = [
  // India Statutory Templates
  {
    id: 'in_grievance_notice',
    title: 'Grievance Officer Notice (Consumer Protection Rules 2020)',
    stage: 'statutory_notice',
    jurisdiction: 'IN',
    description: 'Mandatory formal grievance to company Resident Grievance Officer under E-Commerce Rules 2020 with 48h acknowledgment requirement.',
    legalBasis: 'Rule 5 Consumer Protection (E-Commerce) Rules 2020 & Section 2(11) Consumer Protection Act 2019',
    subjectTemplate: 'FORMAL STATUTORY NOTICE: Deficiency of Service regarding Order #[ORDER_NUMBER] - [MERCHANT_NAME]',
    bodyTemplate: `To: The Resident Grievance Officer, [MERCHANT_NAME]
Pursuant to Consumer Protection (E-Commerce) Rules, 2020 & Consumer Protection Act, 2019

Sir/Madam,

I am issuing this formal statutory notice regarding an unaddressed consumer grievance:
- Aggrieved Complainant: [YOUR_NAME]
- Mobile Number: [YOUR_PHONE]
- Order Reference / Transaction ID: #[ORDER_NUMBER]
- Date of Transaction / Incident: [INCIDENT_DATE]
- Total Disputed Sum: [CLAIM_AMOUNT]

STATEMENT OF FACTS:
On [INCIDENT_DATE], I transacted with [MERCHANT_NAME] for [CLAIM_AMOUNT]. Despite subsequent representations and the passage of [ELAPSED_DAYS] days, your customer service has failed to provide a refund or remedy the defect, providing only automated or generic responses.

STATUTORY BREACHES:
1. "Deficiency in Service" under Section 2(11) of the Consumer Protection Act, 2019.
2. "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.
3. Under Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020, every e-commerce entity is mandated to acknowledge grievances within 48 hours and effect complete redressing within one month.

FINAL DEMAND:
You are hereby called upon to immediately credit the full refund of [CLAIM_AMOUNT] to my source account within forty-eight (48) hours of this notice.

Should you fail to comply within 48 hours, I shall proceed to lodge an official docket on the National Consumer Helpline (NCH - 1915), file an e-petition on E-Daakhil before the District Consumer Commission seeking compensation for mental harassment, and notify the Central Consumer Protection Authority (CCPA).

Yours faithfully,
[YOUR_NAME]
Mobile: [YOUR_PHONE]`
  },
  {
    id: 'in_rbi_upi',
    title: 'RBI Failed UPI & Banking Reversal Claim',
    stage: 'bank_chargeback',
    jurisdiction: 'IN',
    description: 'Formal escalation for debited but un-credited UPI / IMPS transactions under RBI Harmonisation of TAT circular.',
    legalBasis: 'RBI Circular DPSS.CO.PD No.629/02.01.014/2019-20 (Turn Around Time & Customer Compensation for Failed Transactions)',
    subjectTemplate: 'URGENT: Failed UPI Dispute & Claim for ₹100/day Compensation - Ref #[ORDER_NUMBER]',
    bodyTemplate: `To: Principal Nodal Officer & Disputes Department, [YOUR_BANK_NAME]

RE: UNREVERSED FAILED UPI TRANSACTION / SECTION 8 RBI OMBUDSMAN CLAIM
Account Holder: [YOUR_NAME]
Mobile Number: [YOUR_PHONE]
UPI / UTR Reference: #[ORDER_NUMBER]
Merchant / Beneficiary: [MERCHANT_NAME]
Debited Amount: [CLAIM_AMOUNT]
Date of Debit: [INCIDENT_DATE]

Dear Sir/Madam,

On [INCIDENT_DATE], an amount of [CLAIM_AMOUNT] was debited from my account for a UPI transaction that failed at the beneficiary / merchant terminal ([MERCHANT_NAME]). 

It has been [ELAPSED_DAYS] business days since the debit occurred. Under the Reserve Bank of India (RBI) circular on "Harmonisation of Turn Around Time (TAT) and customer compensation for failed transactions using authorised Payment Systems" (DPSS.CO.PD No.629/02.01.014/2019-20):
1. The timeline for auto-reversal of failed UPI transactions is T + 1 business day.
2. Any delay beyond T + 1 business day mandates a penalty compensation payable to the customer of ₹100 per calendar day of delay.

I request you to immediately:
1. Re-credit the principal disputed sum of [CLAIM_AMOUNT] to my account.
2. Calculate and credit the statutory penalty of ₹100/day for the [ELAPSED_DAYS] days of delay as mandated by the RBI.

Failing resolution within 48 hours, I am escalating this complaint directly to the RBI Banking Ombudsman on the CMS portal (cms.rbi.org.in).

Yours sincerely,
[YOUR_NAME]
[YOUR_PHONE]`
  },
  {
    id: 'statutory_notice',
    title: 'Statutory Demand: Breach of Refund Window (UK/Intl)',
    stage: 'statutory_notice',
    jurisdiction: 'UK',
    description: 'Formal legal notice citing the Consumer Contracts Regulations 2013 Regulation 34(5) (14-day statutory refund limit).',
    legalBasis: 'Regulation 34(5) Consumer Contracts Regulations 2013 & Consumer Rights Act 2015',
    subjectTemplate: 'FORMAL NOTICE: Overdue Refund under Consumer Contracts Regulations - Order #[ORDER_NUMBER]',
    bodyTemplate: `Dear Customer Relations Manager, [MERCHANT_NAME],

RE: STATUTORY NOTICE OF OVERDUE REFUND
Order Reference: #[ORDER_NUMBER]
Amount Outstanding: [CLAIM_AMOUNT]
Date of Return / Dispatch Proof: [INCIDENT_DATE]

I am writing to issue formal notice regarding the outstanding refund for Order #[ORDER_NUMBER]. 

Under statutory consumer regulations, a trader must reimburse all payments received from the consumer without undue delay. As [ELAPSED_DAYS] days have now elapsed, [MERCHANT_NAME] is currently in breach of statutory obligations.

Please process the full reimbursement of [CLAIM_AMOUNT] within 5 business days of this letter.

Yours sincerely,
[YOUR_NAME]
[YOUR_EMAIL] | [YOUR_PHONE]`
  },
  {
    id: 'deadlock_lba',
    title: 'Letter Before Action (LBA) / Consumer Court Warning',
    stage: 'deadlock_lba',
    jurisdiction: 'IN',
    description: 'Final pre-litigation warning letter before filing on E-Daakhil / Small Claims.',
    legalBasis: 'Section 35 Consumer Protection Act, 2019',
    subjectTemplate: 'LEGAL NOTICE BEFORE ACTION - Order #[ORDER_NUMBER] - [MERCHANT_NAME]',
    bodyTemplate: `WITHOUT PREJUDICE

To: The Management & Directors, [MERCHANT_NAME]

RE: FINAL NOTICE PRIOR TO CONSUMER COMMISSION PETITION (E-DAAKHIL)
Disputed Transaction Ref: #[ORDER_NUMBER]
Total Sum Demanded: [CLAIM_AMOUNT]

Despite previous communications since [INCIDENT_DATE], you have neglected and refused to refund the sum of [CLAIM_AMOUNT].

TAKE FINAL NOTICE:
If full reimbursement of [CLAIM_AMOUNT] is not credited within seven (7) days of this communication, I will initiate legal proceedings before the District Consumer Disputes Redressal Commission on the official E-Daakhil portal. In said petition, I will claim:
1. The principal refund amount of [CLAIM_AMOUNT].
2. Compensation of ₹25,000 for mental agony, harassment, and gross deficiency in service.
3. Litigation expenses and legal costs.

Treat this as an urgent formal pre-action notice.

Yours faithfully,
[YOUR_NAME]
[YOUR_PHONE]`
  }
];
