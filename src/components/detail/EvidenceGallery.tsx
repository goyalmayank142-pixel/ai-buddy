import React, { useState, useRef } from 'react';
import { EvidenceItem } from '../../types/case';
import { formatDate } from '../../utils/dateUtils';
import { 
  Paperclip, 
  Plus, 
  FileText, 
  Image as ImageIcon, 
  Eye, 
  X 
} from 'lucide-react';

interface EvidenceGalleryProps {
  evidence: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ evidence, onAddEvidence }) => {
  const [selectedPreview, setSelectedPreview] = useState<EvidenceItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: 'Uploaded evidence document',
        uploadedAt: new Date().toISOString().split('T')[0],
        fileSize: `${sizeKb} KB`
      };

      onAddEvidence(newEvidence);
    }

    if (e.target) e.target.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Evidence Locker</h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {evidence.length} file{evidence.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Receipts, carrier tracking, photos & logs compiled for dispute resolution
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Proof</span>
        </button>
      </div>

      {evidence.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {evidence.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#faf8f5] border border-amber-900/10 hover:border-amber-900/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 rounded-xl bg-white shadow-xs">
                    {item.type === 'photo' || item.fileUrl ? (
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.fileSize || 'Attached'}
                  </span>
                </div>

                <p className="font-bold text-slate-800 text-xs mt-2.5 truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{formatDate(item.uploadedAt)}</span>
                {item.fileUrl && (
                  <button
                    onClick={() => setSelectedPreview(item)}
                    className="text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
          <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No evidence documents uploaded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Having proof of postage, delivery receipts, or photos increases resolution success by 85%
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Upload your receipts or photos
          </button>
        </div>
      )}

      {/* Modal Lightbox for Image Preview */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 truncate">{selectedPreview.name}</span>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center max-h-96">
              {selectedPreview.fileUrl ? (
                <img
                  src={selectedPreview.fileUrl}
                  alt={selectedPreview.name}
                  className="max-h-80 object-contain rounded-lg"
                />
              ) : (
                <p className="text-xs text-slate-500">Document preview unavailable</p>
              )}
            </div>
            <div className="p-4 text-xs text-slate-600">
              <p className="font-semibold">{selectedPreview.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
