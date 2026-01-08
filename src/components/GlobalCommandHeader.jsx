import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const GlobalCommandHeader = ({ hoveredNode }) => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="relative z-30">
      {/* Base Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t('title')}
            </h1>
          </div>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:border-neon-lime hover:bg-neon-lime/10 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandHeader;

