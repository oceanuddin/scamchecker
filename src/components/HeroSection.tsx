import React, { useState, useRef } from 'react';
import { GlassPanel } from './GlassPanel';
import { Button } from './Button';
import { UploadCloudIcon, MessageCircleIcon, ArrowRightIcon } from 'lucide-react';
import { LoadingDots } from './LoadingDots';

interface HeroSectionProps {
  onCheckScam: (type: 'image' | 'text', input: string | File) => void;
  loading?: boolean;
}

export const HeroSection = ({
  onCheckScam,
  loading = false
}: HeroSectionProps) => {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isTextWiggling, setIsTextWiggling] = useState(false);
  const [missingInputError, setMissingInputError] = useState<string | null>(null);
  const [isButtonWiggling, setIsButtonWiggling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const MAX_CHARACTERS = 1000;
  const MIN_CHARACTERS = 50;
  const characterCount = textInput.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const isTooShort = characterCount < MIN_CHARACTERS;

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PNG, JPG, or WEBP images are allowed.');
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 600);
      return false;
    }
    if (file.size > maxSize) {
      setFileError('Your files are too powerful! Maximum size is 5MB.');
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 600);
      return false;
    }
    setFileError(null);
    return true;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextInput(newValue);
    
    // Trigger wiggle animation when reaching the limit
    if (newValue.length === MAX_CHARACTERS && !isTextWiggling) {
      setIsTextWiggling(true);
      setTimeout(() => setIsTextWiggling(false), 600);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setImageFile(file);
      }
    }
  };

  const handleSubmit = () => {
    setMissingInputError(null);
    if (activeTab === 'text') {
      if (!textInput.trim()) {
        setMissingInputError('Please enter a description.');
        setIsButtonWiggling(true);
        setTimeout(() => setIsButtonWiggling(false), 600);
        return;
      }
      if (textInput.trim().length < 50) {
        setMissingInputError('Please enter at least 50 characters for better analysis.');
        setIsButtonWiggling(true);
        setTimeout(() => setIsButtonWiggling(false), 600);
        return;
      }
      if (!isOverLimit) {
        onCheckScam('text', textInput);
      }
    } else if (activeTab === 'image') {
      if (!imageFile) {
        setMissingInputError('Please upload an image.');
        setIsButtonWiggling(true);
        setTimeout(() => setIsButtonWiggling(false), 600);
        return;
      }
      onCheckScam('image', imageFile);
    }
  };

  const canSubmit = (activeTab === 'text' && textInput.trim() && !isOverLimit) || (activeTab === 'image' && imageFile);

  return <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center mb-10 max-w-3xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Is it a scam?
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-blue-100/80">
          Upload a screenshot or tell us what happened. Let AI decide.
        </p>
      </div>
      <GlassPanel className="w-full max-w-4xl p-6 md:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 border-b border-white/10 pb-4">
            <button 
              onClick={() => setActiveTab('image')} 
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'image' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70 hover:text-white/90'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UploadCloudIcon size={18} />
              <span>Upload Image</span>
            </button>
            <button 
              onClick={() => setActiveTab('text')} 
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${activeTab === 'text' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70 hover:text-white/90'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MessageCircleIcon size={18} />
              <span>Describe Situation</span>
            </button>
          </div>
          {activeTab === 'image' ? (
            <div
              className={`bg-white/5 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-white/8 transition-all ${
                fileError 
                  ? 'border-red-400 bg-red-500/10' 
                  : 'border-white/20'
              } ${isWiggling ? 'animate-wiggle' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  if (validateFile(file)) {
                    setImageFile(file);
                  }
                }
              }}
              onClick={() => !loading && fileInputRef.current?.click()}
              style={{ position: 'relative' }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-blue-500/20">
                  <UploadCloudIcon size={32} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop an image here
                  </p>
                  <p className="text-sm text-white/60 mt-2">
                    or click to browse files
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                {imageFile && <p className="text-xs text-white/60 mt-2">Selected: {imageFile.name}</p>}
                {fileError && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-300 text-sm font-medium">{fileError}</p>
                  </div>
                )}
                <p className="text-xs text-white/40 mt-2">
                  Supports PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <textarea 
                className={`w-full bg-white/5 border rounded-xl p-4 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-white/40 transition-all ${
                  isOverLimit ? 'border-red-400 bg-red-500/10' : 'border-white/20'
                } ${isTextWiggling ? 'animate-wiggle' : ''}`}
                placeholder="Describe your situation in detail... For example: 'I received an email claiming to be from Amazon saying my account will be suspended unless I verify my information through this link...'" 
                value={textInput} 
                onChange={handleTextChange}
                disabled={loading}
                maxLength={MAX_CHARACTERS}
              />
              <div className="flex justify-between items-center text-sm">
                <span className={`${isOverLimit || (isTooShort && characterCount > 0) ? 'text-red-400' : 'text-white/60'}`}>
                  {characterCount} / {MAX_CHARACTERS} characters
                </span>
                {isOverLimit && (
                  <span className="text-red-400 font-medium">
                    Character limit exceeded!
                  </span>
                )}
                {isTooShort && characterCount > 0 && (
                  <span className="text-red-400 font-medium">
                    Minimum {MIN_CHARACTERS} characters required
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className={`group ${isButtonWiggling ? 'animate-wiggle' : ''}`} 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span>Analyzing</span>
                  <LoadingDots />
                </div>
              ) : (
                <>
                  <span>Check Now</span>
                  <ArrowRightIcon size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
          {missingInputError && (
            <div className="mt-3 text-center">
              <span className="text-red-400 font-medium text-sm">{missingInputError}</span>
            </div>
          )}
        </div>
      </GlassPanel>
    </section>;
};