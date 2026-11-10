import React, { useState } from 'react';
import {
  Camera,
  Mic,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  Heart,
  Droplet,
  Flower2,
  Zap,
  Play
} from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';
import { BUDDY_FIX_GUIDES, BuddyFixGuide } from '../../data/buddyGuides';

interface BuddyHomeProps {
  onOpenCamera: () => void;
  onStartChat: (initialMessage?: string) => void;
  onOpenGuide: (guide: BuddyFixGuide) => void;
  onOpenSettings: () => void;
}

export const BuddyHome: React.FC<BuddyHomeProps> = ({
  onOpenCamera,
  onStartChat,
  onOpenGuide,
  onOpenSettings
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleSendQuick = () => {
    if (!quickInput.trim()) {
      onStartChat("Hey Buddy! I need help with something at home.");
    } else {
      onStartChat(quickInput);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fbf8f3] text-slate-800 overflow-y-auto no-scrollbar">
      {/* Top Bar with Avatar matching the reference image layout */}
      <div className="pt-3 px-5 pb-4 bg-gradient-to-b from-[#f5ede2] to-[#fbf8f3]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-slate-900 text-base">
              Buddy<span className="text-orange-600">.ai</span>
            </span>
            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
              Your Everyday Friend
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
          >
            Settings
          </button>
        </div>

        {/* Hero Section styled like the user reference screenshot */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
              Feel free<br />
              <span className="text-orange-600 font-serif italic font-normal">to tell me everything</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Broken kettle? Leaking pipe? Or just want to show me your flower pot? I\'m right here with you!
            </p>
          </div>

          {/* 3D Buddy Character Avatar */}
          <div className="shrink-0 -mt-1">
            <BuddyAvatar
              mood="happy"
              size="lg"
              showSpeechBubble="Hi bestie! How can I help you today?"
            />
          </div>
        </div>
      </div>

      {/* Main Feature: Live Camera Vision CTA Card */}
      <div className="px-5 mb-4">
        <div
          onClick={onOpenCamera}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-4.5 shadow-lg cursor-pointer transform hover:scale-[1.01] transition-all group"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1 max-w-[210px]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Sight</span>
              </div>
              <h3 className="text-lg font-black leading-tight">
                Open Camera & Show Me!
              </h3>
              <p className="text-[11px] text-orange-100 leading-snug">
                Point at your flowers, broken kettle, or leaking pipe. I can see colors & inspect live!
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
          </div>

          {/* Visual flourish */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Input box styled identically to user's SmartClaim prompt chassis */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-3xl border border-[#ede3d5] p-4 shadow-xs space-y-3">
          <textarea
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Type, talk, or share what's happening around your home..."
            rows={2}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            {/* Action buttons (Camera, Voice, File) matching reference image */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCamera}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-[11px] font-semibold border border-orange-200/60 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-orange-600" />
                <span>Camera</span>
              </button>

              <button
                onClick={() => onStartChat("Hey Buddy! Let's talk about my day.")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200/60 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-amber-600" />
                <span>Voice</span>
              </button>

              <button
                onClick={() => onStartChat("I have a photo to share with you!")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>File</span>
              </button>
            </div>

            <button
              onClick={handleSendQuick}
              className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-xs"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Everyday Home Fixes & Guides */}
      <div className="px-5 mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black tracking-wider uppercase text-slate-500">
            What Can Buddy Help You Fix?
          </h2>
          <span className="text-[11px] text-orange-600 font-semibold">4 DIY Guides</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {BUDDY_FIX_GUIDES.map((guide) => (
            <div
              key={guide.id}
              onClick={() => onOpenGuide(guide)}
              className="bg-white p-3.5 rounded-2xl border border-[#ede3d5] shadow-2xs hover:border-orange-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{guide.icon}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {guide.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                  {guide.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                  {guide.shortDesc}
                </p>
              </div>

              {guide.youtubeVideo && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                  <Play className="w-3 h-3 fill-rose-600" />
                  <span>Watch Video Guide</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Friendly Chat Starters */}
      <div className="px-5 pb-6 space-y-2">
        <h3 className="text-xs font-black tracking-wider uppercase text-slate-500">
          Or Just Talk & Share Anything
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onStartChat("See this is my flower pot! Look at the red roses blooming.")}
            className="p-3 bg-white hover:bg-rose-50/50 rounded-2xl border border-[#ede3d5] text-left text-xs font-medium text-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Flower2 className="w-4 h-4 text-rose-500" />
              <span>"See this is my flower pot! How does it look?"</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onStartChat("My kettle stopped working and won't boil, what should I do?")}
            className="p-3 bg-white hover:bg-orange-50/50 rounded-2xl border border-[#ede3d5] text-left text-xs font-medium text-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>"My electric kettle is broken and won't turn on"</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onStartChat("Water is leaking under my kitchen sink pipe!")}
            className="p-3 bg-white hover:bg-blue-50/50 rounded-2xl border border-[#ede3d5] text-left text-xs font-medium text-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span>"Water pipe is leaking under my sink, help!"</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onStartChat("I had a stressful day, just wanted to talk to a friend.")}
            className="p-3 bg-white hover:bg-pink-50/50 rounded-2xl border border-[#ede3d5] text-left text-xs font-medium text-slate-700 flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>"I had a long day, just want to talk to a friend"</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-500 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
