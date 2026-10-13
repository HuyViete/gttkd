import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng thời gian tương đối bằng tiếng Việt
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;

    // Định dạng ngày tháng năm DD/MM/YYYY
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  } catch {
    return dateString;
  }
}

/**
 * Định dạng ngày (YYYY-MM-DD -> DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  try {
    const [y, m, d] = dateString.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return dateString;
  } catch {
    return dateString;
  }
}

/**
 * Làm sạch số điện thoại
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Tạo link Zalo từ số điện thoại
 */
export function getZaloUrl(contactValue: string): string {
  const cleaned = cleanPhoneNumber(contactValue);
  return `https://zalo.me/${cleaned}`;
}

/**
 * Chuẩn hóa link Facebook
 */
export function getFacebookUrl(contactValue: string): string {
  if (contactValue.startsWith('http://') || contactValue.startsWith('https://')) {
    return contactValue;
  }
  return `https://${contactValue}`;
}
