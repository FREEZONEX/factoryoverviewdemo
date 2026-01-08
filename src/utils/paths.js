/**
 * 获取带 base URL 的资源路径
 * @param {string} path - 资源路径（以 / 开头）
 * @returns {string} 完整的资源路径
 */
export const getAssetPath = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // 确保 baseUrl 以 / 结尾，path 以 / 开头
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
};

