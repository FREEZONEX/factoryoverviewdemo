import React from 'react';
import { 
  HiOutlineCog,           // MES - 齿轮/生产
  HiOutlineCube,          // WMS - 立方体/仓储
  HiOutlineChartBar,      // Process Optimization - 图表/优化
  HiOutlineTruck,         // Supply Chain - 卡车/物流
} from 'react-icons/hi2';

// MES - 生产制造图标
export const MESIcon = ({ size = 48, color = '#374151' }) => (
  <HiOutlineCog size={size} color={color} />
);

// WMS - 仓储管理图标
export const WMSIcon = ({ size = 48, color = '#374151' }) => (
  <HiOutlineCube size={size} color={color} />
);

// Process Optimization - 流程优化图标
export const ProcessOptIcon = ({ size = 48, color = '#374151' }) => (
  <HiOutlineChartBar size={size} color={color} />
);

// Supply Chain - 物流/供应链图标
export const SupplyChainIcon = ({ size = 48, color = '#374151' }) => (
  <HiOutlineTruck size={size} color={color} />
);

// 默认图标（字母）
export const DefaultIcon = ({ size = 48, color = '#374151', letter }) => (
  <div 
    style={{ 
      width: size, 
      height: size, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: color,
      fontSize: size * 0.4,
      fontWeight: 'bold',
      fontFamily: "'IBM Plex Mono', monospace"
    }}
  >
    {letter}
  </div>
);

