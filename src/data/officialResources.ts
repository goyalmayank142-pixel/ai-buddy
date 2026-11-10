import { OfficialResource } from '../types/case';

export const OFFICIAL_RESOURCES: OfficialResource[] = [
  // India Consumer Bodies
  {
    id: 'in-nch',
    name: 'National Consumer Helpline (NCH / INGRAM)',
    jurisdiction: 'IN',
    sector: 'general',
    description: 'Official Department of Consumer Affairs, Govt. of India portal. Directly intervenes with partner companies (Flipkart, Amazon, Swiggy, Zomato, airlines) for fast pre-litigation resolution.',
    website: 'https://consumerhelpline.gov.in/',
    phone: '1915 (Toll-Free) or WhatsApp +91 88000 01915',
    whenToContact: 'When any e-commerce company, brand, or service provider rejects refund or ignores complaints for 48 hours.',
    typicalWaitDays: '7 to 20 days for partner brand response',
    tags: ['Govt of India', 'E-Commerce', 'Swiggy', 'Zomato', 'Flipkart', '1915']
  },
  {
    id: 'in-edaakhil',
    name: 'E-Daakhil Portal (Online Consumer Court)',
    jurisdiction: 'IN',
    sector: 'general',
    description: 'Official government portal under CPA 2019 allowing Indian citizens to file consumer court cases online before District, State, and National Consumer Commissions without physical lawyer.',
    website: 'https://edaakhil.nic.in/',
    phone: '1800-11-4000',
    whenToContact: 'When informal complaints and NCH mediation fail; seek full refund plus monetary compensation for harassment.',
    typicalWaitDays: 'Court summons issued within 21 days',
    tags: ['Consumer Court', 'CPA 2019', 'Legal Remedy', 'District Commission']
  },
  {
    id: 'in-rbi',
    name: 'RBI Banking & Digital Transactions Ombudsman (CMS)',
    jurisdiction: 'IN',
    sector: 'financial',
    description: 'Reserve Bank of India complaint portal for failed UPI payments, unauthorized ATM/card debits, and bank refusal to reverse failed transactions within T+1 days.',
    website: 'https://cms.rbi.org.in/',
    phone: '14448 (Toll-free)',
    whenToContact: 'When PhonePe, Google Pay, Paytm, or your bank does not refund failed debited UPI transfers after 48 hours.',
    typicalWaitDays: '₹100/day penalty for UPI delay beyond T+1',
    tags: ['UPI', 'PhonePe', 'Google Pay', 'RBI', 'Banking Ombudsman']
  },
  {
    id: 'in-airsewa',
    name: 'AirSewa (Ministry of Civil Aviation / DGCA)',
    jurisdiction: 'IN',
    sector: 'travel',
    description: 'Government nodal platform for passenger grievances against IndiGo, Air India, SpiceJet, and Akasa Air for flight cancellations, forced credit shells, and baggage loss.',
    website: 'https://airsewa.gov.in/',
    phone: '1800 11 0031',
    whenToContact: 'When airlines cancel flights and refuse full bank refunds or fail to pay mandatory statutory compensation.',
    typicalWaitDays: 'Airlines must resolve within 30 days',
    tags: ['DGCA', 'IndiGo', 'Air India', 'Flight Cancellations', 'Aviation']
  },

  // UK General Retail & Consumer
  {
    id: 'uk-citizens-advice',
    name: 'Citizens Advice Consumer Service',
    jurisdiction: 'UK',
    sector: 'general',
    description: 'Official UK government-backed consumer advice provider. Escalates serious rogue trader cases directly to local Trading Standards.',
    website: 'https://www.citizensadvice.org.uk/consumer/',
    phone: '0808 223 1133',
    whenToContact: 'First port of call for free legal guidance and reporting illegal trader practices.',
    typicalWaitDays: 'Immediate helpline advice',
    tags: ['Retail', 'Consumer Rights', 'Trading Standards', 'Legal Guidance']
  },
  {
    id: 'uk-retail-adr',
    name: 'RetailADR (Alternative Dispute Resolution)',
    jurisdiction: 'UK',
    sector: 'retail',
    description: 'Independent, government-approved dispute resolution scheme for consumer disputes with retail brands, online stores, and high street shops.',
    website: 'https://www.retailadr.org.uk/',
    phone: '020 3540 8063',
    whenToContact: 'When the retailer fails to resolve your refund/complaint after 8 weeks or issues a formal Letter of Deadlock.',
    typicalWaitDays: '28 - 90 days for binding adjudication',
    tags: ['Retail', 'ADR', 'Online Shopping', 'Deadlock']
  },
  {
    id: 'uk-financial-ombudsman',
    name: 'Financial Ombudsman Service (FOS)',
    jurisdiction: 'UK',
    sector: 'financial',
    description: 'Official statutory ombudsman resolving disputes between consumers and financial firms (Banks, Credit Card providers, Section 75 claims).',
    website: 'https://www.financial-ombudsman.org.uk/',
    phone: '0800 023 4567',
    whenToContact: 'When your bank refuses a Section 75 refund or Chargeback claim after 8 weeks.',
    typicalWaitDays: '60 - 120 days',
    tags: ['Banks', 'Section 75', 'Credit Cards', 'Chargeback', 'Statutory']
  },
  {
    id: 'uk-aviation-adr',
    name: 'AviationADR / CAA (Civil Aviation Authority)',
    jurisdiction: 'UK',
    sector: 'travel',
    description: 'Certified dispute body for airline compensation under UK261 (flight cancellations, delays exceeding 3 hours, lost luggage).',
    website: 'https://www.aviationadr.org.uk/',
    phone: '020 3540 8063',
    whenToContact: 'When an airline ignores or rejects statutory compensation claims after 8 weeks.',
    typicalWaitDays: '90 days',
    tags: ['Airlines', 'UK261', 'Flight Delays', 'Lost Luggage']
  },
  {
    id: 'uk-furniture-ombudsman',
    name: 'Furniture & Home Improvement Ombudsman',
    jurisdiction: 'UK',
    sector: 'retail',
    description: 'Specialist independent ombudsman for disputes regarding furniture, home installations, damaged sofas, kitchens, and bathrooms.',
    website: 'https://www.fhio.org/',
    phone: '0333 241 3209',
    whenToContact: 'When a furniture or appliance merchant refuses to replace or refund defective/damaged goods.',
    typicalWaitDays: '45 - 60 days',
    tags: ['Furniture', 'Home Goods', 'Damaged Delivery']
  },
  {
    id: 'uk-comms-ombudsman',
    name: 'Communications Ombudsman',
    jurisdiction: 'UK',
    sector: 'telecom',
    description: 'Official Ofcom-approved dispute resolver for mobile phone contracts, broadband interruptions, and billing issues.',
    website: 'https://www.commsombudsman.org/',
    phone: '0330 440 1614',
    whenToContact: 'Unresolved billing errors or service failure after 8 weeks of initial complaint.',
    typicalWaitDays: '6 to 12 weeks',
    tags: ['Broadband', 'Mobile', 'Telecom', 'Billing Errors']
  },

  // US Resources
  {
    id: 'us-cfpb',
    name: 'Consumer Financial Protection Bureau (CFPB)',
    jurisdiction: 'US',
    sector: 'financial',
    description: 'US Federal Government agency that enforces financial protection laws and mediates credit card disputes and unauthorized charges.',
    website: 'https://www.consumerfinance.gov/complaint/',
    phone: '1-855-411-2372',
    whenToContact: 'When a bank or credit card company ignores a Fair Credit Billing dispute.',
    typicalWaitDays: 'Company must respond within 15 days',
    tags: ['Federal', 'Credit Cards', 'Chargebacks', 'Banking']
  },
  {
    id: 'us-ftc',
    name: 'Federal Trade Commission (FTC)',
    jurisdiction: 'US',
    sector: 'general',
    description: 'US regulatory watchdog enforcing consumer protection, deceptive advertising laws, and the 30-Day Mail Order Rule.',
    website: 'https://reportfraud.ftc.gov/',
    phone: '1-877-382-4357',
    whenToContact: 'Report merchants failing to refund orders within 30 days or engaging in deceptive subscription billing.',
    typicalWaitDays: 'Immediate report filing',
    tags: ['Federal', 'Mail Order Rule', 'Subscription Fraud', 'Deceptive Practices']
  },
  {
    id: 'us-bbb',
    name: 'Better Business Bureau (BBB)',
    jurisdiction: 'US',
    sector: 'retail',
    description: 'Nationwide dispute resolution network connecting consumers with corporate executive resolution teams.',
    website: 'https://www.bbb.org/',
    phone: '1-703-276-0100',
    whenToContact: 'When regular merchant customer service is unresponsive; companies frequently reply within 14 days to preserve rating.',
    typicalWaitDays: '14 - 30 days',
    tags: ['Mediation', 'Customer Escalation', 'Reputation']
  },

  // EU Resources
  {
    id: 'eu-eccnet',
    name: 'European Consumer Centres Network (ECC-Net)',
    jurisdiction: 'EU',
    sector: 'general',
    description: 'EU-wide network providing free individual assistance to consumers facing cross-border disputes with EU merchants.',
    website: 'https://www.eccnet.eu/',
    phone: '+32 2 542 38 11',
    whenToContact: 'Disputes with an online shop or airline based in another EU member state.',
    typicalWaitDays: '30 - 70 days',
    tags: ['Cross-Border', 'EU Rights', '14-Day Cooling Off', 'European Law']
  }
];
