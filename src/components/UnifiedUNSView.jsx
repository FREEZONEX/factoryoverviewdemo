import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '../config/modules';
import { useLanguage } from '../i18n/LanguageContext';

const UnifiedUNSView = ({ hoveredNode }) => {
  const { t, translateUNSPath } = useLanguage();
  const containerRef = useRef(null);
  const moduleRefs = useRef({});
  const tagRefs = useRef({});
  const [modulePositions, setModulePositions] = useState({});
  const [tagPositions, setTagPositions] = useState({});
  const [updatedTags, setUpdatedTags] = useState({});
  const updateIntervalRef = useRef(null);

  // Get linked modules for the hovered node
  const linkedModules = useMemo(() => {
    if (!hoveredNode) return [];
    const hoveredModule = modules.find((m) => m.id === hoveredNode);
    if (!hoveredModule) return [];
    return hoveredModule.linked_nodes.map((linkedId) => 
      modules.find((m) => m.id === linkedId)
    ).filter(Boolean);
  }, [hoveredNode]);

  // Update module positions - trigger on hover and after render
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const positions = {};
      Object.entries(moduleRefs.current).forEach(([id, ref]) => {
        if (ref && containerRef.current) {
          const rect = ref.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          positions[id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        }
      });
      
      if (Object.keys(positions).length > 0) {
        setModulePositions(positions);
      }
    };

    // Update tag positions as well
    const updateTagPositions = () => {
      if (!containerRef.current) return;
      const positions = {};
      Object.entries(tagRefs.current).forEach(([key, ref]) => {
        if (ref && containerRef.current) {
          const rect = ref.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          positions[key] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          };
        }
      });
      if (Object.keys(positions).length > 0) {
        setTagPositions(prev => ({ ...prev, ...positions }));
      }
    };

    // Force update when hover changes
    const forceUpdate = () => {
      updatePositions();
      updateTagPositions();
    };

    // Multiple attempts to ensure positions are captured
    const timeout1 = setTimeout(forceUpdate, 50);
    const timeout2 = setTimeout(forceUpdate, 150);
    const timeout3 = setTimeout(forceUpdate, 300);
    const timeout4 = setTimeout(forceUpdate, 600);
    
    window.addEventListener('resize', forceUpdate);
    
    // Use requestAnimationFrame for better timing
    const rafId1 = requestAnimationFrame(forceUpdate);
    const rafId2 = requestAnimationFrame(() => {
      setTimeout(forceUpdate, 100);
    });
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
      cancelAnimationFrame(rafId1);
      cancelAnimationFrame(rafId2);
      window.removeEventListener('resize', forceUpdate);
    };
  }, [hoveredNode]);

  // Simulate field-level data updates
  useEffect(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    // Update random fields - can update multiple fields at once
    const updateRandomFields = () => {
      const allModules = modules;
      
      // Random number of fields to update (1-6 fields)
      const numUpdates = Math.floor(Math.random() * 6) + 1;
      const updates = new Set();
      
      // Collect random fields to update
      for (let i = 0; i < numUpdates; i++) {
        const randomModule = allModules[Math.floor(Math.random() * allModules.length)];
        const randomTag = randomModule.schema.tags[Math.floor(Math.random() * randomModule.schema.tags.length)];
        const tagKey = `${randomModule.id}-${randomTag.name}`;
        updates.add(tagKey);
      }
      
      // Trigger flash animation for all selected fields
      const timestamp = Date.now();
      setUpdatedTags(prev => {
        const next = { ...prev };
        updates.forEach(tagKey => {
          next[tagKey] = timestamp;
        });
        return next;
      });
      
      // Clear after animation
      setTimeout(() => {
        setUpdatedTags(prev => {
          const next = { ...prev };
          updates.forEach(tagKey => {
            delete next[tagKey];
          });
          return next;
        });
      }, 800);
    };

    // Initial update
    updateRandomFields();
    
    // Set up interval - update every 0.3-0.8 seconds for very frequent changes
    updateIntervalRef.current = setInterval(() => {
      updateRandomFields();
    }, 300 + Math.random() * 500);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Build tree structure from UNS paths
  const buildTree = () => {
    const tree = {};
    
    modules.forEach((module) => {
      const pathParts = module.uns_path.split('/');
      let current = tree;
      
      pathParts.forEach((part, index) => {
        // 翻译路径部分
        const translatedPart = t(`unsPaths.${part}`) || part;
        if (!current[part]) {
          current[part] = {
            name: part, // 保留原始名称用于查找
            translatedName: translatedPart, // 翻译后的显示名称
            children: {},
            modules: [],
            fullPath: pathParts.slice(0, index + 1).join('/'),
          };
        }
        if (index === pathParts.length - 1) {
          // Last part - add module here
          current[part].modules.push(module);
        } else {
          current = current[part].children;
        }
      });
    });
    
    return tree;
  };

  const tree = buildTree();

  // Check if a path should be highlighted
  const isHighlighted = (path) => {
    if (!hoveredNode) return false;
    const hoveredModule = modules.find((m) => m.id === hoveredNode);
    if (!hoveredModule) return false;
    return hoveredModule.uns_path.startsWith(path);
  };

  // Render tree node with module data
  const renderTreeNode = (node, level = 0, path = '') => {
    const entries = Object.entries(node);
    if (entries.length === 0) return null;

    return (
      <div>
        {entries.map(([key, value]) => {
          const currentPath = path ? `${path}/${key}` : key;
          const highlighted = isHighlighted(currentPath);
          const hasModule = value.modules && value.modules.length > 0;
          const moduleMatch = hoveredNode && value.modules?.some((m) => m.id === hoveredNode);
          const hasChildren = Object.keys(value.children).length > 0;
          // 使用翻译后的名称显示
          const displayName = value.translatedName || value.name || key;

          return (
            <div key={key} className="mb-1">
              {/* Tree Node */}
              <motion.div
                className={`py-1 px-2 transition-colors ${
                  highlighted || moduleMatch
                    ? 'bg-neon-lime/15 border-l-2 border-neon-lime'
                    : ''
                }`}
                animate={{
                  backgroundColor: highlighted || moduleMatch ? 'rgba(178, 237, 29, 0.15)' : 'transparent',
                }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-gray-400 text-base">
                  {level > 0 ? '└─ ' : ''}
                </span>
                <span
                  className={`font-semibold text-base ${
                    highlighted || moduleMatch ? 'text-neon-lime' : 'text-gray-700'
                  }`}
                >
                  {displayName}
                </span>
              </motion.div>

              {/* Module Data - Always Expanded */}
              {hasModule && value.modules.map((module, moduleIdx) => {
                const isModuleHighlighted = hoveredNode === module.id;
                const isLinkedModule = linkedModules.some((m) => m.id === module.id);
                
                return (
                  <motion.div
                    key={module.id}
                    ref={(el) => {
                      if (el) {
                        moduleRefs.current[module.id] = el;
                        // Trigger position update after ref is set
                        setTimeout(() => {
                          const updatePositions = () => {
                            const positions = {};
                            Object.entries(moduleRefs.current).forEach(([id, ref]) => {
                              if (ref && containerRef.current) {
                                const rect = ref.getBoundingClientRect();
                                const containerRect = containerRef.current.getBoundingClientRect();
                                positions[id] = {
                                  x: rect.left - containerRect.left + rect.width / 2,
                                  y: rect.top - containerRect.top + rect.height / 2,
                                };
                              }
                            });
                            setModulePositions(positions);
                          };
                          updatePositions();
                        }, 10);
                      }
                    }}
                    className="ml-4 mb-3 mt-2 relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: moduleIdx * 0.05, duration: 0.3 }}
                  >
                    <motion.div
                      className={`p-4 border-2 rounded-lg shadow-sm transition-all cursor-pointer relative ${
                        isModuleHighlighted
                          ? 'bg-neon-lime/15 border-neon-lime/60 shadow-neon-lime/20'
                          : isLinkedModule
                          ? 'bg-blue-50/50 border-blue-300/40 shadow-blue-200/20'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      animate={{
                        backgroundColor: isModuleHighlighted 
                          ? 'rgba(178, 237, 29, 0.15)' 
                          : isLinkedModule
                          ? 'rgba(219, 234, 254, 0.5)'
                          : 'rgba(255, 255, 255, 1)',
                        borderColor: isModuleHighlighted 
                          ? 'rgba(178, 237, 29, 0.6)' 
                          : isLinkedModule
                          ? 'rgba(147, 197, 253, 0.4)'
                          : 'rgba(229, 231, 235, 1)',
                        scale: isModuleHighlighted ? 1.02 : isLinkedModule ? 1.01 : 1,
                        boxShadow: isModuleHighlighted 
                          ? '0 4px 12px rgba(178, 237, 29, 0.2)' 
                          : isLinkedModule
                          ? '0 2px 8px rgba(59, 130, 246, 0.15)'
                          : '0 1px 3px rgba(0, 0, 0, 0.1)',
                      }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      {/* Module Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${
                              isModuleHighlighted ? 'bg-neon-lime' : isLinkedModule ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                            animate={{
                              scale: isModuleHighlighted || isLinkedModule ? [1, 1.3, 1] : 1,
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: (isModuleHighlighted || isLinkedModule) ? Infinity : 0,
                              ease: 'easeInOut',
                            }}
                          />
                          <div className={`font-bold text-sm ${
                            isModuleHighlighted ? 'text-neon-lime' : isLinkedModule ? 'text-blue-600' : 'text-gray-800'
                          }`}>
                            {t(`modules.${module.name.replace(/\s+/g, '')}`) || module.name}
                          </div>
                        </div>
                        
                        {/* Data Exchange Indicator */}
                        {isLinkedModule && (
                          <motion.div
                            className="flex items-center gap-1 text-xs text-blue-600"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <motion.span
                              animate={{
                                x: [0, 3, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              ↔
                            </motion.span>
                            <span className="text-blue-500">{t('dataExchangeActive')}</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Module JSON */}
                      <motion.div
                        className="bg-gray-50 p-3 border border-gray-200 rounded text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="space-y-0.5">
                          <div>
                            <span className="text-blue-600">"id"</span>
                            <span className="text-gray-500">: </span>
                            <span className="text-purple-600">"{module.id}"</span>
                            <span className="text-gray-400">,</span>
                          </div>
                          <div>
                            <span className="text-blue-600">"uns_path"</span>
                            <span className="text-gray-500">: </span>
                            <span className="text-purple-600">"{translateUNSPath(module.uns_path)}"</span>
                            <span className="text-gray-400">,</span>
                          </div>
                          <div>
                            <span className="text-blue-600">"tags"</span>
                            <span className="text-gray-500">: </span>
                            <span className="text-gray-400">[</span>
                            <div className="ml-3">
                              {module.schema.tags.map((tag, idx) => {
                                const tagKey = `${module.id}-${tag.name}`;
                                const isUpdated = updatedTags[tagKey];
                                // Simulate value update
                                const displayValue = isUpdated 
                                  ? (() => {
                                      const baseValue = tag.value;
                                      if (baseValue.includes('%')) {
                                        const num = parseFloat(baseValue);
                                        return `${(num + (Math.random() * 2 - 1)).toFixed(1)}%`;
                                      } else if (baseValue.includes('units')) {
                                        const num = parseInt(baseValue);
                                        return `${num + Math.floor(Math.random() * 10 - 5)} units`;
                                      }
                                      return baseValue;
                                    })()
                                  : tag.value;
                                
                                return (
                                  <motion.div
                                    key={idx}
                                    ref={(el) => {
                                      if (el) {
                                        tagRefs.current[tagKey] = el;
                                      }
                                    }}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + idx * 0.02 }}
                                    className="relative"
                                  >
                                    <motion.span
                                      className="absolute inset-0 bg-neon-lime/50 rounded"
                                      initial={{ opacity: 0 }}
                                      animate={isUpdated ? {
                                        opacity: [0, 0.9, 0.5, 0],
                                      } : {}}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                    <span className="text-gray-400 relative z-10">{'{'}</span>
                                    <span className="text-blue-600 relative z-10">"{tag.name}"</span>
                                    <span className="text-gray-500 relative z-10">: </span>
                                    <motion.span 
                                      className="relative z-10 font-bold"
                                      style={{ 
                                        color: isUpdated ? '#B2ED1D' : '#16a34a',
                                        textShadow: isUpdated ? '0 0 8px #B2ED1D, 0 0 12px #B2ED1D' : 'none'
                                      }}
                                      key={isUpdated || tag.value}
                                      initial={false}
                                      animate={isUpdated ? {
                                        color: ['#16a34a', '#B2ED1D', '#B2ED1D', '#16a34a'],
                                      } : {}}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    >
                                      "{displayValue}"
                                    </motion.span>
                                    <span className="text-gray-400 relative z-10">{'}'}</span>
                                    {idx < module.schema.tags.length - 1 && (
                                      <span className="text-gray-400 relative z-10">,</span>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Children */}
              {hasChildren && (
                <div className="ml-3 border-l border-gray-200 pl-2">
                  {renderTreeNode(value.children, level + 1, currentPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render connection lines between JSON tags in sidebar
  const renderConnectionLines = () => {
    if (!hoveredNode) return null;

    const hoveredModule = modules.find((m) => m.id === hoveredNode);
    if (!hoveredModule) return null;

    const connections = [];

    // Get tags from hovered module - connect each tag to all linked modules' tags
    hoveredModule.schema.tags.forEach((tag, tagIdx) => {
      const tagKey = `${hoveredNode}-${tag.name}`;
      const tagPos = tagPositions[tagKey];
      if (!tagPos || !tagPos.x || !tagPos.y) return;

      // Connect to all linked modules
      linkedModules.forEach((linkedModule) => {
        // Connect to corresponding tag by index for cleaner visualization
        const linkedTag = linkedModule.schema.tags[tagIdx] || linkedModule.schema.tags[0];
        if (linkedTag) {
          const linkedTagKey = `${linkedModule.id}-${linkedTag.name}`;
          const linkedTagPos = tagPositions[linkedTagKey];
          if (linkedTagPos && linkedTagPos.x && linkedTagPos.y) {
            connections.push({
              from: tagPos,
              to: linkedTagPos,
              fromTag: tag,
              toTag: linkedTag,
              fromModule: hoveredModule,
              toModule: linkedModule,
            });
          }
        }
      });
    });

    if (connections.length === 0) {
      return null;
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ 
          width: '100%', 
          height: '100%',
          zIndex: 5,
          overflow: 'visible',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <marker
            id={`arrowhead-tags-${hoveredNode}`}
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="#B2ED1D"
              opacity="1"
              stroke="#B2ED1D"
              strokeWidth="0.5"
            />
          </marker>
          <filter id={`glow-tags-${hoveredNode}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {connections.map((conn, idx) => {
          return (
            <g key={`${conn.fromTag.name}-${conn.toTag.name}-${idx}`}>
              {/* Glow effect behind the line */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#B2ED1D"
                strokeWidth="8"
                strokeOpacity="0.3"
                filter={`url(#glow-tags-${hoveredNode})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              />
              {/* Main connection line - very visible */}
              <motion.line
                x1={conn.from.x}
                y1={conn.from.y}
                x2={conn.to.x}
                y2={conn.to.y}
                stroke="#B2ED1D"
                strokeWidth="3"
                strokeOpacity="1"
                markerEnd={`url(#arrowhead-tags-${hoveredNode})`}
                filter={`url(#glow-tags-${hoveredNode})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              />
              {/* Animated pulse along the line */}
              <motion.circle
                r="5"
                fill="#B2ED1D"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  cx: [conn.from.x, conn.to.x],
                  cy: [conn.from.y, conn.to.y],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: idx * 0.3,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="space-y-3 relative" style={{ minHeight: '100%' }}>
      <div className="mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{t('sidebarTitle')}</h3>
        {hoveredNode && (
          <motion.div
            className="mt-2 text-xs text-gray-600"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-neon-lime font-medium">
              {t(`modules.${modules.find(m => m.id === hoveredNode)?.name.replace(/\s+/g, '')}`) || modules.find(m => m.id === hoveredNode)?.name}
            </span>
            {' '}↔ {t('dataExchangeActive')}
          </motion.div>
        )}
      </div>
      
      {/* Connection Lines Overlay - Sidebar only */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          overflow: 'visible',
          width: '100%',
          height: '100%',
          zIndex: 5,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {renderConnectionLines()}
      </div>
      
      <div className="space-y-2 relative z-10">
        {renderTreeNode(tree)}
      </div>
    </div>
  );
};

export default UnifiedUNSView;

