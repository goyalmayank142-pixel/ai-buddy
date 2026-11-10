/**
 * Verified Indian Grievance Officers Directory
 * Under Rule 5 of the Consumer Protection (E-Commerce) Rules, 2020,
 * every e-commerce and digital entity operating in India must designate
 * a Resident Grievance Officer and acknowledge complaints within 48 hours.
 */

export interface GrievanceOfficerContact {
  id: string;
  brandName: string;
  legalEntityName: string;
  sector: 'ecommerce' | 'food_delivery' | 'quick_commerce' | 'fintech' | 'banking' | 'aviation' | 'telecom';
  grievanceEmail: string;
  grievanceOfficerName?: string;
  portalUrl?: string;
  registeredOffice: string;
  statutoryTurnaroundHours: number; // 48 hours standard
}

export const INDIAN_GRIEVANCE_OFFICERS: GrievanceOfficerContact[] = [
  // E-Commerce
  {
    id: 'flipkart',
    brandName: 'Flipkart',
    legalEntityName: 'Flipkart Internet Private Limited',
    sector: 'ecommerce',
    grievanceEmail: 'grievance.officer@flipkart.com',
    grievanceOfficerName: 'Resident Grievance Officer, Flipkart',
    portalUrl: 'https://www.flipkart.com/helpcentre',
    registeredOffice: 'Buildings Alyssa, Begonia & Clover, Embassy Tech Village, Outer Ring Road, Devarabeesanahalli, Bengaluru 560103, Karnataka',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'amazon-in',
    brandName: 'Amazon India',
    legalEntityName: 'Amazon Seller Services Private Limited',
    sector: 'ecommerce',
    grievanceEmail: 'grievance-officer@amazon.in',
    grievanceOfficerName: 'Grievance Officer, ASSPL',
    portalUrl: 'https://www.amazon.in/gp/help/customer/display.html',
    registeredOffice: 'Block E, 8th Floor, Brigade Tech Gardens, Kundalahalli, Bengaluru 560037, Karnataka',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'meesho',
    brandName: 'Meesho',
    legalEntityName: 'Fashnear Technologies Private Limited',
    sector: 'ecommerce',
    grievanceEmail: 'grievanceofficer@meesho.com',
    grievanceOfficerName: 'Resident Grievance Officer, Meesho',
    portalUrl: 'https://www.meesho.com/legal/grievance',
    registeredOffice: '3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli, Bengaluru 560103, Karnataka',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'myntra',
    brandName: 'Myntra',
    legalEntityName: 'Myntra Designs Private Limited',
    sector: 'ecommerce',
    grievanceEmail: 'grievance@myntra.com',
    grievanceOfficerName: 'Nodal Officer, Myntra',
    registeredOffice: 'AKR Tech Park, 7th Mile, Kudlu Gate, Krishna Reddy Industrial Area, Bengaluru 560068, Karnataka',
    statutoryTurnaroundHours: 48
  },

  // Food Delivery & Quick Commerce
  {
    id: 'swiggy',
    brandName: 'Swiggy',
    legalEntityName: 'Bundl Technologies Private Limited',
    sector: 'food_delivery',
    grievanceEmail: 'grievances@swiggy.in',
    grievanceOfficerName: 'Resident Grievance Officer, Swiggy',
    portalUrl: 'https://www.swiggy.com/grievance',
    registeredOffice: 'Tower D, 9th Floor, IBC Knowledge Park, Bannerghatta Road, Bengaluru 560029, Karnataka',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'zomato',
    brandName: 'Zomato',
    legalEntityName: 'Zomato Limited',
    sector: 'food_delivery',
    grievanceEmail: 'grievanceofficer@zomato.com',
    grievanceOfficerName: 'Nodal Grievance Officer, Zomato',
    portalUrl: 'https://www.zomato.com/contact',
    registeredOffice: 'Ground Floor, 12A, 94 Meghdoot, Nehru Place, New Delhi 110019',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'blinkit',
    brandName: 'Blinkit',
    legalEntityName: 'Blink Commerce Private Limited',
    sector: 'quick_commerce',
    grievanceEmail: 'grievanceofficer@blinkit.com',
    grievanceOfficerName: 'Grievance Redressal Officer, Blinkit',
    registeredOffice: 'Ground Floor, Tower A, Pioneer Urban Square, Golf Course Extension Road, Sector 62, Gurugram 122098, Haryana',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'zepto',
    brandName: 'Zepto',
    legalEntityName: 'KiranaKart Technologies Private Limited',
    sector: 'quick_commerce',
    grievanceEmail: 'grievanceofficer@zeptonow.com',
    grievanceOfficerName: 'Nodal Officer, Zepto',
    registeredOffice: '101, 1st Floor, Trade World, C Wing, Kamala City, Senapati Bapat Marg, Lower Parel, Mumbai 400013, Maharashtra',
    statutoryTurnaroundHours: 48
  },

  // Fintech & UPI
  {
    id: 'phonepe',
    brandName: 'PhonePe',
    legalEntityName: 'PhonePe Private Limited',
    sector: 'fintech',
    grievanceEmail: 'grievance-officer@phonepe.com',
    grievanceOfficerName: 'Principal Nodal Officer, PhonePe',
    portalUrl: 'https://www.phonepe.com/grievance-policy/',
    registeredOffice: 'Office-2, Floor 4,5,6,7, Wing A, Block A, Salarpuria Softzone, Bellandur Village, Varthur Hobli, Bengaluru 560103, Karnataka',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'googlepay',
    brandName: 'Google Pay',
    legalEntityName: 'Google India Digital Services Private Limited',
    sector: 'fintech',
    grievanceEmail: 'support-in@google.com',
    grievanceOfficerName: 'Grievance Officer, Google Pay India',
    portalUrl: 'https://support.google.com/pay/india',
    registeredOffice: 'Unit 1, 1st Floor, Divyasree Omega, Survey No 13, Kondapur Village, Hyderabad 500084, Telangana',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'paytm',
    brandName: 'Paytm',
    legalEntityName: 'One97 Communications Limited',
    sector: 'fintech',
    grievanceEmail: 'nodal@paytm.com',
    grievanceOfficerName: 'Grievance Redressal Officer, Paytm',
    portalUrl: 'https://paytm.com/care/ticket',
    registeredOffice: 'First Floor, Devika Tower, Nehru Place, New Delhi 110019',
    statutoryTurnaroundHours: 48
  },

  // Banking
  {
    id: 'sbi',
    brandName: 'SBI (State Bank of India)',
    legalEntityName: 'State Bank of India',
    sector: 'banking',
    grievanceEmail: 'nodalofficer@sbi.co.in',
    grievanceOfficerName: 'Principal Nodal Officer, Customer Service Dept',
    portalUrl: 'https://crcf.sbi.co.in/ccf/',
    registeredOffice: 'State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai 400021, Maharashtra',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'hdfc-bank',
    brandName: 'HDFC Bank',
    legalEntityName: 'HDFC Bank Limited',
    sector: 'banking',
    grievanceEmail: 'grievance.redressal@hdfcbank.com',
    grievanceOfficerName: 'Principal Nodal Officer, HDFC Bank',
    portalUrl: 'https://www.hdfcbank.com/personal/useful-links/grievance-redressal-portal',
    registeredOffice: 'HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013, Maharashtra',
    statutoryTurnaroundHours: 48
  },

  // Aviation
  {
    id: 'indigo',
    brandName: 'IndiGo',
    legalEntityName: 'InterGlobe Aviation Limited',
    sector: 'aviation',
    grievanceEmail: 'nodalofficer@goindigo.in',
    grievanceOfficerName: 'Nodal Officer, IndiGo Customer Experience',
    portalUrl: 'https://www.goindigo.in/contact-us.html',
    registeredOffice: 'Upper Ground Floor, Thapar House, Gate No. 2, Western Wing, 124 Janpath, New Delhi 110001',
    statutoryTurnaroundHours: 48
  },
  {
    id: 'air-india',
    brandName: 'Air India',
    legalEntityName: 'Air India Limited (Tata Group)',
    sector: 'aviation',
    grievanceEmail: 'nodalofficer@airindia.com',
    grievanceOfficerName: 'Nodal Officer, Passenger Grievance',
    registeredOffice: 'Block 4, Vatika One On One, Sector 16, NH 48, Gurugram 122007, Haryana',
    statutoryTurnaroundHours: 48
  }
];

export function findGrievanceOfficer(merchantOrBrand: string): GrievanceOfficerContact | undefined {
  const query = merchantOrBrand.toLowerCase();
  return INDIAN_GRIEVANCE_OFFICERS.find(o => 
    query.includes(o.brandName.toLowerCase()) || 
    query.includes(o.id.toLowerCase()) ||
    o.legalEntityName.toLowerCase().includes(query)
  );
}
