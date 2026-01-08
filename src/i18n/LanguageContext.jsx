import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { loadLanguage, saveLanguage } from '../utils/storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // 从 localStorage 加载保存的语言设置
    // 添加额外的安全检查，防止在容器环境中 localStorage 不可用或返回无效值
    let saved = 'en'; // 默认值
    try {
      const loaded = loadLanguage();
      // 严格验证：只接受 'en' 或 'zh'
      if (loaded === 'en' || loaded === 'zh') {
        saved = loaded;
      }
    } catch (error) {
      console.warn('Failed to load language from localStorage:', error);
      // 使用默认值 'en'
    }
    return saved;
  });

  useEffect(() => {
    // 保存语言设置到 localStorage
    saveLanguage(language);
  }, [language]);

  const t = (key, params = {}) => {
    // 确保 language 有效，如果无效则使用 'en'
    const currentLang = (language === 'en' || language === 'zh') ? language : 'en';
    const langTranslations = translations[currentLang];
    
    if (!langTranslations) {
      console.warn(`Translation for language '${currentLang}' not found, falling back to 'en'`);
      return key;
    }
    
    const keys = key.split('.');
    let value = langTranslations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value === 'string' && params) {
      // 替换参数
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value || key;
  };

  // 翻译UNS路径
  const translateUNSPath = (path) => {
    if (!path) return path;
    
    // 确保 language 有效
    const currentLang = (language === 'en' || language === 'zh') ? language : 'en';
    
    if (currentLang === 'en') {
      return path;
    }
    
    const langTranslations = translations[currentLang];
    if (!langTranslations || !langTranslations.unsPaths) {
      return path;
    }
    
    const parts = path.split('/');
    const translatedParts = parts.map(part => {
      return langTranslations.unsPaths?.[part] || part;
    });
    return translatedParts.join('/');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translateUNSPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

