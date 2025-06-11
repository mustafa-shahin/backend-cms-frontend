// export interface Company {
//   id: number;
//   name: string;
//   description?: string;
//   website?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   logo?: string;
//   favicon?: string;
//   brandingSettings: Record<string, any>;
//   socialMediaLinks: Record<string, any>;
//   contactInfo: Record<string, any>;
//   businessSettings: Record<string, any>;
//   isActive: boolean;
//   timezone?: string;
//   currency?: string;
//   language?: string;
//   createdAt: string;
//   updatedAt: string;
//   locations: Location[];
// }

// export interface UpdateCompanyRequest {
//   name: string;
//   description?: string;
//   website?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   logo?: string;
//   favicon?: string;
//   brandingSettings?: Record<string, any>;
//   socialMediaLinks?: Record<string, any>;
//   contactInfo?: Record<string, any>;
//   businessSettings?: Record<string, any>;
//   timezone?: string;
//   currency?: string;
//   language?: string;
// }
// src/types/company.ts
import { Address, CreateAddressRequest } from "./address";
import { ContactDetails, CreateContactDetailsRequest } from "./contact";
import { Location } from "./location";

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
  // Added properties based on Company.cs backend model
  addresses: Address[]; //
  contactDetails: ContactDetails[]; //
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
  // Added properties for update requests
  addresses?: CreateAddressRequest[];
  contactDetails?: CreateContactDetailsRequest[];
}
