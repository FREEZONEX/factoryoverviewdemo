import React from 'react';
import { motion } from 'framer-motion';
import { modules } from '../config/modules';

const UNSTreeView = ({ hoveredNode }) => {
  // Build tree structure from UNS paths
  const buildTree = () => {
    const tree = {};
    
    modules.forEach((module) => {
      const pathParts = module.uns_path.split('/');
      let current = tree;
      
      pathParts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            name: part,
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

  // Render tree node
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

          return (
            <div key={key} className="mb-0.5">
              <motion.div
                className={`flex items-center gap-2 py-0.5 px-2 rounded transition-all ${
                  highlighted || moduleMatch
                    ? 'bg-neon-lime/20 border-l-2 border-neon-lime'
                    : 'hover:bg-gray-50'
                }`}
                animate={{
                  backgroundColor: highlighted || moduleMatch ? 'rgba(178, 237, 29, 0.2)' : 'transparent',
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-gray-400 text-xs font-mono">
                  {level > 0 ? '└─ ' : ''}
                </span>
                <span
                  className={`font-mono text-xs font-medium ${
                    highlighted || moduleMatch ? 'text-neon-lime' : 'text-gray-700'
                  }`}
                >
                  {key}
                </span>
                {hasModule && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({value.modules.map((m) => m.name).join(', ')})
                  </span>
                )}
              </motion.div>
              {hasChildren && (
                <div className="ml-4 border-l border-gray-200 pl-2">
                  {renderTreeNode(value.children, level + 1, currentPath)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">UNS Namespace Tree</h3>
        <div className="text-xs text-gray-500">
          Hover over modules to highlight paths
        </div>
      </div>
      <div className="font-mono text-xs">
        {renderTreeNode(tree)}
      </div>
    </div>
  );
};

export default UNSTreeView;

