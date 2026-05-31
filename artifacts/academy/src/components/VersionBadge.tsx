import React from 'react';
import { Sparkles } from 'lucide-react';

export const VersionBadge: React.FC = () => {
  const version = "2.0.0";
  const buildDate = new Date().toLocaleDateString('ar-EG');
  
  return (
    <>
      {/* Top Right Badge */}
      <div className="fixed top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50 flex items-center gap-2 animate-pulse">
        <Sparkles className="w-5 h-5" />
        <span>Smart Venom K v{version}</span>
      </div>
      
      {/* Bottom Right Badge */}
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-50">
        <span>Updated: {buildDate}</span>
      </div>
    </>
  );
};

export default VersionBadge;
