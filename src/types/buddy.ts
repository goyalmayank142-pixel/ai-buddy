export type BuddyMood = 'happy' | 'thinking' | 'excited' | 'caring' | 'helpful';

export type HelpCategory = 'vision_look' | 'fix_appliance' | 'home_plumbing' | 'plants_nature' | 'friendly_chat';

export interface BuddyMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  timestamp: string;
  imageUrl?: string;
  detectedColor?: string;
  actionTip?: string;
  suggestedFollowUps?: string[];
}

export interface EverydayGuide {
  id: string;
  title: string;
  category: HelpCategory;
  emoji: string;
  prompt: string;
  quickAdvice: string;
}
