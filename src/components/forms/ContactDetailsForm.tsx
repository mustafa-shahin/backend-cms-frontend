// src/components/forms/ContactDetailsForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../ui/Input';

interface ContactDetailsFormProps {
  prefix?: string;
  showSocialMedia?: boolean;
  showContactType?: boolean;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({ 
  prefix = 'contactDetails', 
  showSocialMedia = true, 
  showContactType = true 
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Primary Phone"
          type="tel"
          {...register(`${prefix}.primaryPhone`)}
        />
        <Input
          label="Secondary Phone"
          type="tel"
          {...register(`${prefix}.secondaryPhone`)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mobile"
          type="tel"
          {...register(`${prefix}.mobile`)}
        />
        <Input
          label="Fax"
          type="tel"
          {...register(`${prefix}.fax`)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          {...register(`${prefix}.email`, {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors[prefix]?.email?.message as string}
        />
        <Input
          label="Secondary Email"
          type="email"
          {...register(`${prefix}.secondaryEmail`, {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          error={errors[prefix]?.secondaryEmail?.message as string}
        />
      </div>

      <Input
        label="Website"
        type="url"
        placeholder="https://example.com"
        {...register(`${prefix}.website`)}
      />

      {showSocialMedia && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Social Media & Messaging</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile"
                placeholder="https://linkedin.com/in/..."
                {...register(`${prefix}.linkedInProfile`)}
              />
              <Input
                label="Twitter Profile"
                placeholder="https://twitter.com/..."
                {...register(`${prefix}.twitterProfile`)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Facebook Profile"
                placeholder="https://facebook.com/..."
                {...register(`${prefix}.facebookProfile`)}
              />
              <Input
                label="Instagram Profile"
                placeholder="https://instagram.com/..."
                {...register(`${prefix}.instagramProfile`)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="WhatsApp Number"
                type="tel"
                {...register(`${prefix}.whatsAppNumber`)}
              />
              <Input
                label="Telegram Handle"
                placeholder="@username"
                {...register(`${prefix}.telegramHandle`)}
              />
            </div>
          </div>
        </>
      )}

      {showContactType && (
        <Input
          label="Contact Type"
          placeholder="e.g., Business, Personal, Emergency"
          {...register(`${prefix}.contactType`)}
        />
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id={`${prefix}-default`}
          {...register(`${prefix}.isDefault`)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor={`${prefix}-default`} className="ml-2 block text-sm text-gray-900 dark:text-white">
          Set as default contact details
        </label>
      </div>
    </div>
  );
};

export default ContactDetailsForm;