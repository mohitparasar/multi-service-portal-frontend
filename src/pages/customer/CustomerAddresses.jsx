import {
  Check,
  Edit3,
  Home,
  LoaderCircle,
  MapPin,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { userApi } from "../../api/userApi";
import { getApiErrorMessage } from "../../utils/apiError";

const DEFAULT_COORDINATES = {
  latitude: 18.5204,
  longitude: 73.8567,
};

const EMPTY_FORM = {
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "HOME",
};

const ADDRESS_TYPES = ["HOME", "WORK", "OTHER"];

export default function CustomerAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultingId, setDefaultingId] = useState(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((first, second) => {
      if (first?.isDefault === second?.isDefault) {
        return 0;
      }

      return first?.isDefault ? -1 : 1;
    });
  }, [addresses]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await userApi.getAddresses();

      const data =
        response?.data?.data ??
        response?.data ??
        [];

      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Load addresses error:",
        error?.response?.data || error
      );

      setPageError(
        getApiErrorMessage(
          error,
          "Unable to load your addresses."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const getAddressId = (address) =>
    address?.addressId ?? address?.id;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.addressLine1.trim()) {
      nextErrors.addressLine1 =
        "Address line 1 is required.";
    }

    if (!formData.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      nextErrors.state = "State is required.";
    }

    if (!formData.pincode.trim()) {
      nextErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^[1-9][0-9]{5}$/.test(
        formData.pincode.trim()
      )
    ) {
      nextErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    if (!formData.addressType) {
      nextErrors.addressType =
        "Address type is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => ({
    addressLine1:
      formData.addressLine1.trim(),
    addressLine2:
      formData.addressLine2.trim(),
    landmark: formData.landmark.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    pincode: formData.pincode.trim(),
    addressType: formData.addressType,
    latitude: DEFAULT_COORDINATES.latitude,
    longitude: DEFAULT_COORDINATES.longitude,
  });

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddAddress = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    const addressId = getAddressId(address);

    setEditingId(addressId);
    setFormData({
      addressLine1:
        address?.addressLine1 ?? "",
      addressLine2:
        address?.addressLine2 ?? "",
      landmark: address?.landmark ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      pincode: address?.pincode ?? "",
      addressType:
        address?.addressType ?? "HOME",
    });

    setErrors({});
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingId) {
        const response =
          await userApi.updateAddress(
            editingId,
            payload
          );

        const updatedAddress =
          response?.data?.data ??
          response?.data ??
          {
            ...payload,
            id: editingId,
          };

        setAddresses((previous) =>
          previous.map((address) =>
            getAddressId(address) === editingId
              ? {
                  ...address,
                  ...updatedAddress,
                }
              : address
          )
        );

        toast.success(
          "Address updated successfully."
        );
      } else {
        const response =
          await userApi.addAddress(payload);

        const createdAddress =
          response?.data?.data ??
          response?.data;

        if (createdAddress) {
          setAddresses((previous) => [
            ...previous,
            createdAddress,
          ]);
        } else {
          await loadAddresses();
        }

        toast.success(
          "Address added successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Save address error:",
        error?.response?.data || error
      );

      toast.error(
        getApiErrorMessage(
          error,
          editingId
            ? "Unable to update address."
            : "Unable to add address."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (
    address
  ) => {
    const addressId = getAddressId(address);

    if (!addressId) {
      toast.error(
        "Address ID is unavailable."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(addressId);

      await userApi.deleteAddress(addressId);

      setAddresses((previous) =>
        previous.filter(
          (item) =>
            getAddressId(item) !== addressId
        )
      );

      if (editingId === addressId) {
        resetForm();
      }

      toast.success(
        "Address deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete address error:",
        error?.response?.data || error
      );

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete address."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleMakeDefault = async (
    address
  ) => {
    const addressId = getAddressId(address);

    if (!addressId) {
      toast.error(
        "Address ID is unavailable."
      );
      return;
    }

    if (address?.isDefault) {
      return;
    }

    try {
      setDefaultingId(addressId);

      await userApi.makeDefaultAddress(
        addressId
      );

      setAddresses((previous) =>
        previous.map((item) => ({
          ...item,
          isDefault:
            getAddressId(item) === addressId,
        }))
      );

      toast.success(
        "Default address updated."
      );
    } catch (error) {
      console.error(
        "Set default address error:",
        error?.response?.data || error
      );

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to set default address."
        )
      );
    } finally {
      setDefaultingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            SAVED ADDRESSES
          </p>

          <h1 className="mt-3 display-title">
            Manage your addresses
          </h1>

          <p className="mt-3 max-w-2xl text-msp-secondary">
            Add and manage the addresses
            you use while booking services.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddAddress}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add address
          </button>
        )}
      </div>

      {pageError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {pageError}
        </div>
      )}

      {showForm && (
        <AddressForm
          formData={formData}
          errors={errors}
          editing={Boolean(editingId)}
          saving={saving}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <section className="mt-8">
        <div>
          <h2 className="text-xl font-bold text-msp-primary">
            Your addresses
          </h2>

          <p className="mt-1 text-sm text-msp-secondary">
            {addresses.length}{" "}
            {addresses.length === 1
              ? "address"
              : "addresses"}{" "}
            saved
          </p>
        </div>

        {loading ? (
          <LoadingState />
        ) : sortedAddresses.length === 0 ? (
          <EmptyState
            onAdd={handleAddAddress}
          />
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {sortedAddresses.map(
              (address, index) => (
                <AddressCard
                  key={
                    getAddressId(address) ??
                    index
                  }
                  address={address}
                  deleting={
                    deletingId ===
                    getAddressId(address)
                  }
                  settingDefault={
                    defaultingId ===
                    getAddressId(address)
                  }
                  onEdit={() =>
                    handleEditAddress(address)
                  }
                  onDelete={() =>
                    handleDeleteAddress(
                      address
                    )
                  }
                  onMakeDefault={() =>
                    handleMakeDefault(address)
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function AddressForm({
  formData,
  errors,
  editing,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="card mt-8 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-msp-primary">
            {editing
              ? "Edit address"
              : "Add new address"}
          </h2>

          <p className="mt-1 text-sm text-msp-secondary">
            Enter the address details below.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="grid h-10 w-10 place-items-center rounded-xl border border-msp-border text-msp-secondary transition hover:bg-msp-softGreen hover:text-msp-primary"
          aria-label="Close address form"
        >
          <X size={18} />
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-5 md:grid-cols-2"
      >
        <FormField
          label="Address line 1"
          name="addressLine1"
          value={formData.addressLine1}
          error={errors.addressLine1}
          placeholder="Flat number, building or street"
          onChange={onChange}
          className="md:col-span-2"
          required
        />

        <FormField
          label="Address line 2"
          name="addressLine2"
          value={formData.addressLine2}
          error={errors.addressLine2}
          placeholder="Area or locality"
          onChange={onChange}
        />

        <FormField
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          error={errors.landmark}
          placeholder="Nearby landmark"
          onChange={onChange}
        />

        <FormField
          label="City"
          name="city"
          value={formData.city}
          error={errors.city}
          placeholder="Pune"
          onChange={onChange}
          required
        />

        <FormField
          label="State"
          name="state"
          value={formData.state}
          error={errors.state}
          placeholder="Maharashtra"
          onChange={onChange}
          required
        />

        <FormField
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          error={errors.pincode}
          placeholder="411001"
          onChange={onChange}
          maxLength={6}
          required
        />

        <div>
          <label
            htmlFor="addressType"
            className="mb-2 block text-sm font-semibold text-msp-primary"
          >
            Address type
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <select
            id="addressType"
            name="addressType"
            value={formData.addressType}
            onChange={onChange}
            className={`input-field w-full ${
              errors.addressType
                ? "border-red-400 focus:border-red-500"
                : ""
            }`}
          >
            {ADDRESS_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {formatAddressType(type)}
              </option>
            ))}
          </select>

          {errors.addressType && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.addressType}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-msp-border pt-5 md:col-span-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border border-msp-border px-5 py-3 text-sm font-semibold text-msp-primary transition hover:bg-msp-softGreen disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            {saving
              ? "Saving..."
              : editing
                ? "Update address"
                : "Save address"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FormField({
  label,
  name,
  value,
  error,
  placeholder,
  onChange,
  className = "",
  maxLength,
  required = false,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-msp-primary"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`input-field w-full ${
          error
            ? "border-red-400 focus:border-red-500"
            : ""
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function AddressCard({
  address,
  deleting,
  settingDefault,
  onEdit,
  onDelete,
  onMakeDefault,
}) {
  const addressType =
    address?.addressType ?? "OTHER";

  const completeAddress = [
    address?.addressLine1,
    address?.addressLine2,
    address?.landmark,
  ]
    .filter(Boolean)
    .join(", ");

  const location = [
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className={`card p-6 ${
        address?.isDefault
          ? "ring-2 ring-msp-accent/30"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-msp-softGreen text-msp-accent">
            {addressType === "HOME" ? (
              <Home size={22} />
            ) : (
              <MapPin size={22} />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-msp-primary">
                {formatAddressType(
                  addressType
                )}
              </h3>

              {address?.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-msp-softGreen px-2.5 py-1 text-xs font-bold text-msp-accent">
                  <Check size={13} />
                  Default
                </span>
              )}
            </div>

            <p className="mt-3 break-words text-sm leading-6 text-msp-secondary">
              {completeAddress ||
                "Address details unavailable"}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-msp-primary">
              {location}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-msp-border pt-5">
        {!address?.isDefault && (
          <button
            type="button"
            onClick={onMakeDefault}
            disabled={
              settingDefault || deleting
            }
            className="inline-flex items-center gap-2 rounded-xl border border-msp-border px-4 py-2.5 text-sm font-semibold text-msp-primary transition hover:bg-msp-softGreen disabled:cursor-not-allowed disabled:opacity-60"
          >
            {settingDefault ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Check size={16} />
            )}

            Set default
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl border border-msp-border px-4 py-2.5 text-sm font-semibold text-msp-primary transition hover:bg-msp-softGreen disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Edit3 size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={
            deleting || settingDefault
          }
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={16} />
          )}

          Delete
        </button>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-3xl border border-msp-border bg-white">
      <div className="text-center">
        <LoaderCircle
          size={36}
          className="mx-auto animate-spin text-msp-accent"
        />

        <p className="mt-3 text-msp-secondary">
          Loading addresses...
        </p>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="card mt-5 flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-msp-softGreen text-msp-accent">
        <MapPin size={30} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-msp-primary">
        No addresses saved
      </h3>

      <p className="mt-2 max-w-md text-msp-secondary">
        Add an address to make service
        booking faster and easier.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="btn-primary mt-6 inline-flex items-center gap-2"
      >
        <Plus size={18} />
        Add your first address
      </button>
    </div>
  );
}

function formatAddressType(type) {
  if (!type) {
    return "Other";
  }

  return (
    type.charAt(0).toUpperCase() +
    type.slice(1).toLowerCase()
  );
}