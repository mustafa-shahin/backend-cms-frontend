// src/types/contact.ts
export interface ContactDetails {
  id: number;
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDetailsRequest {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts?: Record<string, any>;
  isDefault?: boolean;
  contactType?: string;
}

export interface UpdateContactDetailsRequest {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts?: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
}




