// localStorage 工具函数

// 保存模块位置
export const saveModulePositions = (positions) => {
  try {
    localStorage.setItem('modulePositions', JSON.stringify(positions));
    return true;
  } catch (error) {
    console.error('保存模块位置失败:', error);
    return false;
  }
};

// 加载模块位置
export const loadModulePositions = () => {
  try {
    const saved = localStorage.getItem('modulePositions');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('加载模块位置失败:', error);
    return null;
  }
};

// 清除保存的位置（恢复默认）
export const clearModulePositions = () => {
  try {
    localStorage.removeItem('modulePositions');
    return true;
  } catch (error) {
    console.error('清除模块位置失败:', error);
    return false;
  }
};

// 保存语言设置
export const saveLanguage = (language) => {
  try {
    localStorage.setItem('language', language);
    return true;
  } catch (error) {
    console.error('保存语言设置失败:', error);
    return false;
  }
};

// 加载语言设置
export const loadLanguage = () => {
  try {
    // 检查 localStorage 是否可用
    if (typeof localStorage === 'undefined' || !localStorage) {
      return 'en';
    }
    const saved = localStorage.getItem('language');
    // 验证保存的值是否有效
    if (saved === 'en' || saved === 'zh') {
      return saved;
    }
    // 如果值无效，返回默认值
    return 'en';
  } catch (error) {
    console.error('加载语言设置失败:', error);
    return 'en';
  }
};

// 保存模块链接
export const saveModuleLink = (moduleId, url) => {
  try {
    const links = loadModuleLinks();
    links[moduleId] = url;
    localStorage.setItem('moduleLinks', JSON.stringify(links));
    return true;
  } catch (error) {
    console.error('保存模块链接失败:', error);
    return false;
  }
};

// 加载模块链接
export const loadModuleLinks = () => {
  try {
    const saved = localStorage.getItem('moduleLinks');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('加载模块链接失败:', error);
    return {};
  }
};

// 获取模块链接
export const getModuleLink = (moduleId) => {
  const links = loadModuleLinks();
  return links[moduleId] || '';
};

