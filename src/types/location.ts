import { Address, CreateAddressRequest, UpdateAddressRequest } from './address';
import { ContactDetails, CreateContactDetailsRequest, UpdateContactDetailsRequest } from './contact';

export interface LocationOpeningHour {
  id: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface CreateLocationOpeningHourRequest {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
  isOpen24Hours?: boolean;
  notes?: string;
}

export interface UpdateLocationOpeningHourRequest {
  id?: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings: Record<string, any>;
  additionalInfo: Record<string, any>;
  openingHours: LocationOpeningHour[];
  addresses: Address[];
  contactDetails: ContactDetails[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
  locationCode?: string;
  locationType?: string;
  isMainLocation?: boolean;
  isActive?: boolean;
  locationSettings?: Record<string, any>;
  additionalInfo?: Record<string, any>;
  openingHours?: CreateLocationOpeningHourRequest[];
  addresses?: CreateAddressRequest[];
  contactDetails?: CreateContactDetailsRequest[];
}

export interface UpdateLocationRequest {
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings?: Record<string, any>;
  additionalInfo?: Record<string, any>;
  openingHours?: UpdateLocationOpeningHourRequest[];
  addresses?: UpdateAddressRequest[];
  contactDetails?: UpdateContactDetailsRequest[];
}