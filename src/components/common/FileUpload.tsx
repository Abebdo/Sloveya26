import React, { useRef, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, maxSizeMB = 50 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      alert(`File too large. Max size: ${maxSizeMB}MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key="upload"
            className={cn(
              "border-2 border-dashed rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80",
              isDragging ? "border-brand-blue bg-brand-blue/5 scale-[1.02]" : "border-slate-200 hover:border-brand-blue/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-700 mb-2">Click to upload or drag & drop</p>
            <p className="text-sm text-slate-400">
              Supports .exe, .apk, .zip, .pdf (Max {maxSizeMB}MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleChange}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            key="file"
            className="bg-white rounded-[24px] p-6 shadow-lg border border-slate-100 flex items-center gap-4 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
              <File className="w-6 h-6" />
            </div>
            
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{selectedFile.name}</h4>
              <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-brand-danger transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
