import React, { useState } from 'react';
import { LegalYouTubeVideo } from '../../data/youtubeLegalVideos';
import { Play, X, ExternalLink, CheckCircle } from 'lucide-react';

interface YouTubeVideoCardProps {
  video: LegalYouTubeVideo;
}

export const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#ede3d5] overflow-hidden shadow-xs hover:border-[#de7b35] transition-all group">
        {/* Thumbnail with Play Overlay */}
        <div
          onClick={() => setIsPlaying(true)}
          className="relative h-28 sm:h-32 bg-slate-900 cursor-pointer overflow-hidden"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/80 text-white px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
          <span className="absolute top-2 left-2 text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <span>▶ YouTube Guide</span>
          </span>
        </div>

        {/* Content */}
        <div className="p-3 space-y-1.5">
          <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#de7b35] transition-colors">
            {video.title}
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5 text-blue-500 fill-blue-500 text-white" />
              {video.channelName}
            </span>
            <span>{video.views}</span>
          </div>

          <div className="p-2 rounded-xl bg-[#faf6f0] border border-[#f0e4d4] text-[10.5px] text-slate-600 leading-snug">
            <span className="font-bold text-slate-800">💡 Why watch: </span>
            {video.whyWatch}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-white text-xs">
              <span className="font-bold truncate pr-2">{video.title}</span>
              <button
                onClick={() => setIsPlaying(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video iFrame / Watch fallback */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={`${video.embedUrl}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-slate-950 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-white text-[12px]">{video.title}</p>
              <p className="text-[11px] text-slate-400">{video.keyTakeaway}</p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-bold underline pt-1"
              >
                <span>Open in YouTube App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
