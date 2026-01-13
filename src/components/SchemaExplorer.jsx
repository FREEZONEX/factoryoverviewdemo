import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '../config/modules';

const SchemaExplorer = ({ hoveredNode }) => {
  const hoveredModule = hoveredNode ? modules.find((m) => m.id === hoveredNode) : null;

  return (
    <AnimatePresence>
      {hoveredModule && (
        <motion.div
          className="glass-strong border-b border-gray-200 shadow-sm"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {hoveredModule.name}
                </h2>
                <p className="text-sm text-gray-600 font-mono">
                  UNS: {hoveredModule.uns_path}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-lime animate-pulse" />
                <span className="text-xs text-gray-600 font-medium">LIVE</span>
              </div>
            </div>

            {/* Schema Blade - JSON-like visualization */}
            <div className="bg-gray-50/50 rounded-lg border border-gray-200 p-4 font-mono text-sm">
              <div className="text-gray-500 mb-2">{'{'}</div>
              <div className="ml-4 space-y-2">
                {hoveredModule.schema.tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-gray-400">
                      "{tag.name}":
                    </span>
                    <span className="text-gray-600">{'{'}</span>
                    <span className="text-blue-600">type</span>
                    <span className="text-gray-600">:</span>
                    <span className="text-purple-600">"{tag.type}"</span>
                    <span className="text-gray-600">,</span>
                    <span className="text-blue-600 ml-2">value</span>
                    <span className="text-gray-600">:</span>
                    <span className="text-green-600 font-semibold">"{tag.value}"</span>
                    <span className="text-gray-600">,</span>
                    <span className="text-blue-600 ml-2">protocol</span>
                    <span className="text-gray-600">:</span>
                    <span className="text-orange-600">"{tag.protocol}"</span>
                    <span className="text-gray-600">{'}'}</span>
                    {index < hoveredModule.schema.tags.length - 1 && (
                      <span className="text-gray-600">,</span>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="text-gray-500 mt-2">{'}'}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SchemaExplorer;



