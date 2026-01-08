import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useDragControls } from 'framer-motion';
import { MESIcon, WMSIcon, ProcessOptIcon, SupplyChainIcon, DefaultIcon } from './ModuleIcons';
import { useLanguage } from '../i18n/LanguageContext';

const ModuleNode = ({ 
  module, 
  onHover, 
  onClick, 
  isHovered, 
  isSelected,
  onPositionUpdate,
  onCoordinateUpdate,
  coordinates
}) => {
  const { t } = useLanguage();
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 获取模块的翻译名称
  const getModuleName = () => {
    const key = module.name.replace(/\s+/g, '');
    return t(`modules.${key}`) || module.name;
  };
  const [position, setPosition] = useState(() => {
    if (coordinates) {
      return { x: coordinates.x, y: coordinates.y };
    }
    return {
      x: parseFloat(module.coordinates.left),
      y: parseFloat(module.coordinates.top),
    };
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  useEffect(() => {
    if (nodeRef.current && onPositionUpdate) {
      const updatePosition = () => {
        const rect = nodeRef.current.getBoundingClientRect();
        const parent = nodeRef.current.offsetParent;
        const parentRect = parent?.getBoundingClientRect() || { left: 0, top: 0 };
        
        onPositionUpdate(module.id, {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + rect.height / 2,
        });
      };

      // Initial update
      updatePosition();

      // Update on resize
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [module.id, onPositionUpdate, position]);

  const handleMouseEnter = () => {
    if (!isDragging) {
      onHover(module.id);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      onHover(null);
    }
  };

  const handleClick = (e) => {
    if (!isDragging) {
      onClick(module.id);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    // Update position based on drag
    const parent = nodeRef.current?.offsetParent;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const currentX = parseFloat(position.x);
      const currentY = parseFloat(position.y);
      
      // Calculate new position in percentage
      const offsetXPercent = (info.offset.x / parentRect.width) * 100;
      const offsetYPercent = (info.offset.y / parentRect.height) * 100;
      
      const newX = currentX + offsetXPercent;
      const newY = currentY + offsetYPercent;
      
      // Clamp to bounds (keep some margin from edges)
      const clampedX = Math.max(5, Math.min(95, newX));
      const clampedY = Math.max(5, Math.min(95, newY));
      
      const newPosition = { x: clampedX, y: clampedY };
      setPosition(newPosition);
      
      // Notify parent of coordinate change
      if (onCoordinateUpdate) {
        onCoordinateUpdate(module.id, newPosition);
      }
      
      // Reset drag offset
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      ref={nodeRef}
      className="absolute cursor-grab active:cursor-grabbing z-20"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        x,
        y,
        transform: 'translate(-50%, -50%)',
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onDragStart={handleDragStart}
      onDrag={(event, info) => {
        x.set(info.offset.x);
        y.set(info.offset.y);
      }}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileDrag={{ 
        scale: 1.25,
        zIndex: 30,
        cursor: 'grabbing',
        rotate: [0, -2, 2, -2, 0]
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isHovered ? 1.15 : isSelected ? 1.1 : isDragging ? 1.2 : 1,
        opacity: 1,
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(178, 237, 29, ${isHovered ? 0.6 : isSelected ? 0.5 : 0.3}), transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: isHovered ? [0.5, 0.8, 0.5] : isSelected ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 pointer-events-none"
        style={{
          borderColor: isHovered || isSelected ? '#B2ED1D' : '#9ca3af',
          borderWidth: isHovered || isSelected ? '3px' : '2px',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: isHovered ? [0.7, 1, 0.7] : isSelected ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main node container */}
      <div className="relative z-10 pointer-events-none">
        <motion.div
          className={`w-32 h-32 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all ${
            isHovered || isSelected
              ? 'border-neon-lime shadow-neon-lime/50'
              : 'border-gray-300 shadow-gray-400/30'
          }`}
          style={{
            borderWidth: isHovered || isSelected ? '4px' : '3px',
            borderStyle: 'solid',
          }}
          animate={{
            boxShadow: isHovered || isSelected
              ? '0 12px 32px rgba(178, 237, 29, 0.6), 0 0 0 6px rgba(178, 237, 29, 0.2), 0 0 40px rgba(178, 237, 29, 0.4)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)',
            scale: isHovered ? [1, 1.05, 1] : isSelected ? 1.02 : 1,
          }}
          transition={{ 
            duration: isHovered ? 1.5 : 0.3,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Inner circle with icon/image */}
          <motion.div
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner overflow-hidden relative ${
              isHovered || isSelected ? 'ring-4 ring-neon-lime' : ''
            }`}
            style={{
              background: isHovered || isSelected 
                ? 'linear-gradient(135deg, rgba(178, 237, 29, 0.3), rgba(178, 237, 29, 0.1))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.9))'
            }}
            animate={{
              scale: isHovered ? [1, 1.1, 1] : isSelected ? 1.05 : 1,
              rotate: isHovered ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 1.2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {/* Module icon */}
            <div className="flex items-center justify-center">
              {module.name === 'MES' && (
                <MESIcon 
                  size={56} 
                  color={isHovered || isSelected ? '#B2ED1D' : '#374151'} 
                />
              )}
              {module.name === 'WMS' && (
                <WMSIcon 
                  size={56} 
                  color={isHovered || isSelected ? '#B2ED1D' : '#374151'} 
                />
              )}
              {module.name === 'Process Optimization' && (
                <ProcessOptIcon 
                  size={56} 
                  color={isHovered || isSelected ? '#B2ED1D' : '#374151'} 
                />
              )}
              {module.name === 'Supply Chain Control Tower' && (
                <SupplyChainIcon 
                  size={56} 
                  color={isHovered || isSelected ? '#B2ED1D' : '#374151'} 
                />
              )}
              {!['MES', 'WMS', 'Process Optimization', 'Supply Chain Control Tower'].includes(module.name) && (
                <DefaultIcon 
                  size={56} 
                  color={isHovered || isSelected ? '#B2ED1D' : '#374151'}
                  letter={module.name.charAt(0)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Status indicator dot */}
        <motion.div
          className="absolute top-0 right-0 w-5 h-5 rounded-full bg-neon-lime border-2 border-white shadow-lg pointer-events-none"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.7, 1],
            boxShadow: [
              '0 0 0 0 rgba(178, 237, 29, 0.7)',
              '0 0 0 8px rgba(178, 237, 29, 0)',
              '0 0 0 0 rgba(178, 237, 29, 0)'
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Node label */}
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isHovered || isSelected ? 1 : 0.8,
            y: isHovered || isSelected ? 0 : -5,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className={`px-7 py-3 rounded-lg text-lg font-bold border-2 shadow-lg backdrop-blur-sm ${
            isHovered || isSelected
              ? 'bg-neon-lime/90 text-gray-900 border-neon-lime/50'
              : 'bg-white/90 text-gray-700 border-gray-200'
          }`}>
            {getModuleName()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModuleNode;

