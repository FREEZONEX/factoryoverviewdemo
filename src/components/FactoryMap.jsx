import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModuleNode from './ModuleNode';
import { modules, unsSpine } from '../config/modules';
import { saveModulePositions, loadModulePositions } from '../utils/storage';
import { getAssetPath } from '../utils/paths';

const FactoryMap = ({ onNodeHover, onNodeClick, hoveredNode, selectedNode }) => {
  const [nodePositions, setNodePositions] = useState({});
  const [moduleCoordinates, setModuleCoordinates] = useState(() => {
    // 先尝试从 localStorage 加载保存的位置
    const saved = loadModulePositions();
    if (saved) {
      return saved;
    }
    // 否则使用默认位置
    const coords = {};
    modules.forEach(module => {
      coords[module.id] = {
        x: parseFloat(module.coordinates.left),
        y: parseFloat(module.coordinates.top),
      };
    });
    return coords;
  });

  const handlePositionUpdate = useCallback((id, position) => {
    setNodePositions((prev) => ({ ...prev, [id]: position }));
  }, []);

  const handleCoordinateUpdate = useCallback((id, coordinates) => {
    setModuleCoordinates((prev) => {
      const updated = {
        ...prev,
        [id]: coordinates,
      };
      // 自动保存到 localStorage
      saveModulePositions(updated);
      return updated;
    });
  }, []);

  // Factory blueprint background - using mainbackground.png
  const blueprintStyle = {
    backgroundImage: `url(${getAssetPath('/mainbackground.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#fafafa',
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      ...blueprintStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>


      {/* Module Nodes */}
      {modules.map((module) => (
        <ModuleNode
          key={module.id}
          module={module}
          onHover={onNodeHover}
          onClick={onNodeClick}
          isHovered={hoveredNode === module.id}
          isSelected={selectedNode === module.id}
          onPositionUpdate={handlePositionUpdate}
          onCoordinateUpdate={handleCoordinateUpdate}
          coordinates={moduleCoordinates[module.id]}
        />
      ))}
    </div>
  );
};

export default FactoryMap;

