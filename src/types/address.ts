// src/types/address.ts
export interface Address {
  id: number;
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault?: boolean;
  addressType?: string;
  notes?: string;
}

export interface UpdateAddressRequest {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
}