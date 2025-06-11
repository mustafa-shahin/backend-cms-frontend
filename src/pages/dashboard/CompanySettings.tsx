import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { companyApi } from "../../services/api";
import { UpdateCompanyRequest } from "../../types/company";
import {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
} from "../../types/location";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import DataTable, { Column } from "../../components/ui/DataTable";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AddressForm from "../../components/forms/AddressForm";
import ContactDetailsForm from "../../components/forms/ContactDetailsForm";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const CompanySettings: React.FC = () => {
  const [editCompanyModalOpen, setEditCompanyModalOpen] = useState(false);
  const [createLocationModalOpen, setCreateLocationModalOpen] = useState(false);
  const [editLocationModalOpen, setEditLocationModalOpen] = useState(false);
  const [deleteLocationDialogOpen, setDeleteLocationDialogOpen] =
    useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data: company, isLoading: companyLoading } = useQuery(
    "company",
    companyApi.getCompany
  );
  const { data: locations, isLoading: locationsLoading } = useQuery(
    "locations",
    companyApi.getLocations
  );

  const companyForm = useForm<UpdateCompanyRequest>();

  const updateCompanyMutation = useMutation(companyApi.updateCompany, {
    onSuccess: () => {
      queryClient.invalidateQueries(["company"]);
      toast.success("Company updated successfully");
      setEditCompanyModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update company");
    },
  });

  const createLocationMutation = useMutation(companyApi.createLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      queryClient.invalidateQueries(["company"]);
      toast.success("Location created successfully");
      setCreateLocationModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create location");
    },
  });

  const updateLocationMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateLocationRequest }) =>
      companyApi.updateLocation(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["locations"]);
        queryClient.invalidateQueries(["company"]);
        toast.success("Location updated successfully");
        setEditLocationModalOpen(false);
        setSelectedLocation(null);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to update location"
        );
      },
    }
  );

  const deleteLocationMutation = useMutation(companyApi.deleteLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      queryClient.invalidateQueries(["company"]);
      toast.success("Location deleted successfully");
      setDeleteLocationDialogOpen(false);
      setSelectedLocation(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete location");
    },
  });

  const setMainLocationMutation = useMutation(companyApi.setMainLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries(["locations"]);
      queryClient.invalidateQueries(["company"]);
      toast.success("Main location updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to set main location"
      );
    },
  });

  const handleEditCompany = () => {
    if (company) {
      // Get primary address and contact details
      const primaryAddress =
        company.addresses?.find((addr) => addr.isDefault) ||
        company.addresses?.[0];
      const primaryContact =
        company.contactDetails?.find((contact) => contact.isDefault) ||
        company.contactDetails?.[0];

      companyForm.reset({
        name: company.name,
        description: company.description || "",
        timezone: company.timezone || "",
        currency: company.currency || "",
        language: company.language || "",
        brandingSettings: company.brandingSettings || {},
        businessSettings: company.businessSettings || {},
        addresses: company.addresses?.map((addr) => ({
          street: addr.street,
          street2: addr.street2 || "",
          city: addr.city,
          state: addr.state,
          country: addr.country,
          postalCode: addr.postalCode,
          region: addr.region || "",
          district: addr.district || "",
          addressType: addr.addressType || "",
          notes: addr.notes || "",
          isDefault: addr.isDefault,
        })) || [
          {
            street: "",
            street2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            region: "",
            district: "",
            addressType: "Main",
            notes: "",
            isDefault: true,
          },
        ],
        contactDetails: company.contactDetails?.map((contact) => ({
          primaryPhone: contact.primaryPhone || "",
          secondaryPhone: contact.secondaryPhone || "",
          mobile: contact.mobile || "",
          fax: contact.fax || "",
          email: contact.email || "",
          secondaryEmail: contact.secondaryEmail || "",
          website: contact.website || "",
          linkedInProfile: contact.linkedInProfile || "",
          twitterProfile: contact.twitterProfile || "",
          facebookProfile: contact.facebookProfile || "",
          instagramProfile: contact.instagramProfile || "",
          whatsAppNumber: contact.whatsAppNumber || "",
          telegramHandle: contact.telegramHandle || "",
          contactType: contact.contactType || "",
          isDefault: contact.isDefault,
        })) || [
          {
            primaryPhone: "",
            secondaryPhone: "",
            mobile: "",
            fax: "",
            email: "",
            secondaryEmail: "",
            website: "",
            linkedInProfile: "",
            twitterProfile: "",
            facebookProfile: "",
            instagramProfile: "",
            whatsAppNumber: "",
            telegramHandle: "",
            contactType: "Business",
            isDefault: true,
          },
        ],
      });
      setEditCompanyModalOpen(true);
    }
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setEditLocationModalOpen(true);
  };

  const handleDeleteLocation = (location: Location) => {
    setSelectedLocation(location);
    setDeleteLocationDialogOpen(true);
  };

  const handleSetMainLocation = (location: Location) => {
    setMainLocationMutation.mutate(location.id);
  };

  const onUpdateCompanySubmit = (data: UpdateCompanyRequest) => {
    updateCompanyMutation.mutate(data);
  };

  // Enhanced Create Location Modal Component
  const CreateLocationModal = () => {
    const methods = useForm<CreateLocationRequest>({
      defaultValues: {
        name: "",
        description: "",
        locationCode: "",
        locationType: "Office",
        isActive: true,
        isMainLocation: false,
        addresses: [
          {
            street: "",
            street2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            region: "",
            addressType: "Main",
            notes: "",
            isDefault: true,
          },
        ],
        contactDetails: [
          {
            primaryPhone: "",
            secondaryPhone: "",
            mobile: "",
            fax: "",
            email: "",
            secondaryEmail: "",
            website: "",
            linkedInProfile: "",
            twitterProfile: "",
            facebookProfile: "",
            instagramProfile: "",
            whatsAppNumber: "",
            telegramHandle: "",
            contactType: "Business",
            isDefault: true,
          },
        ],
        openingHours: [],
        locationSettings: {},
        additionalInfo: {},
      },
    });

    const {
      fields: addressFields,
      append: appendAddress,
      remove: removeAddress,
    } = useFieldArray({
      control: methods.control,
      name: "addresses",
    });

    const {
      fields: contactFields,
      append: appendContact,
      remove: removeContact,
    } = useFieldArray({
      control: methods.control,
      name: "contactDetails",
    });

    const onSubmit = (data: CreateLocationRequest) => {
      createLocationMutation.mutate(data);
    };

    return (
      <Modal
        open={createLocationModalOpen}
        onClose={() => setCreateLocationModalOpen(false)}
        title="Add New Location"
        size="2xl"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setCreateLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={methods.handleSubmit(onSubmit)}
              loading={createLocationMutation.isLoading}
            >
              Create Location
            </Button>
          </div>
        }
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Location Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Location Name"
                  {...methods.register("name", {
                    required: "Location name is required",
                  })}
                  error={methods.formState.errors.name?.message}
                />
                <Input
                  label="Location Code"
                  placeholder="e.g., NYC001"
                  {...methods.register("locationCode")}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Description"
                  {...methods.register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location Type
                  </label>
                  <select
                    {...methods.register("locationType")}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="Branch">Branch</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Office">Office</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isMainLocation"
                      {...methods.register("isMainLocation")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isMainLocation"
                      className="ml-2 block text-sm text-gray-900 dark:text-white"
                    >
                      Main Location
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...methods.register("isActive")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="ml-2 block text-sm text-gray-900 dark:text-white"
                    >
                      Active Location
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Addresses
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAddress({
                      street: "",
                      street2: "",
                      city: "",
                      state: "",
                      country: "",
                      postalCode: "",
                      region: "",
                      addressType: "",
                      notes: "",
                      isDefault: false,
                    })
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Address
                </Button>
              </div>

              {addressFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Address {index + 1}
                    </h4>
                    {addressFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddress(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <AddressForm prefix={`addresses.${index}`} />
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Contact Details
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendContact({
                      primaryPhone: "",
                      secondaryPhone: "",
                      mobile: "",
                      fax: "",
                      email: "",
                      secondaryEmail: "",
                      website: "",
                      linkedInProfile: "",
                      twitterProfile: "",
                      facebookProfile: "",
                      instagramProfile: "",
                      whatsAppNumber: "",
                      telegramHandle: "",
                      contactType: "",
                      isDefault: false,
                    })
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Contact
                </Button>
              </div>

              {contactFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Contact Details {index + 1}
                    </h4>
                    {contactFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <ContactDetailsForm prefix={`contactDetails.${index}`} />
                </div>
              ))}
            </div>
          </form>
        </FormProvider>
      </Modal>
    );
  };

  // Enhanced Edit Location Modal Component
  const EditLocationModal = () => {
    const methods = useForm<UpdateLocationRequest>();

    const {
      fields: addressFields,
      append: appendAddress,
      remove: removeAddress,
    } = useFieldArray({
      control: methods.control,
      name: "addresses",
    });

    const {
      fields: contactFields,
      append: appendContact,
      remove: removeContact,
    } = useFieldArray({
      control: methods.control,
      name: "contactDetails",
    });

    React.useEffect(() => {
      if (selectedLocation) {
        methods.reset({
          name: selectedLocation.name,
          description: selectedLocation.description || "",
          locationCode: selectedLocation.locationCode || "",
          locationType: selectedLocation.locationType || "Office",
          isMainLocation: selectedLocation.isMainLocation,
          isActive: selectedLocation.isActive,
          addresses: selectedLocation.addresses?.length
            ? selectedLocation.addresses.map((addr) => ({
                street: addr.street,
                street2: addr.street2 || "",
                city: addr.city,
                state: addr.state,
                country: addr.country,
                postalCode: addr.postalCode,
                region: addr.region || "",
                addressType: addr.addressType || "",
                notes: addr.notes || "",
                isDefault: addr.isDefault,
              }))
            : [
                {
                  street: "",
                  street2: "",
                  city: "",
                  state: "",
                  country: "",
                  postalCode: "",
                  region: "",
                  addressType: "",
                  notes: "",
                  isDefault: true,
                },
              ],
          contactDetails: selectedLocation.contactDetails?.length
            ? selectedLocation.contactDetails.map((contact) => ({
                primaryPhone: contact.primaryPhone || "",
                secondaryPhone: contact.secondaryPhone || "",
                mobile: contact.mobile || "",
                fax: contact.fax || "",
                email: contact.email || "",
                secondaryEmail: contact.secondaryEmail || "",
                website: contact.website || "",
                linkedInProfile: contact.linkedInProfile || "",
                twitterProfile: contact.twitterProfile || "",
                facebookProfile: contact.facebookProfile || "",
                instagramProfile: contact.instagramProfile || "",
                whatsAppNumber: contact.whatsAppNumber || "",
                telegramHandle: contact.telegramHandle || "",
                contactType: contact.contactType || "",
                isDefault: contact.isDefault,
              }))
            : [
                {
                  primaryPhone: "",
                  secondaryPhone: "",
                  mobile: "",
                  fax: "",
                  email: "",
                  secondaryEmail: "",
                  website: "",
                  linkedInProfile: "",
                  twitterProfile: "",
                  facebookProfile: "",
                  instagramProfile: "",
                  whatsAppNumber: "",
                  telegramHandle: "",
                  contactType: "",
                  isDefault: true,
                },
              ],
          openingHours: selectedLocation.openingHours || [],
          locationSettings: selectedLocation.locationSettings || {},
          additionalInfo: selectedLocation.additionalInfo || {},
        });
      }
    }, [selectedLocation, methods]);

    const onSubmit = (data: UpdateLocationRequest) => {
      if (selectedLocation) {
        updateLocationMutation.mutate({ id: selectedLocation.id, data });
      }
    };

    return (
      <Modal
        open={editLocationModalOpen}
        onClose={() => setEditLocationModalOpen(false)}
        title="Edit Location"
        size="2xl"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setEditLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={methods.handleSubmit(onSubmit)}
              loading={updateLocationMutation.isLoading}
            >
              Update Location
            </Button>
          </div>
        }
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Location Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Location Name"
                  {...methods.register("name", {
                    required: "Location name is required",
                  })}
                  error={methods.formState.errors.name?.message}
                />
                <Input
                  label="Location Code"
                  {...methods.register("locationCode")}
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Description"
                  {...methods.register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location Type
                  </label>
                  <select
                    {...methods.register("locationType")}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="Branch">Branch</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Office">Office</option>
                    <option value="Store">Store</option>
                  </select>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsMainLocation"
                      {...methods.register("isMainLocation")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="editIsMainLocation"
                      className="ml-2 block text-sm text-gray-900 dark:text-white"
                    >
                      Main Location
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      {...methods.register("isActive")}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="editIsActive"
                      className="ml-2 block text-sm text-gray-900 dark:text-white"
                    >
                      Active Location
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Addresses
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAddress({
                      street: "",
                      street2: "",
                      city: "",
                      state: "",
                      country: "",
                      postalCode: "",
                      region: "",
                      addressType: "",
                      notes: "",
                      isDefault: false,
                    })
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Address
                </Button>
              </div>

              {addressFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Address {index + 1}
                    </h4>
                    {addressFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAddress(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <AddressForm prefix={`addresses.${index}`} />
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Contact Details
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendContact({
                      primaryPhone: "",
                      secondaryPhone: "",
                      mobile: "",
                      fax: "",
                      email: "",
                      secondaryEmail: "",
                      website: "",
                      linkedInProfile: "",
                      twitterProfile: "",
                      facebookProfile: "",
                      instagramProfile: "",
                      whatsAppNumber: "",
                      telegramHandle: "",
                      contactType: "",
                      isDefault: false,
                    })
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Contact
                </Button>
              </div>

              {contactFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Contact Details {index + 1}
                    </h4>
                    {contactFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <ContactDetailsForm prefix={`contactDetails.${index}`} />
                </div>
              ))}
            </div>
          </form>
        </FormProvider>
      </Modal>
    );
  };

  const locationColumns: Column<Location>[] = [
    {
      header: "Location",
      accessor: "name",
      render: (value, item) => (
        <div className="flex items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {value}
              </span>
              {item.isMainLocation && (
                <StarIconSolid
                  className="h-4 w-4 text-yellow-400"
                  title="Main Location"
                />
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {item.locationCode && `Code: ${item.locationCode}`}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "locationType",
      render: (value) => (
        <Badge variant="blue" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      header: "Contact",
      accessor: (item) =>
        item.contactDetails?.[0]?.email ||
        item.contactDetails?.[0]?.primaryPhone ||
        "No contact",
      render: (value, item) => (
        <div>
          {item.contactDetails?.length > 0 && (
            <>
              {item.contactDetails[0].primaryPhone && (
                <div className="text-sm">
                  {item.contactDetails[0].primaryPhone}
                </div>
              )}
              {item.contactDetails[0].email && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.contactDetails[0].email}
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (value, item) => (
        <div className="flex flex-col space-y-1">
          {value ? (
            <Badge variant="green">Active</Badge>
          ) : (
            <Badge variant="gray">Inactive</Badge>
          )}
          {item.isMainLocation && <Badge variant="yellow">Main</Badge>}
        </div>
      ),
    },
    {
      header: "Address",
      accessor: (item) => item.addresses?.[0]?.street || "No address",
      render: (value, item) => (
        <div className="text-sm">
          {item.addresses?.length > 0 && (
            <>
              <div>{item.addresses[0].street}</div>
              <div className="text-gray-500 dark:text-gray-400">
                {item.addresses[0].city}, {item.addresses[0].state}{" "}
                {item.addresses[0].postalCode}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {item.addresses[0].country}
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const locationActions = [
    {
      icon: PencilIcon,
      label: "Edit",
      onClick: (location: Location) => handleEditLocation(location),
      variant: "ghost" as const,
    },
    {
      icon: StarIcon,
      label: "Set as Main",
      onClick: (location: Location) => handleSetMainLocation(location),
      variant: "ghost" as const,
      show: (location: Location) => !location.isMainLocation,
    },
    {
      icon: TrashIcon,
      label: "Delete",
      onClick: (location: Location) => handleDeleteLocation(location),
      variant: "danger" as const,
      show: (location: Location) => !location.isMainLocation,
    },
  ];

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your company information and locations
        </p>
      </div>

      {/* Company Information */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2" />
              Company Information
            </h2>
            <Button variant="outline" onClick={handleEditCompany}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
          </div>

          {company && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {company.name}
                </h3>
                {company.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {company.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {company.contactDetails?.length > 0 && (
                  <>
                    {company.contactDetails[0].website && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Website:
                        </span>
                        <a
                          href={company.contactDetails[0].website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary-600 hover:text-primary-700"
                        >
                          {company.contactDetails[0].website}
                        </a>
                      </div>
                    )}
                    {company.contactDetails[0].email && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {company.contactDetails[0].email}
                        </span>
                      </div>
                    )}
                    {company.contactDetails[0].primaryPhone && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Phone:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {company.contactDetails[0].primaryPhone}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {company.addresses?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Address:
                    </span>
                    <div className="ml-2 text-gray-900 dark:text-white">
                      <div>{company.addresses[0].street}</div>
                      <div>
                        {company.addresses[0].city},{" "}
                        {company.addresses[0].state}{" "}
                        {company.addresses[0].postalCode}
                      </div>
                      <div>{company.addresses[0].country}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Locations */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2" />
              Company Locations ({locations?.length || 0})
            </h2>
            <Button onClick={() => setCreateLocationModalOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>

          <DataTable
            data={locations || []}
            columns={locationColumns}
            actions={locationActions}
            loading={locationsLoading}
            emptyMessage="No locations found"
          />
        </div>
      </Card>

      {/* Edit Company Modal */}
      <Modal
        open={editCompanyModalOpen}
        onClose={() => setEditCompanyModalOpen(false)}
        title="Edit Company Information"
        size="2xl"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setEditCompanyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={companyForm.handleSubmit(onUpdateCompanySubmit)}
              loading={updateCompanyMutation.isLoading}
            >
              Update Company
            </Button>
          </div>
        }
      >
        <FormProvider {...companyForm}>
          <form
            onSubmit={companyForm.handleSubmit(onUpdateCompanySubmit)}
            className="space-y-6"
          >
            {/* Basic Company Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  {...companyForm.register("name", {
                    required: "Company name is required",
                  })}
                  error={companyForm.formState.errors.name?.message}
                />
                <Input
                  label="Description"
                  {...companyForm.register("description")}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Address
              </h3>
              <AddressForm prefix="addresses.0" />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Details
              </h3>
              <ContactDetailsForm prefix="contactDetails.0" />
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* Create Location Modal */}
      <CreateLocationModal />

      {/* Edit Location Modal */}
      <EditLocationModal />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteLocationDialogOpen}
        onClose={() => setDeleteLocationDialogOpen(false)}
        onConfirm={() =>
          selectedLocation && deleteLocationMutation.mutate(selectedLocation.id)
        }
        title="Delete Location"
        description={`Are you sure you want to delete "${selectedLocation?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteLocationMutation.isLoading}
      />
    </div>
  );
};

export default CompanySettings;
