import {
  DescriptionEntry,
  TimelineItem,
  DocumentStatusItem,
} from '../types/inbound';

/**
 * Tạo một description entry mới
 */
export const createDescriptionEntry = (
  content: string,
  author: string = 'System User'
): DescriptionEntry => {
  return {
    id: `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: content.trim(),
    author,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Thêm description mới vào timeline item (không sửa cũ)
 */
export const addTimelineDescription = (
  item: TimelineItem,
  content: string,
  author: string = 'System User'
): TimelineItem => {
  if (!content.trim()) return item;

  const newEntry = createDescriptionEntry(content, author);
  const existingDescriptions = item.descriptions || [];

  // Nếu có description cũ (backward compatibility), chuyển thành entry đầu tiên
  if (item.description && !existingDescriptions.length) {
    const oldEntry = createDescriptionEntry(item.description, 'Legacy User');
    existingDescriptions.push(oldEntry);
  }

  return {
    ...item,
    descriptions: [...existingDescriptions, newEntry],
    // Giữ description cũ để backward compatibility
    description: item.description || content,
  };
};

/**
 * Thêm description mới vào document status item (không sửa cũ)
 */
export const addDocumentStatusDescription = (
  item: DocumentStatusItem,
  content: string,
  author: string = 'System User'
): DocumentStatusItem => {
  if (!content.trim()) return item;

  const newEntry = createDescriptionEntry(content, author);
  const existingDescriptions = item.descriptions || [];

  // Nếu có description cũ (backward compatibility), chuyển thành entry đầu tiên
  if (item.description && !existingDescriptions.length) {
    const oldEntry = createDescriptionEntry(item.description, 'Legacy User');
    existingDescriptions.push(oldEntry);
  }

  return {
    ...item,
    descriptions: [...existingDescriptions, newEntry],
    // Giữ description cũ để backward compatibility
    description: item.description || content,
  };
};

/**
 * Lấy description mới nhất từ timeline item
 */
export const getLatestTimelineDescription = (item: TimelineItem): string => {
  if (item.descriptions && item.descriptions.length > 0) {
    return item.descriptions[item.descriptions.length - 1].content;
  }
  return item.description || '';
};

/**
 * Lấy description mới nhất từ document status item
 */
export const getLatestDocumentStatusDescription = (
  item: DocumentStatusItem
): string => {
  if (item.descriptions && item.descriptions.length > 0) {
    return item.descriptions[item.descriptions.length - 1].content;
  }
  return item.description || '';
};

/**
 * Format description history để hiển thị
 */
export const formatDescriptionHistory = (
  descriptions: DescriptionEntry[]
): string => {
  if (!descriptions || descriptions.length === 0) return '';

  return descriptions
    .map((desc, index) => {
      const date = new Date(desc.timestamp).toLocaleString('vi-VN');
      return `${index + 1}. [${date}] ${desc.author}: ${desc.content}`;
    })
    .join('\n');
};

/**
 * Lấy user hiện tại từ session
 */
export const getCurrentUser = (): string => {
  try {
    // Lấy từ sessionManager
    const storedSession = localStorage.getItem('mia_session');
    if (storedSession) {
      const session = JSON.parse(storedSession);
      const userName =
        session.user?.fullName || session.user?.email || session.user?.id;
      if (userName) return userName;
    }
  } catch (error) {
    console.warn('Failed to get current user from session:', error);
  }

  // Fallback
  return localStorage.getItem('currentUser') || 'System User';
};
