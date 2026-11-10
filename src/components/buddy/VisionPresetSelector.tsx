import React from 'react';
import { Camera } from 'lucide-react';
import { PRESET_CAMERA_SCENES, PresetCameraScene } from '../../data/buddyGuides';

interface VisionPresetSelectorProps {
  streamActive: boolean;
  selectedPreset: PresetCameraScene | null;
  onStartLiveCamera: () => void;
  onSelectPreset: (scene: PresetCameraScene) => void;
}

export const VisionPresetSelector: React.FC<VisionPresetSelectorProps> = ({
  streamActive,
  selectedPreset,
  onStartLiveCamera,
  onSelectPreset
}) => {
  return (
    <div className="px-3 py-2 bg-[#1c1815] border-t border-white/10 z-10">
      <p className="text-[10px] text-white/50 mb-1.5 font-medium flex items-center justify-between">
        <span>Tap scene or point camera:</span>
        {streamActive && (
          <span className="text-emerald-400 font-bold">● Live Camera Active</span>
        )}
      </p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {streamActive && (
          <button
            onClick={onStartLiveCamera}
            className="shrink-0 px-2.5 py-1.5 rounded-xl bg-orange-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
        )}

        {PRESET_CAMERA_SCENES.map((scene) => {
          const isSelected = selectedPreset?.id === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSelectPreset(scene)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-md'
                  : 'bg-white/10 text-white/80 border-white/10 hover:bg-white/15'
              }`}
            >
              <span>{scene.category === 'plants' ? '🌸' : scene.category === 'appliances' ? '🫖' : '🚿'}</span>
              <span>
                {scene.name.split(' ')[0]} {scene.dominantColor === 'red' ? '🔴' : scene.dominantColor === 'yellow' ? '🟡' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
