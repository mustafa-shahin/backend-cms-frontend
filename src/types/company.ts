
export interface Company {
  id: number; 
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  favicon?: string;
  brandingSettings: Record<string, any>;
  socialMediaLinks: Record<string, any>;
  contactInfo: Record<string, any>;
  businessSettings: Record<string, any>;
  isActive: boolean;
  timezone?: string;
  currency?: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
  locations: Location[];
}

export interface UpdateCompanyRequest {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  favicon?: string;
  brandingSettings?: Record<string, any>;
  socialMediaLinks?: Record<string, any>;
  contactInfo?: Record<string, any>;
  businessSettings?: Record<string, any>;
  timezone?: string;
  currency?: string;
  language?: string;
}

export interface Location {
  id: number; 
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  website?: string;
  isMainLocation: boolean;
  isActive: boolean;
  openingHours: OpeningHour[];
  additionalInfo: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHour {
  id: number; 
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  website?: string;
  isMainLocation?: boolean;
  isActive?: boolean;
  openingHours?: CreateOpeningHourRequest[];
  additionalInfo?: Record<string, any>;
}

export interface UpdateLocationRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  website?: string;
  isMainLocation: boolean;
  isActive: boolean;
  openingHours?: UpdateOpeningHourRequest[];
  additionalInfo?: Record<string, any>;
}

export interface CreateOpeningHourRequest {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
  isOpen24Hours?: boolean;
  notes?: string;
}

export interface UpdateOpeningHourRequest {
  id?: number; 
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}