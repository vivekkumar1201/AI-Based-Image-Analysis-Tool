
import React, { useRef, useState } from 'react';
import { Upload, X, FileImage, RefreshCw } from 'lucide-react';
import { FileData } from '../types';

interface ImageUploaderProps {
  label: string;
  onImageSelected: (data: FileData | null) => void;
  selectedImage: FileData | null;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  onImageSelected, 
  selectedImage,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (disabled) return;
    if (!file.type.startsWith('image/')) {
      alert('Invalid format. Please upload an image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      onImageSelected({
        file,
        previewUrl: result,
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
      
      {!selectedImage ? (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative h-32 w-full rounded-md border border-dashed transition-all duration-200
            flex flex-col items-center justify-center cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800' : ''}
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-slate-600'
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
            accept="image/*"
            disabled={disabled}
          />
          <div className="flex items-center gap-2 text-slate-400">
            <Upload size={18} />
            <span className="text-sm font-medium">Click to upload</span>
          </div>
          <span className="text-xs text-slate-600 mt-1">or drag and drop</span>
        </div>
      ) : (
        <div className="relative h-32 w-full rounded-md border border-slate-700 bg-slate-900 overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
             <img 
              src={selectedImage.previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain p-2"
            />
          </div>
          
          {/* Metadata Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 border-t border-slate-700 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FileImage size={14} className="text-indigo-400 shrink-0" />
              <span className="text-xs text-slate-200 truncate font-mono">{selectedImage.file.name}</span>
            </div>
          </div>

          {!disabled && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded shadow-sm"
                title="Replace"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onImageSelected(null); }}
                className="p-1.5 bg-red-900/80 hover:bg-red-800 text-red-100 rounded shadow-sm"
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
