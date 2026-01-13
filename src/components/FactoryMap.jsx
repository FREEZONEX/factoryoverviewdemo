import React, { useState, useCallback, useEffect, useMemo } from 'react';
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

  // 找到 Appbuilder 模块
  const appbuilderModule = useMemo(() => modules.find(m => m.id === 'appbuilder_05'), []);
  
  // 获取 Appbuilder 连接的模块
  const appbuilderConnections = useMemo(() => {
    if (!appbuilderModule) return [];
    return appbuilderModule.linked_nodes.map(id => modules.find(m => m.id === id)).filter(Boolean);
  }, [appbuilderModule]);

  // Factory blueprint background - using mainbackground.png
  const blueprintStyle = {
    backgroundImage: `url(${getAssetPath('/mainbackground.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#fafafa',
  };

  // 渲染 Appbuilder 与其他模块之间的连线
  const renderAppbuilderConnections = () => {
    if (!appbuilderModule || !moduleCoordinates['appbuilder_05']) return null;
    
    const appPos = moduleCoordinates['appbuilder_05'];
    
    return (
      <svg 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* 发光效果 */}
          <filter id="appbuilder-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* 箭头 - 调整大小以适应 viewBox */}
          <marker
            id="appbuilder-arrow"
            markerWidth="3"
            markerHeight="3"
            refX="2.5"
            refY="1"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon
              points="0 0, 3 1, 0 2"
              fill="#B2ED1D"
            />
          </marker>
        </defs>
        
        {appbuilderConnections.map((targetModule, idx) => {
          const targetPos = moduleCoordinates[targetModule.id];
          if (!targetPos) return null;
          
          // 使用百分比值作为坐标 (viewBox 是 0-100)
          const x1 = appPos.x;
          const y1 = appPos.y;
          const x2 = targetPos.x;
          const y2 = targetPos.y;
          
          // 计算贝塞尔曲线控制点
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.4;
          
          // 控制点偏移以创建优美曲线
          const ctrlX = midX + (dy > 0 ? offset : -offset);
          const ctrlY = midY + (dx > 0 ? -offset : offset);
          
          const pathD = `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
          
          return (
            <g key={`appbuilder-${targetModule.id}`}>
              {/* 发光背景线 */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#B2ED1D"
                strokeWidth="1"
                strokeOpacity="0.3"
                filter="url(#appbuilder-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              />
              {/* 主连线 - 虚线动画 */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="#B2ED1D"
                strokeWidth="0.4"
                strokeOpacity="0.9"
                strokeDasharray="2 1"
                markerEnd="url(#appbuilder-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1,
                  strokeDashoffset: [0, -6],
                }}
                transition={{ 
                  pathLength: { duration: 0.8, delay: idx * 0.1 },
                  opacity: { duration: 0.3, delay: idx * 0.1 },
                  strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" }
                }}
              />
              {/* 动态脉冲点 */}
              <motion.circle
                r="0.8"
                fill="#B2ED1D"
                filter="url(#appbuilder-glow)"
                animate={{
                  cx: [x1, ctrlX, x2],
                  cy: [y1, ctrlY, y2],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.3,
                }}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      ...blueprintStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Appbuilder 连线 - 始终显示 */}
      {renderAppbuilderConnections()}

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

