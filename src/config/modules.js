// Centralized module configuration with UNS paths and spatial coordinates
import { getAssetPath } from '../utils/paths.js';

export const modules = [
  {
    id: "mes_01",
    name: "MES",
    coordinates: { top: "50%", left: "50%" },
    uns_path: "Site/Area/Production/MES",
    imageUrl: getAssetPath('/MES.png'),
    linked_nodes: ["wms_02", "lims_03", "sct_04", "appbuilder_05"],
    metrics: {
      buildTime: "4-8 weeks",
      valueCreation: "连接人与设备，增强自动化",
      features: "使用自然语言构建，适配任何工厂独特的流程，随时更改"
    },
    schema: {
      tags: [
        { name: "MES.Production_Rate", type: "Float", value: "94.2%", protocol: "OPC-UA" },
        { name: "MES.Active_Orders", type: "Int", value: "12", protocol: "OPC-UA" },
        { name: "MES.Equipment_Status", type: "String", value: "Running", protocol: "OPC-UA" },
        { name: "MES.OEE", type: "Float", value: "87.5%", protocol: "OPC-UA" },
      ]
    }
  },
  {
    id: "wms_02",
    name: "WMS",
    coordinates: { top: "75%", left: "75%" },
    uns_path: "Site/Area/Warehouse/WMS",
    imageUrl: getAssetPath('/wms.png'),
    linked_nodes: ["mes_01", "sct_04", "appbuilder_05"],
    metrics: {
      buildTime: "1-2 weeks",
      valueCreation: "精准记录货品动向，原材料追溯，优化库位利用率",
      features: "与任何agv、扫码、pda设备集成，适配企业定制流程，随时更改"
    },
    schema: {
      tags: [
        { name: "WMS.Inventory_Level", type: "Int", value: "1250 units", protocol: "MQTT" },
        { name: "WMS.Storage_Capacity", type: "Float", value: "78%", protocol: "MQTT" },
        { name: "WMS.Picking_Efficiency", type: "Float", value: "92.3%", protocol: "MQTT" },
        { name: "WMS.Active_Shipments", type: "Int", value: "8", protocol: "MQTT" },
      ]
    }
  },
  {
    id: "lims_03",
    name: "Process Optimization",
    coordinates: { top: "75%", left: "25%" },
    uns_path: "Site/Area/Optimization/ProcessOpt",
    imageUrl: getAssetPath('/LIMS.png'),
    linked_nodes: ["mes_01", "sct_04", "appbuilder_05"],
    metrics: {
      buildTime: "1-3 weeks",
      valueCreation: "能耗下降、质量产量提升、减少非计划停机",
      features: "无需编码技能、和任何控制系统集成"
    },
    schema: {
      tags: [
        { name: "PO.Efficiency_Score", type: "Float", value: "96.8%", protocol: "REST" },
        { name: "PO.Optimization_Cycles", type: "Int", value: "24", protocol: "REST" },
        { name: "PO.Energy_Savings", type: "Float", value: "12.5%", protocol: "REST" },
        { name: "PO.Last_Update", type: "DateTime", value: "2024-01-15 10:15", protocol: "REST" },
      ]
    }
  },
  {
    id: "sct_04",
    name: "Supply Chain Control Tower",
    coordinates: { top: "25%", left: "25%" },
    uns_path: "Site/Area/Planning/SupplyChain",
    imageUrl: getAssetPath('/supplychaincontroltower.png'),
    linked_nodes: ["mes_01", "wms_02", "lims_03", "appbuilder_05"],
    metrics: {
      buildTime: "1-3 weeks",
      valueCreation: "精算成本和交付周期，避免供应链中断",
      features: "与任何系统集成，适配企业的特殊流程，随时做出更改"
    },
    schema: {
      tags: [
        { name: "SCT.Demand_Forecast", type: "Float", value: "1250 units", protocol: "REST" },
        { name: "SCT.Supply_Chain_Health", type: "Float", value: "94.2%", protocol: "REST" },
        { name: "SCT.Lead_Time", type: "Float", value: "5.2 days", protocol: "REST" },
        { name: "SCT.Risk_Level", type: "String", value: "Low", protocol: "REST" },
      ]
    }
  },
  {
    id: "appbuilder_05",
    name: "Appbuilder",
    coordinates: { top: "25%", left: "75%" },
    uns_path: "Site/Area/Development/Appbuilder",
    imageUrl: getAssetPath('/appbuilder.png'),
    linked_nodes: ["mes_01", "wms_02", "lims_03", "sct_04"],
    isSpecial: true, // 标记为特殊 widget，使用特殊弹窗布局
    specialFeatures: [
      {
        key: "feature1",
        icon: "sparkles",
        zh: "不仅是Dashboard/UI，自动实现复杂的交互功能",
        en: "Not just Dashboard/UI - automatically implements complex interactive features"
      },
      {
        key: "feature2", 
        icon: "link",
        zh: "自动配置和设备与系统的集成",
        en: "Auto-configures device and system integrations"
      },
      {
        key: "feature3",
        icon: "uns",
        zh: "UNS native，原生集成至UNS",
        en: "UNS native - natively integrated with UNS"
      }
    ],
    schema: {
      tags: [
        { name: "AB.Apps_Created", type: "Int", value: "156", protocol: "REST" },
        { name: "AB.Active_Users", type: "Int", value: "42", protocol: "REST" },
        { name: "AB.Integrations", type: "Int", value: "28", protocol: "REST" },
        { name: "AB.UNS_Status", type: "String", value: "Connected", protocol: "UNS" },
      ]
    }
  }
];

// UNS Central Spine coordinates (visual center point)
export const unsSpine = {
  top: "50%",
  left: "50%"
};

