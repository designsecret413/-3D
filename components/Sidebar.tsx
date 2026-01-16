
import React from 'react';
import { AgeGroup } from '../types';

interface SidebarProps {
  onImageUpload: (base64: string) => void;
  selectedAge: AgeGroup;
  onAgeChange: (age: AgeGroup) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  currentImage: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onImageUpload, 
  selectedAge, 
  onAgeChange, 
  isGenerating,
  onGenerate,
  currentImage
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ageGroups: AgeGroup[] = ['Baby', 'Child', 'Teenager', 'Adult', 'Senior'];

  return (
    <div className="w-full lg:w-80 h-full p-6 flex flex-col gap-8 bg-white/80 border-r border-pink-100 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">3D</div>
        <h1 className="text-xl font-bold text-gray-800">마이캐릭3D</h1>
      </div>

      <section>
        <label className="block text-sm font-semibold text-gray-700 mb-3">1. Upload Photo</label>
        <div className="relative border-2 border-dashed border-pink-200 rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden transition-all hover:border-pink-400 group cursor-pointer bg-pink-50/30">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          />
          
          {currentImage ? (
            <div className="relative w-full h-full">
              <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs font-bold bg-pink-500/80 px-3 py-1 rounded-full shadow-lg">Change Image</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <svg className="w-10 h-10 mx-auto mb-2 text-pink-300 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <label className="block text-sm font-semibold text-gray-700 mb-3">2. Choose Age Group</label>
        <div className="grid grid-cols-2 gap-2">
          {ageGroups.map((group) => (
            <button
              key={group}
              onClick={() => onAgeChange(group)}
              className={`px-3 py-2 text-sm rounded-xl font-medium transition-all ${
                selectedAge === group 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' 
                : 'bg-white text-gray-600 border border-gray-100 hover:border-pink-300 shadow-sm'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`mt-auto w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 shadow-xl ${
          isGenerating 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 shadow-pink-100'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : 'Generate Character'}
      </button>
    </div>
  );
};

export default Sidebar;
