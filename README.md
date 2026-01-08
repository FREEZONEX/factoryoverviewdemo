# UNS-Centric Industrial Digital Hub (Executive Suite)

A high-end React portal demonstrating the Unified Namespace (UNS) as the living digital backbone of an industrial facility. This application visualizes how physical assets map to a logical hierarchy and how data from one module autonomously influences others through the UNS.

## Features

### 🏭 Spatial Navigation Engine
- Large, minimalist factory blueprint as the central canvas
- Interactive module nodes precisely positioned using percentage coordinates
- Subtle "breathing" pulse animation in Neon Lime (#B2ED1D) for active nodes

### 📊 Dynamic Schema Explorer
- Top header (15-20% of screen) expands on hover to show live UNS data
- Real-time peek at module telemetry without clicking
- JSON-like visualization of Tags, Types, Values, and Protocols

### 🔗 Inter-Module Connectivity Visualization
- Hover-triggered UNS linkage visualization
- Glowing pulse lines in Neon Lime showing data flow through the UNS spine
- Demonstrates SSOT (Single Source of Truth) - modules synchronized via UNS, not directly connected

### 🖼️ Rich-Media Control Popups
- Deep-dive modals with high-quality illustrative images
- Detailed UNS telemetry tables
- Module relationship visualization

## Design Philosophy

**Theme:** "Clean Room Modern"
- Light-themed, clinical, high-contrast, and airy
- Glassmorphism effects with subtle borders
- Precise typography
- Neon Lime (#B2ED1D) represents active data flow

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations and transitions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

```bash
npm run build
```

### Docker

#### 构建镜像

```bash
docker build -t uns-driven-factory:latest .
```

#### 构建镜像

镜像只包含构建产物，不运行服务器。构建产物在容器的 `/app/dist` 目录。

#### 使用 Kong Serve

**方式 1：挂载构建产物到 Kong**

```bash
# 构建镜像
docker build -t uns-driven-factory:latest .

# 运行容器并挂载构建产物
docker run --rm -v /path/to/kong/static:/app/dist uns-driven-factory:latest

# 或者直接复制构建产物
docker create --name temp uns-driven-factory:latest
docker cp temp:/app/dist ./dist
docker rm temp
```

**方式 2：Kong 直接访问容器内的构建产物**

在 Kong 中配置路由，指向容器的 `/app/dist` 目录。

**配置说明**：
- 前端项目已配置 `base: '/overview'`（在 `vite.config.js` 中）
- 所有资源路径会自动添加 `/overview` 前缀
- Kong 需要配置路由将 `/overview` 路径指向构建产物目录

## Architecture

### Module Configuration

Modules are centrally configured in `src/config/modules.js` with:
- Spatial coordinates (top/left percentages)
- UNS paths (hierarchical namespace)
- Linked nodes (showing UNS-mediated relationships)
- Schema definitions (Tags with Types, Values, Protocols)

### Component Structure

- `App.jsx` - Main application container
- `GlobalCommandHeader.jsx` - Top HUD with schema explorer
- `FactoryMap.jsx` - Main canvas with blueprint background
- `ModuleNode.jsx` - Interactive node components
- `ConnectivityMesh.jsx` - UNS linkage visualization
- `SchemaExplorer.jsx` - Expandable header showing live data
- `ModulePopup.jsx` - Detailed module view modal

## UNS Architecture

The Unified Namespace (UNS) is visualized as:
- **Central Spine**: Vertical and horizontal lines at 50% position
- **Module Nodes**: Physical assets positioned on the blueprint
- **Data Flow**: Pulse animations showing data traveling from nodes → UNS spine → linked nodes

This demonstrates that modules are not directly connected but synchronized through the UNS backbone, ensuring a Single Source of Truth (SSOT).


