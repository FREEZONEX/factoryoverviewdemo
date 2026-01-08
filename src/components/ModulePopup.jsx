import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '../config/modules';
import { useLanguage } from '../i18n/LanguageContext';
import { getModuleLink, saveModuleLink } from '../utils/storage';

const ModulePopup = ({ selectedNode, onClose }) => {
  const { t, translateUNSPath } = useLanguage();
  const selectedModule = selectedNode ? modules.find((m) => m.id === selectedNode) : null;
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const buttonRef = useRef(null);
  
  // 获取模块的翻译名称
  const getModuleName = (module) => {
    const key = module.name.replace(/\s+/g, '');
    return t(`modules.${key}`) || module.name;
  };

  // 获取模块的描述
  const getModuleDescription = (module) => {
    const key = module.name.replace(/\s+/g, '');
    return t(`moduleDescriptions.${key}`) || t('moduleDescription', { name: getModuleName(module) });
  };

  // 加载模块链接
  useEffect(() => {
    if (selectedModule) {
      const savedLink = getModuleLink(selectedModule.id);
      setLinkUrl(savedLink);
    }
  }, [selectedModule]);

  if (!selectedModule) return null;

  const handleButtonClick = (e) => {
    e.preventDefault();
    const url = getModuleLink(selectedModule.id);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setShowConfigDialog(true);
  };

  const handleSaveLink = () => {
    if (selectedModule && linkUrl.trim()) {
      // 确保URL格式正确，如果没有协议则添加https://
      let url = linkUrl.trim();
      if (url && !url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
      }
      saveModuleLink(selectedModule.id, url);
      setLinkUrl(url);
      setShowConfigDialog(false);
      setContextMenu(null);
    }
  };

  const handleCancel = () => {
    setShowConfigDialog(false);
    setContextMenu(null);
    const savedLink = getModuleLink(selectedModule.id);
    setLinkUrl(savedLink || '');
  };

  return (
    <AnimatePresence mode="wait">
      {selectedModule && (
        <React.Fragment key={selectedModule.id}>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {getModuleName(selectedModule)}
                  </h2>
                  <p className="text-sm text-gray-600 font-mono">
                    {translateUNSPath(selectedModule.uns_path)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full glass border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content - Four Sections */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 p-8">
                  {/* Section 1: Image */}
                  <div className="col-span-2">
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={selectedModule.imageUrl}
                        alt={selectedModule.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x600?text=' + encodeURIComponent(selectedModule.name);
                        }}
                      />
                    </div>
                  </div>

                  {/* Section 2: Description */}
                  <div className="col-span-2">
                    <div className="prose max-w-none">
                      <p className="text-base text-gray-800 leading-relaxed">
                        {getModuleDescription(selectedModule)}
                      </p>
                    </div>
                  </div>

                  {/* Section 3: Metrics (Three Indicators) */}
                  <div className="col-span-2">
                    <div className="space-y-4">
                      {/* Build Time */}
                      <motion.div
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200/50 p-6 shadow-sm hover:shadow-md transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-center gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-blue-200/30 flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
                              {t('buildTime')}
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {selectedModule.metrics?.buildTime || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Value Creation */}
                      <motion.div
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neon-lime/20 to-neon-lime/10 border-2 border-neon-lime/30 p-6 shadow-sm hover:shadow-md transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-neon-lime/30 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3">
                              {t('valueCreation')}
                            </div>
                            <div className="text-base font-semibold text-gray-900 leading-relaxed">
                              {t(`moduleMetrics.${selectedModule.name.replace(/\s+/g, '')}.valueCreation`) || selectedModule.metrics?.valueCreation || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Features */}
                      <motion.div
                        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200/50 p-6 shadow-sm hover:shadow-md transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10 flex items-start gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-purple-200/30 flex items-center justify-center">
                              <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
                              {t('features')}
                            </div>
                            <div className="text-base text-gray-800 leading-relaxed">
                              {t(`moduleMetrics.${selectedModule.name.replace(/\s+/g, '')}.features`) || selectedModule.metrics?.features || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Section 4: Open System Button */}
                  <div className="col-span-2">
                    <button
                      ref={buttonRef}
                      onClick={handleButtonClick}
                      onContextMenu={handleRightClick}
                      disabled={!getModuleLink(selectedModule.id)}
                      className={`w-full px-6 py-4 rounded-lg border-2 font-semibold text-lg transition-all ${
                        getModuleLink(selectedModule.id)
                          ? 'bg-neon-lime/90 text-gray-900 border-neon-lime/50 hover:bg-neon-lime hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                          : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {getModuleLink(selectedModule.id) ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>{t('openSystem')}</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>{t('configureLink')} (Right-click)</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Configuration Dialog */}
          {showConfigDialog && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('configureLink')}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('enterUrl')}
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com 或 example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neon-lime focus:border-neon-lime outline-none"
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {t('language') === 'zh' ? '支持任何外部链接，可包含 http:// 或 https://' : 'Supports any external link, with or without http:// or https://'}
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSaveLink}
                    className="px-4 py-2 bg-neon-lime text-gray-900 font-semibold rounded-lg hover:bg-neon-lime/90 transition-colors"
                  >
                    {t('save')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default ModulePopup;
