export interface Page {
  id: string;
  name: string;
  title: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: PageStatus;
  template?: string;
  priority?: number;
  parentPageId?: string;
  publishedOn?: string;
  publishedBy?: string;
  createdAt: string;
  updatedAt: string;
  components: PageComponent[];
  childPages: Page[];
}

export interface PageListItem {
  id: string;
  name: string;
  title: string;
  slug: string;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
  publishedOn?: string;
  hasChildren: boolean;
}

export interface PageComponent {
  id: string;
  type: ComponentType;
  name: string;
  properties: Record<string, any>;
  styles: Record<string, any>;
  content: Record<string, any>;
  order: number;
  parentComponentId?: string;
  childComponents: PageComponent[];
  isVisible: boolean;
  cssClasses?: string;
  customCss?: string;
  responsiveSettings: Record<string, any>;
  animationSettings: Record<string, any>;
  interactionSettings: Record<string, any>;
}

export interface CreatePageRequest {
  name: string;
  title: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status?: PageStatus;
  template?: string;
  priority?: number;
  parentPageId?: string;
}

export interface UpdatePageRequest {
  name: string;
  title: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: PageStatus;
  template?: string;
  priority?: number;
  parentPageId?: string;
}

export interface SavePageStructureRequest {
  pageId: string;
  components: PageComponent[];
}

export enum PageStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Scheduled = 3,
}

export enum ComponentType {
  Text = 0,
  Image = 1,
  Button = 2,
  Container = 3,
  Grid = 4,
  Card = 5,
  List = 6,
  Form = 7,
  Video = 8,
  Map = 9,
  Gallery = 10,
  Slider = 11,
  Navigation = 12,
  Footer = 13,
  Header = 14,
  Sidebar = 15,
}