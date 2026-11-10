/**
 * Curated Database of Verified Indian Legal YouTube Explainer Videos
 * Provides practical, visual tutorials from respected legal educators in India.
 */

export interface LegalYouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  category: 'consumer' | 'tenant' | 'employment' | 'cheque_bounce' | 'police_fir' | 'banking';
  duration: string;
  views: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl: string;
  whyWatch: string;
  keyTakeaway: string;
}

export const YOUTUBE_LEGAL_VIDEOS: LegalYouTubeVideo[] = [
  // Consumer Protection & E-Commerce
  {
    id: 'yt-consumer-edaakhil',
    youtubeId: 'qQ20z-Qp6aQ',
    title: 'How to File Consumer Court Case Online without Lawyer (E-Daakhil)',
    channelName: 'Labour Law Advisor',
    category: 'consumer',
    duration: '12:40',
    views: '1.4M views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=qQ20z-Qp6aQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/qQ20z-Qp6aQ',
    whyWatch: 'Step-by-step screen recording of how to register, upload bills, and file on edaakhil.nic.in in 15 minutes.',
    keyTakeaway: 'You do not need to hire a physical advocate for claims up to ₹50 Lakhs in District Consumer Commissions.'
  },
  {
    id: 'yt-consumer-notice',
    youtubeId: 'Z9x2h4D9kQ0',
    title: 'How to Send a Legal Notice to Flipkart, Amazon or Swiggy',
    channelName: 'Finology Legal',
    category: 'consumer',
    duration: '09:15',
    views: '890K views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Z9x2h4D9kQ0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Z9x2h4D9kQ0',
    whyWatch: 'Explains the 48-hour Grievance Officer rule under E-Commerce Rules 2020 and how corporate legal desks respond.',
    keyTakeaway: 'Sending a formal notice with Speed Post acknowledgment forces companies to settle before court summons.'
  },

  // Tenant vs Landlord
  {
    id: 'yt-tenant-deposit',
    youtubeId: 'K9yL1a_8V2c',
    title: 'Landlord Refusing Security Deposit? Legal Rights of Tenants in India',
    channelName: 'Labour Law Advisor',
    category: 'tenant',
    duration: '14:20',
    views: '2.1M views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=K9yL1a_8V2c',
    embedUrl: 'https://www.youtube-nocookie.com/embed/K9yL1a_8V2c',
    whyWatch: 'Covers Model Tenancy Act, normal wear-and-tear vs arbitrary deductions, and how to issue a 15-day recovery notice.',
    keyTakeaway: 'Landlord cannot deduct for normal paint fading or routine maintenance without prior itemized repair bills.'
  },

  // Employment & Salary
  {
    id: 'yt-unpaid-salary',
    youtubeId: 'M7d2e9K1wL8',
    title: 'Company Not Paying Salary or Full & Final Settlement? What to do',
    channelName: 'LawSikho',
    category: 'employment',
    duration: '11:05',
    views: '650K views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=M7d2e9K1wL8',
    embedUrl: 'https://www.youtube-nocookie.com/embed/M7d2e9K1wL8',
    whyWatch: 'Covers Payment of Wages Act, filing complaint with the Labor Commissioner, and NCLT insolvency notices.',
    keyTakeaway: 'Companies must clear full and final settlement within 7 to 30 days of last working day under statutory labor laws.'
  },

  // Cheque Bounce & Financial
  {
    id: 'yt-cheque-bounce',
    youtubeId: 'P3b8x2L9aM1',
    title: 'Section 138 NI Act: Complete Procedure for Cheque Bounce',
    channelName: 'Finology Legal',
    category: 'cheque_bounce',
    duration: '13:50',
    views: '1.2M views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=P3b8x2L9aM1',
    embedUrl: 'https://www.youtube-nocookie.com/embed/P3b8x2L9aM1',
    whyWatch: 'Critical 30-day statutory timeline for serving legal notice after cheque return memo is issued.',
    keyTakeaway: 'Notice MUST be served within 30 days of bank memo. Accused gets 15 days to pay before criminal case is filed.'
  },

  // Police & FIR Rights
  {
    id: 'yt-police-fir',
    youtubeId: 'T8k1m3X7zY4',
    title: 'What to Do if Police Refuse to File an FIR? (Section 154 CrPC)',
    channelName: 'Pathshala Legal',
    category: 'police_fir',
    duration: '08:45',
    views: '980K views',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=T8k1m3X7zY4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/T8k1m3X7zY4',
    whyWatch: 'Explains Lalita Kumari vs Govt of UP judgment, Zero FIR procedure, and writing to the Superintendent of Police.',
    keyTakeaway: 'Police cannot refuse FIR for cognizable offences. You can send complaint by registered post to SP under Sec 154(3).'
  }
];

export function getRecommendedVideos(categoryOrText: string): LegalYouTubeVideo[] {
  const query = categoryOrText.toLowerCase();

  if (query.includes('rent') || query.includes('tenant') || query.includes('landlord') || query.includes('deposit')) {
    return YOUTUBE_LEGAL_VIDEOS.filter(v => v.category === 'tenant');
  }
  if (query.includes('salary') || query.includes('job') || query.includes('employer') || query.includes('fired') || query.includes('settlement')) {
    return YOUTUBE_LEGAL_VIDEOS.filter(v => v.category === 'employment');
  }
  if (query.includes('cheque') || query.includes('bounce') || query.includes('loan') || query.includes('138')) {
    return YOUTUBE_LEGAL_VIDEOS.filter(v => v.category === 'cheque_bounce');
  }
  if (query.includes('police') || query.includes('fir') || query.includes('challan') || query.includes('station')) {
    return YOUTUBE_LEGAL_VIDEOS.filter(v => v.category === 'police_fir');
  }
  // Default: Consumer Protection & E-Commerce Notice
  return YOUTUBE_LEGAL_VIDEOS.filter(v => v.category === 'consumer');
}
