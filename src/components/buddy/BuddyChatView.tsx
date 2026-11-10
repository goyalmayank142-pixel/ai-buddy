import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Image as ImageIcon, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';
import { ChatMessageBubble } from './ChatMessageBubble';
import { BuddyMessage } from '../../types/buddy';
import {
  getBuddyChatReply,
  speakBuddyVoice,
  stopBuddyVoice,
  analyzeImageWithBuddy
} from '../../services/aiBuddyService';

interface BuddyChatViewProps {
  initialPrompt?: string;
  onBack: () => void;
  onOpenCamera: () => void;
}

export const BuddyChatView: React.FC<BuddyChatViewProps> = ({
  initialPrompt,
  onBack,
  onOpenCamera,
}) => {
  const [messages, setMessages] = useState<BuddyMessage[]>([
    {
      id: 'welcome',
      sender: 'buddy',
      text: "Hey friend! I'm Buddy, your everyday AI companion. Whether your electric kettle is acting up, a pipe is dripping, or you just want to show me your flower pot — I'm right here with you! What's on your mind today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'See this is my flower pot!',
        'My kettle stopped heating',
        'Water pipe is leaking under sink',
        'I had a long day, let\'s chat'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: BuddyMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const reply = await getBuddyChatReply(text);
      const isFlower = text.toLowerCase().includes('flower') || text.toLowerCase().includes('pot');
      const isKettle = text.toLowerCase().includes('kettle');
      const isPipe = text.toLowerCase().includes('pipe') || text.toLowerCase().includes('leak');

      const buddyMsg: BuddyMessage = {
        id: `buddy-${Date.now()}`,
        sender: 'buddy',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTip: isKettle
          ? 'Unplug the kettle base, check the bronze pins, and descale with 50% white vinegar!'
          : isPipe
          ? 'Turn off the water isolation valve under the sink clockwise immediately.'
          : isFlower
          ? 'Give it 4 hours of morning sunlight and keep the topsoil lightly moist.'
          : undefined,
        suggestedFollowUps: isKettle
          ? ['How do I test the fuse?', 'Can I boil vinegar directly?']
          : isPipe
          ? ['Where is the main valve?', 'How do I wrap Teflon tape?']
          : isFlower
          ? ['What about fertilizer?', 'Why are leaf tips yellow?']
          : ['Tell me more', 'Help me fix something else']
      };

      setMessages((prev) => [...prev, buddyMsg]);

      if (voiceEnabled) {
        setIsSpeaking(true);
        speakBuddyVoice(reply, () => setIsSpeaking(false));
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;
      const userMsg: BuddyMessage = {
        id: `user-img-${Date.now()}`,
        sender: 'user',
        text: 'Look at this photo, buddy!',
        imageUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 400, 400);
          const result = await analyzeImageWithBuddy(canvas, 'Look at this photo');
          const buddyMsg: BuddyMessage = {
            id: `buddy-analysis-${Date.now()}`,
            sender: 'buddy',
            text: result.reply,
            detectedColor: result.detectedColor,
            actionTip: result.actionTip,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedFollowUps: result.followUpSuggestions
          };
          setMessages((prev) => [...prev, buddyMsg]);
          if (voiceEnabled) {
            setIsSpeaking(true);
            speakBuddyVoice(result.reply, () => setIsSpeaking(false));
          }
          setIsTyping(false);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const playSingleMessageVoice = (text: string) => {
    stopBuddyVoice();
    setIsSpeaking(true);
    speakBuddyVoice(text, () => setIsSpeaking(false));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fbf8f3] text-slate-800 h-full overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3 bg-white/90 backdrop-blur-md border-b border-[#ede3d5] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <BuddyAvatar
              mood={isTyping ? 'thinking' : isSpeaking ? 'excited' : 'happy'}
              size="sm"
              isSpeaking={isSpeaking}
            />
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-none">AI Buddy</h3>
              <span className="text-[10px] text-emerald-600 font-medium">● Always Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (voiceEnabled) stopBuddyVoice();
              setVoiceEnabled(!voiceEnabled);
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-orange-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onOpenCamera}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            onPlayVoice={playSingleMessageVoice}
            onSelectFollowUp={(pill) => handleSendMessage(pill)}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-3 py-2 rounded-full border border-slate-200 w-fit">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="text-[10px] font-medium text-slate-500">Buddy is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-[#ede3d5] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenCamera}
            className="p-2 rounded-full text-orange-600 hover:bg-orange-50"
          >
            <Camera className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Ask: "Look at my kettle", "Check flower pot"...'
            className="flex-1 bg-slate-50 text-xs text-slate-900 px-3.5 py-2.5 rounded-full border border-slate-200 focus:outline-hidden focus:border-orange-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-slate-900 disabled:opacity-40 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
