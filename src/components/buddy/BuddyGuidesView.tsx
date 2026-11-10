import React, { useState } from 'react';
import { Search, Wrench, Play, Sparkles, Camera } from 'lucide-react';
import { BUDDY_FIX_GUIDES, BuddyFixGuide } from '../../data/buddyGuides';

interface BuddyGuidesViewProps {
  onSelectGuide: (guide: BuddyFixGuide) => void;
  onOpenCamera: () => void;
}

export const BuddyGuidesView: React.FC<BuddyGuidesViewProps> = ({
  onSelectGuide,
  onOpenCamera
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'appliances', label: '🫖 Appliances' },
    { id: 'plumbing', label: '🚿 Plumbing' },
    { id: 'plants', label: '🌸 Plants' },
    { id: 'home', label: '⚡ Home' }
  ];

  const filteredGuides = BUDDY_FIX_GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(search.toLowerCase()) ||
      guide.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      guide.symptoms.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#fbf8f3] text-slate-800 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-4 bg-white border-b border-[#ede3d5] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              Everyday DIY Fixes & Guides
            </h2>
            <p className="text-[11px] text-slate-500">
              When something breaks, fix it yourself step-by-step
            </p>
          </div>
          <button
            onClick={onOpenCamera}
            className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            title="Open camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kettle, pipe leak, flower care..."
            className="w-full bg-slate-50 pl-8 pr-3 py-2 rounded-full border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides List */}
      <div className="p-4 space-y-3">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onSelectGuide(guide)}
            className="bg-white p-4 rounded-3xl border border-[#ede3d5] shadow-xs hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-orange-50 border border-orange-100">
                {guide.icon}
              </span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {guide.badge}
                  </span>
                  {guide.youtubeVideo && (
                    <span className="text-[9px] font-bold text-red-600 flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded-full">
                      <Play className="w-2.5 h-2.5 fill-red-600" />
                      <span>{guide.youtubeVideo.duration}</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {guide.shortDesc}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-slate-700">
                <Wrench className="w-3 h-3 text-orange-600" />
                <span>{guide.steps.length} Steps</span>
              </span>
              <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform">
                View Instructions →
              </span>
            </div>
          </div>
        ))}

        {/* Live Camera Help Prompt */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-center space-y-2 mt-4">
          <Sparkles className="w-6 h-6 text-orange-600 mx-auto" />
          <h4 className="text-xs font-bold text-slate-800">
            Have something else broken?
          </h4>
          <p className="text-[11px] text-slate-600">
            Open the live camera and point it at the object. Buddy will inspect it in real-time!
          </p>
          <button
            onClick={onOpenCamera}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Open Camera Vision</span>
          </button>
        </div>
      </div>
    </div>
  );
};
