import React from 'react';
import { motion } from 'framer-motion';

const ConnectivityMesh = ({ modules, hoveredNode, unsSpine, nodePositions }) => {
  if (!hoveredNode) return null;

  const hoveredModule = modules.find((m) => m.id === hoveredNode);
  if (!hoveredModule) return null;

  // Calculate positions as percentages (will be converted to viewBox coordinates)
  const getNodePositionPercent = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return null;
    return {
      x: parseFloat(module.coordinates.left),
      y: parseFloat(module.coordinates.top),
    };
  };

  const spinePosPercent = {
    x: parseFloat(unsSpine.left),
    y: parseFloat(unsSpine.top),
  };

  const hoveredPosPercent = getNodePositionPercent(hoveredNode);
  if (!hoveredPosPercent) return null;

  // Draw connections: hovered node -> UNS spine -> linked nodes
  const linkedModules = modules.filter((m) => 
    hoveredModule.linked_nodes.includes(m.id)
  );

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Connection from hovered node to UNS spine */}
      <motion.line
        x1={hoveredPosPercent.x}
        y1={hoveredPosPercent.y}
        x2={spinePosPercent.x}
        y2={spinePosPercent.y}
        stroke="#B2ED1D"
        strokeWidth="0.3"
        strokeOpacity={0.6}
        strokeDasharray="1 1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.5 }}
      />

      {/* Connections from UNS spine to linked nodes */}
      {linkedModules.map((linkedModule, index) => {
        const linkedPosPercent = getNodePositionPercent(linkedModule.id);
        if (!linkedPosPercent) return null;

        return (
          <motion.line
            key={linkedModule.id}
            x1={spinePosPercent.x}
            y1={spinePosPercent.y}
            x2={linkedPosPercent.x}
            y2={linkedPosPercent.y}
            stroke="#B2ED1D"
            strokeWidth="0.3"
            strokeOpacity={0.5}
            strokeDasharray="1 1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1,
            }}
          />
        );
      })}

      {/* Animated pulse along the lines */}
      {linkedModules.map((linkedModule, index) => {
        const linkedPosPercent = getNodePositionPercent(linkedModule.id);
        if (!linkedPosPercent) return null;

        return (
          <motion.circle
            key={`pulse-${linkedModule.id}`}
            r="0.4"
            fill="#B2ED1D"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              cx: [spinePosPercent.x, linkedPosPercent.x],
              cy: [spinePosPercent.y, linkedPosPercent.y],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "linear",
            }}
          />
        );
      })}
    </svg>
  );
};

export default ConnectivityMesh;

