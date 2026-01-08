import React, { useState, useRef, useEffect } from 'react';

const ResizableSidebar = ({ children, defaultWidth = 35, minWidth = 25, maxWidth = 50 }) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const container = sidebarRef.current?.parentElement;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  return (
    <>
      <div
        ref={sidebarRef}
        className="flex-shrink-0 border-r border-gray-200 bg-white overflow-hidden"
        style={{ width: `${width}%` }}
      >
        {children}
      </div>
      <div
        className="flex-shrink-0 w-1 cursor-col-resize hover:bg-neon-lime/30 transition-colors group relative"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-300 group-hover:bg-neon-lime transition-colors" />
      </div>
    </>
  );
};

export default ResizableSidebar;


