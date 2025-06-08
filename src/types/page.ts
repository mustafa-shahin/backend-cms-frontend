// src/types/page.ts
export enum PageStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
  Scheduled = 'scheduled',
}

export interface PageComponent {
  id: number;
  name: string;
  type: string;
  order: number;
  settings: Record<string, any>;
  content: Record<string, any>;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: number;
  name: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  status: PageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featuredImage?: string;
  author: string;
  isTemplate: boolean;
  templateId?: string;
  parentPageId?: string;
  order: number;
  settings: Record<string, any>;
  seoSettings: Record<string, any>;
  customFields: Record<string, any>;
  components: PageComponent[];
  createdAt: string;
  updatedAt: string;
  publishedBy?: string;
  lastModifiedBy: string;
}

export interface PageListItem {
  id: number;
  name: string;
  title: string;
  slug: string;
  description?: string;
  status: PageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  author: string;
  isTemplate: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface CreatePageRequest {
  name: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  status?: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featuredImage?: string;
  isTemplate?: boolean;
  templateId?: string;
  parentPageId?: string;
  order?: number;
  settings?: Record<string, any>;
  seoSettings?: Record<string, any>;
  customFields?: Record<string, any>;
  scheduledAt?: string;
}

export interface UpdatePageRequest {
  name: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  status: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featuredImage?: string;
  isTemplate?: boolean;
  templateId?: string;
  parentPageId?: string;
  order?: number;
  settings?: Record<string, any>;
  seoSettings?: Record<string, any>;
  customFields?: Record<string, any>;
  scheduledAt?: string;
}

export interface PageSearchFilters {
  status?: PageStatus[];
  author?: string;
  isTemplate?: boolean;
  parentPageId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PageValidation {
  isSlugValid: boolean;
  isTitleValid: boolean;
  errors: string[];
  warnings: string[];
}