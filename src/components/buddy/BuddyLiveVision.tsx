import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { BuddyAvatar } from './BuddyAvatar';
import { VisionPresetSelector } from './VisionPresetSelector';
import { VisionResultCard } from './VisionResultCard';
import {
  analyzeImageWithBuddy,
  speakBuddyVoice,
  stopBuddyVoice,
  BuddyAnalysisResult
} from '../../services/aiBuddyService';
import { PRESET_CAMERA_SCENES, PresetCameraScene } from '../../data/buddyGuides';

interface BuddyLiveVisionProps {
  onClose?: () => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const BuddyLiveVision: React.FC<BuddyLiveVisionProps> = ({
  onClose,
  onOpenChatWithTopic
}) => {
  const [streamActive, setStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [userPrompt, setUserPrompt] = useState('See this is my flower pot!');
  const [analysisResult, setAnalysisResult] = useState<BuddyAnalysisResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetCameraScene | null>(null);
  const [detectedColorTag, setDetectedColorTag] = useState<string>('Scanning...');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
        setSelectedPreset(null);
      }
    } catch {
      setCameraError('Camera access not active. Try our preset scenes below to see real-time color vision in action!');
      setStreamActive(false);
      if (!selectedPreset) {
        setSelectedPreset(PRESET_CAMERA_SCENES[0]);
      }
    }
  }, [facingMode, selectedPreset]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      stopBuddyVoice();
    };
  }, [startCamera]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleAnalyze = async (customPrompt?: string) => {
    const promptToUse = customPrompt || userPrompt;
    setIsAnalyzing(true);
    stopBuddyVoice();

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 400;
      canvas.height = 400;

      if (streamActive && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 400);
      } else if (selectedPreset) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = selectedPreset.imageUrl;
        });
        ctx.drawImage(img, 0, 0, 400, 400);
      }

      const result = await analyzeImageWithBuddy(canvas, promptToUse);
      if (selectedPreset && (!result.detectedColor || result.detectedColor === 'vibrant')) {
        result.detectedColor = selectedPreset.colorName;
      }

      setAnalysisResult(result);
      if (result.detectedColor) setDetectedColorTag(result.detectedColor);

      if (voiceEnabled && result.reply) {
        setIsSpeaking(true);
        speakBuddyVoice(result.reply, () => setIsSpeaking(false));
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (scene: PresetCameraScene) => {
    setSelectedPreset(scene);
    setStreamActive(false);
    setUserPrompt(scene.sampleQuestion);
    setDetectedColorTag(scene.colorName);

    const presetResult: BuddyAnalysisResult = {
      reply: scene.buddyAnswer,
      detectedColor: scene.colorName,
      detectedSubject: scene.name,
      actionTip: scene.actionTip,
      followUpSuggestions: ['How often should I water it?', 'Does it need more light?', 'Tell me more tips!']
    };
    setAnalysisResult(presetResult);

    if (voiceEnabled) {
      setIsSpeaking(true);
      speakBuddyVoice(scene.buddyAnswer, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#141210] text-white relative overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold tracking-wide uppercase text-white/90">Buddy Live Vision</span>
          <span className="text-[10px] bg-orange-500/20 text-orange-300 font-mono px-2 py-0.5 rounded-full border border-orange-500/30">
            {detectedColorTag}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Viewfinder Area */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {streamActive ? (
          <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />
        ) : selectedPreset ? (
          <div className="relative w-full h-full">
            <img src={selectedPreset.imageUrl} alt={selectedPreset.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-white/15">
              📷 {selectedPreset.name}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-white/60 space-y-2">
            <Camera className="w-12 h-12 mx-auto text-white/30 animate-pulse" />
            <p className="text-xs">{cameraError || 'Initializing camera stream...'}</p>
          </div>
        )}

        {/* Viewfinder Target Crosshairs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-dashed border-orange-400/60 rounded-3xl relative">
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-orange-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-orange-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-400" />
          </div>
        </div>

        {/* Floating Buddy Avatar */}
        <div className="absolute top-4 right-4 z-10">
          <BuddyAvatar
            mood={isAnalyzing ? 'thinking' : isSpeaking ? 'excited' : 'happy'}
            isSpeaking={isSpeaking}
            size="md"
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
          />
        </div>

        {streamActive && (
          <button
            onClick={toggleFacingMode}
            className="absolute bottom-4 left-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 hover:bg-black/80"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preset Selector */}
      <VisionPresetSelector
        streamActive={streamActive}
        selectedPreset={selectedPreset}
        onStartLiveCamera={startCamera}
        onSelectPreset={handleSelectPreset}
      />

      {/* Result Card */}
      {analysisResult && (
        <VisionResultCard
          analysisResult={analysisResult}
          onSelectFollowUp={(prompt) => {
            setUserPrompt(prompt);
            handleAnalyze(prompt);
          }}
          onOpenChatWithTopic={onOpenChatWithTopic}
        />
      )}

      {/* Bottom Controls */}
      <div className="p-3 bg-[#191512] border-t border-white/10 flex items-center gap-2 z-20">
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder='Ask: "See my flower pot?", "Inspect kettle"...'
          className="flex-1 bg-white/10 text-white text-xs px-3.5 py-2.5 rounded-full border border-white/15 focus:outline-hidden focus:border-orange-400 placeholder-white/40"
        />
        <button
          onClick={() => handleAnalyze()}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 font-bold text-xs text-white shadow-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Looking...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tell Buddy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
