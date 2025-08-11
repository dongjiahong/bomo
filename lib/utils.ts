import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并并处理 Tailwind CSS 类名
 * 使用 clsx 处理条件类名，使用 twMerge 处理冲突的 Tailwind 类
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 延迟执行函数
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 生成随机 ID
 */
export function generateId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const copy = {} as T;
    Object.keys(obj).forEach(key => {
      (copy as any)[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  return obj;
}

/**
 * 检查是否为空值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 相对时间格式化
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (weeks < 4) return `${weeks}周前`;
  if (months < 12) return `${months}个月前`;
  return `${years}年前`;
}

/**
 * URL 参数处理
 */
export function parseUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * 构建 URL 参数
 */
export function buildUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// ============ BOMO 项目特定工具函数 ============

/**
 * 截断文本并添加省略号
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * 从 Markdown 内容中提取纯文本
 */
export function extractTextFromMarkdown(markdown: string): string {
  return markdown
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`[^`]*`/g, '')
    // 移除链接，保留文本
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除图片
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除加粗和斜体标记
    .replace(/\*{1,2}([^*]*)\*{1,2}/g, '$1')
    // 移除删除线
    .replace(/~~([^~]*)~~/g, '$1')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除列表标记
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 清理多余的空格和换行
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 生成笔记预览文本
 */
export function generateNotePreview(content: string, maxLength: number = 150): string {
  const plainText = extractTextFromMarkdown(content);
  return truncateText(plainText, maxLength);
}

/**
 * 计算阅读时间（基于中文字符）
 */
export function calculateReadingTime(text: string): { minutes: number; words: number } {
  const plainText = extractTextFromMarkdown(text);
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = plainText.match(/[a-zA-Z]+/g) || [];
  
  // 中文字符数 + 英文单词数
  const totalWords = chineseChars.length + englishWords.length;
  
  // 中文平均阅读速度：300字/分钟，英文：200词/分钟
  const avgSpeed = 250;
  const minutes = Math.ceil(totalWords / avgSpeed);
  
  return {
    minutes: Math.max(1, minutes),
    words: totalWords
  };
}

/**
 * 格式化进度百分比
 */
export function formatProgress(current: number, target: number): string {
  if (target === 0) return '0%';
  const percentage = Math.min((current / target) * 100, 100);
  return `${Math.round(percentage)}%`;
}

/**
 * 获取进度状态颜色
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600';
  if (percentage >= 75) return 'text-blue-600';
  if (percentage >= 50) return 'text-yellow-600';
  if (percentage >= 25) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * 验证标签颜色格式
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * 生成随机标签颜色
 */
export function generateRandomTagColor(): string {
  const colors = [
    '#2563eb', '#dc2626', '#059669', '#d97706',
    '#7c3aed', '#db2777', '#0891b2', '#65a30d',
    '#4f46e5', '#e11d48', '#0d9488', '#ca8a04',
    '#8b5cf6', '#f59e0b', '#06b6d4', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 检查是否为深色
 */
export function isDarkColor(hex: string): boolean {
  // 移除 # 符号
  const color = hex.replace('#', '');
  
  // 转换为 RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // 计算亮度 (0-255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 小于 128 认为是深色
  return brightness < 128;
}

/**
 * 排序选项常量
 */
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  MOST_USED: 'most_used',
  PROGRESS_HIGH: 'progress_high',
  PROGRESS_LOW: 'progress_low'
} as const;

/**
 * 构建排序查询参数
 */
export function buildSortQuery(sortBy: string) {
  switch (sortBy) {
    case SORT_OPTIONS.NEWEST:
      return { updatedAt: 'desc' };
    case SORT_OPTIONS.OLDEST:
      return { updatedAt: 'asc' };
    case SORT_OPTIONS.TITLE_ASC:
      return { title: 'asc' };
    case SORT_OPTIONS.TITLE_DESC:
      return { title: 'desc' };
    default:
      return { updatedAt: 'desc' };
  }
}

/**
 * 计算距离截止日期的天数
 */
export function getDaysUntilDeadline(deadline: Date | string): number {
  const now = new Date();
  const target = new Date(deadline);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 格式化截止日期状态
 */
export function formatDeadlineStatus(deadline: Date | string): {
  text: string;
  color: string;
  isOverdue: boolean;
} {
  const days = getDaysUntilDeadline(deadline);
  
  if (days < 0) {
    return {
      text: `已过期 ${Math.abs(days)} 天`,
      color: 'text-red-600',
      isOverdue: true
    };
  }
  
  if (days === 0) {
    return {
      text: '今天到期',
      color: 'text-orange-600',
      isOverdue: false
    };
  }
  
  if (days <= 3) {
    return {
      text: `${days} 天后到期`,
      color: 'text-yellow-600',
      isOverdue: false
    };
  }
  
  if (days <= 7) {
    return {
      text: `${days} 天后到期`,
      color: 'text-blue-600',
      isOverdue: false
    };
  }
  
  return {
    text: `${days} 天后到期`,
    color: 'text-gray-600',
    isOverdue: false
  };
}