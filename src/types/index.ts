export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "archived";

export type UserRole = "super_admin" | "editor" | "writer";

export interface ArticleWithRelations {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  categoryId: number | null;
  categoryName?: string;
  categorySlug?: string;
  authorId: number | null;
  authorName?: string;
  authorAvatar?: string | null;
  status: ArticleStatus;
  featured: boolean;
  breaking: boolean;
  views: number;
  seoTitle: string | null;
  seoDescription: string | null;
  rejectionReason: string | null;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  active: boolean;
  createdAt: Date;
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
}

export interface TagData {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  drafts: number;
  pendingReview: number;
  scheduled: number;
  published: number;
  rejected: number;
  archived: number;
}
