import React from 'react';
import { motion } from 'framer-motion';
import { modules } from '../config/modules';

const FullJSONView = ({ hoveredNode }) => {
  // Check if module should be highlighted
  const isModuleHighlighted = (moduleId) => {
    return hoveredNode === moduleId;
  };

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Module Data Overview</h3>
        <div className="text-xs text-gray-500">
          Hover over modules to highlight
        </div>
      </div>
      <div className="space-y-2">
        {modules.map((module) => {
          const isHighlighted = isModuleHighlighted(module.id);
          return (
            <motion.div
              key={module.id}
              className={`p-2 rounded border transition-all ${
                isHighlighted
                  ? 'bg-neon-lime/20 border-neon-lime/50'
                  : 'bg-white/30 border-gray-200/50'
              }`}
              animate={{
                backgroundColor: isHighlighted ? 'rgba(178, 237, 29, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                borderColor: isHighlighted ? 'rgba(178, 237, 29, 0.5)' : 'rgba(229, 231, 235, 0.5)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className={`text-xs font-semibold mb-1 ${
                    isHighlighted ? 'text-neon-lime' : 'text-gray-700'
                  }`}>
                    {module.name}
                  </div>
                  <div className="text-xs text-gray-600 font-mono mb-1">
                    {module.uns_path}
                  </div>
                  <div className="text-xs text-gray-500">
                    {module.schema.tags.length} tags • {module.linked_nodes.length} links
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Sample Tags:</div>
                  <div className="space-y-0.5">
                    {module.schema.tags.slice(0, 2).map((tag, idx) => (
                      <div key={idx} className="text-xs text-gray-600 font-mono">
                        {tag.name.split('.').pop()}: <span className="text-green-600">{tag.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FullJSONView;

