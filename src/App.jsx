import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import GlobalCommandHeader from './components/GlobalCommandHeader';
import FactoryMap from './components/FactoryMap';
import ModulePopup from './components/ModulePopup';
import UnifiedUNSView from './components/UnifiedUNSView';
import ResizableSidebar from './components/ResizableSidebar';

function App() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeHover = (nodeId) => {
    setHoveredNode(nodeId);
  };

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleClosePopup = () => {
    setSelectedNode(null);
  };

  return (
    <LanguageProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
        {/* Global Command Header - Top */}
        <div className="flex-shrink-0">
          <GlobalCommandHeader hoveredNode={hoveredNode} />
        </div>

        {/* Main Content Area - Sidebar + Map */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - UNS View with Resize */}
          <ResizableSidebar defaultWidth={25} minWidth={20} maxWidth={50}>
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="p-5">
                <UnifiedUNSView hoveredNode={hoveredNode} />
              </div>
            </div>
          </ResizableSidebar>

          {/* Right Side - Factory Map Canvas */}
          <div className="flex-1 relative min-w-0">
            <FactoryMap
              onNodeHover={handleNodeHover}
              onNodeClick={handleNodeClick}
              hoveredNode={hoveredNode}
              selectedNode={selectedNode}
            />
          </div>
        </div>

        {/* Module Popup Modal */}
        <ModulePopup selectedNode={selectedNode} onClose={handleClosePopup} />
      </div>
    </LanguageProvider>
  );
}

export default App;

