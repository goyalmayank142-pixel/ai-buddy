import React, { useRef } from 'react';
import { Camera, Paperclip, Mic, X, FileText, Image as ImageIcon } from 'lucide-react';
import { EvidenceItem } from '../../types/case';

interface EvidenceUploaderProps {
  evidenceList: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
  onRemoveEvidence: (id: string) => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  evidenceList,
  onAddEvidence,
  onRemoveEvidence,
  isRecording = false,
  onToggleRecording
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCamera = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');
      const fileUrl = isImg ? URL.createObjectURL(file) : undefined;
      const sizeKb = Math.round(file.size / 1024);

      const newEvidence: EvidenceItem = {
        id: `ev-${Date.now()}-${i}`,
        name: file.name,
        type: isImg ? 'photo' : 'receipt',
        fileUrl,
        description: isCamera ? 'Captured photo evidence' : 'Uploaded document / receipt',
        uploadedAt: new Date().toISOString().split('T')[0],
        fileSize: `${sizeKb} KB`
      };

      onAddEvidence(newEvidence);
    }

    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Upload Action Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => handleFileUpload(e, true)}
        />
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-amber-600" />
          <span>Camera / Photo</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
          onChange={e => handleFileUpload(e, false)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all active:scale-95"
        >
          <Paperclip className="w-3.5 h-3.5 text-blue-600" />
          <span>Add Receipts & Files</span>
        </button>

        {onToggleRecording && (
          <button
            type="button"
            onClick={onToggleRecording}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-xs transition-all active:scale-95 ${
              isRecording
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-rose-600' : 'text-purple-600'}`} />
            <span>{isRecording ? 'Recording voice note...' : 'Voice Note'}</span>
          </button>
        )}
      </div>

      {/* Thumbnails of attached files */}
      {evidenceList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {evidenceList.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs text-slate-700 group transition-all hover:bg-amber-100/60"
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {item.fileUrl ? (
                  <img
                    src={item.fileUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover border border-amber-200 shrink-0"
                  />
                ) : item.type === 'photo' ? (
                  <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-semibold truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.fileSize || 'Uploaded file'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveEvidence(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-white transition-colors"
                title="Remove evidence"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
