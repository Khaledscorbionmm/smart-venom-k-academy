import React from 'react';

export const VersionBadge: React.FC = () => {
  const version = "2.0.0";
  const buildDate = new Date().toLocaleDateString('ar-EG');
  
  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-50">
      <span>Smart Venom K v{version}</span>
      <span className="mx-1">•</span>
      <span className="text-purple-200">{buildDate}</span>
    </div>
  );
};

export default VersionBadge;
