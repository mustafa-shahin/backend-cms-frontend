// src/components/forms/AddressForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../ui/Input';

interface AddressFormProps {
  prefix?: string;
  showAddressType?: boolean;
  showNotes?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ 
  prefix = 'address', 
  showAddressType = true, 
  showNotes = true 
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Street Address"
          {...register(`${prefix}.street`, { required: 'Street address is required' })}
          error={errors[prefix]?.street?.message as string}
        />
        <Input
          label="Street Address 2 (Optional)"
          {...register(`${prefix}.street2`)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="City"
          {...register(`${prefix}.city`, { required: 'City is required' })}
          error={errors[prefix]?.city?.message as string}
        />
        <Input
          label="State/Province"
          {...register(`${prefix}.state`, { required: 'State is required' })}
          error={errors[prefix]?.state?.message as string}
        />
        <Input
          label="Postal Code"
          {...register(`${prefix}.postalCode`, { required: 'Postal code is required' })}
          error={errors[prefix]?.postalCode?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Country"
          {...register(`${prefix}.country`, { required: 'Country is required' })}
          error={errors[prefix]?.country?.message as string}
        />
        <Input
          label="Region (Optional)"
          {...register(`${prefix}.region`)}
        />
      </div>

      {showAddressType && (
        <Input
          label="Address Type"
          placeholder="e.g., Main Office, Billing, Shipping"
          {...register(`${prefix}.addressType`)}
        />
      )}

      {showNotes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            {...register(`${prefix}.notes`)}
            rows={3}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Additional address information..."
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id={`${prefix}-default`}
          {...register(`${prefix}.isDefault`)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor={`${prefix}-default`} className="ml-2 block text-sm text-gray-900 dark:text-white">
          Set as default address
        </label>
      </div>
    </div>
  );
};

export default AddressForm;

