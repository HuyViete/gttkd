export type PostType = 'lost' | 'found';

export type Category =
  | 'Điện thoại'
  | 'Thẻ SV'
  | 'Thẻ giữ xe'
  | 'Chìa khóa'
  | 'Balo/Túi'
  | 'Ví'
  | 'Laptop/Tai nghe'
  | 'Khác';

export type Campus =
  | 'Cơ sở 1 (Lý Thường Kiệt)'
  | 'Cơ sở 2 (Dĩ An)';

export type ContactType = 'Zalo' | 'Facebook' | 'SĐT';

export type PostStatus = 'open' | 'done';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  category: Category;
  description?: string;
  campus: Campus;
  location: string;
  date: string; // YYYY-MM-DD
  image_url?: string;
  contact_type: ContactType;
  contact_value: string;
  contact_name?: string;
  status: PostStatus;
  manage_code?: string; // Only available to creator or server
  created_at: string; // ISO String
}

export interface CreatePostInput {
  type: PostType;
  title: string;
  category: Category;
  description?: string;
  campus: Campus;
  location: string;
  date: string;
  image_url?: string;
  contact_type: ContactType;
  contact_value: string;
  contact_name?: string;
}
