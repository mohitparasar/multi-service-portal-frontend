import {
  ArrowLeft,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { bookingApi } from "../../api/bookingApi";
import { getApiErrorMessage } from "../../utils/apiError";

const today = new Date().toISOString().split("T")[0];

export default function CreateBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const provider = location.state?.provider;

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    providerId:
      provider?.providerId ||
      provider?.id ||
      "",

    categoryId:
      provider?.categoryId ||
      "",

    serviceAddress: "",
    city: provider?.city || "",
    state: provider?.state || "Maharashtra",
    pincode: "",
    scheduledDate: "",
    scheduledTime: "",

    estimatedPrice:
      provider?.basePrice ||
      provider?.price ||
      "",
  });

  const missingProvider = useMemo(
    () => !form.providerId,
    [form.providerId]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!form.providerId) {
      errors.providerId =
        "Provider information is missing.";
    }

    if (!form.categoryId) {
      errors.categoryId =
        "Category information is missing.";
    }

    if (!form.city.trim()) {
      errors.city = "City is required.";
    }

    if (!form.state.trim()) {
      errors.state = "State is required.";
    }

    if (
      !/^[1-9][0-9]{5}$/.test(
        form.pincode.trim()
      )
    ) {
      errors.pincode =
        "Enter a valid six-digit Indian pincode.";
    }

    if (!form.scheduledDate) {
      errors.scheduledDate =
        "Scheduled date is required.";
    } else if (form.scheduledDate < today) {
      errors.scheduledDate =
        "Booking date cannot be in the past.";
    }

    if (!form.scheduledTime) {
      errors.scheduledTime =
        "Scheduled time is required.";
    }

    if (!form.serviceAddress.trim()) {
      errors.serviceAddress =
        "Service address is required.";
    }

    if (
      form.estimatedPrice === "" ||
      Number(form.estimatedPrice) < 0
    ) {
      errors.estimatedPrice =
        "Estimated price is invalid.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    const payload = {
      providerId: Number(form.providerId),
      categoryId: Number(form.categoryId),

      serviceAddress:
        form.serviceAddress.trim(),

      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),

      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,

      estimatedPrice: Number(
        form.estimatedPrice
      ),
    };

    console.log("Booking payload:", payload);

    try {
      setSaving(true);

      /*
       * Use the method name that exists in bookingApi.js.
       *
       * Preferred:
       * bookingApi.createBooking(payload)
       *
       * If your method is named create, use:
       * bookingApi.create(payload)
       */
      await bookingApi.create(payload);

      toast.success(
        "Booking created successfully"
      );

      navigate("/customer/bookings");
    } catch (error) {
      console.error(
        "Booking creation failed:",
        error
      );

      setError(
        getApiErrorMessage(
          error,
          "Booking creation is temporarily unavailable."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (!provider) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-msp-primary">
            Provider information is missing
          </h1>

          <p className="mt-3 text-msp-secondary">
            Please return to the provider search
            page and select a provider.
          </p>

          <Link
            to="/providers"
            className="btn-primary mt-6 inline-flex"
          >
            Find providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/providers"
        className="inline-flex items-center gap-2 font-bold text-msp-accent"
      >
        <ArrowLeft size={17} />
        Back to providers
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow">
            NEW BOOKING
          </p>

          <h1 className="mt-2 display-title">
            Book your service
          </h1>

          <p className="mt-2 text-msp-secondary">
            Your booking will appear in both the
            customer and provider dashboards after
            it is created.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-700">
                Booking could not be created
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={submit}
            className="card mt-7 grid gap-5 p-6 md:grid-cols-2"
          >
            <FormField
              label="Provider ID"
              name="providerId"
              type="number"
              value={form.providerId}
              onChange={handleChange}
              error={fieldErrors.providerId}
              readOnly
            />

            <FormField
              label="Category ID"
              name="categoryId"
              type="number"
              value={form.categoryId}
              onChange={handleChange}
              error={fieldErrors.categoryId}
              readOnly
            />

            <FormField
              label="City"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              error={fieldErrors.city}
            />

            <FormField
              label="State"
              name="state"
              type="text"
              value={form.state}
              onChange={handleChange}
              error={fieldErrors.state}
            />

            <FormField
              label="Pincode"
              name="pincode"
              type="text"
              value={form.pincode}
              onChange={handleChange}
              error={fieldErrors.pincode}
              maxLength={6}
              inputMode="numeric"
              placeholder="Example: 411033"
            />

            <FormField
              label="Scheduled date"
              name="scheduledDate"
              type="date"
              value={form.scheduledDate}
              onChange={handleChange}
              error={fieldErrors.scheduledDate}
              min={today}
            />

            <FormField
              label="Scheduled time"
              name="scheduledTime"
              type="time"
              value={form.scheduledTime}
              onChange={handleChange}
              error={fieldErrors.scheduledTime}
            />

            <FormField
              label="Estimated price"
              name="estimatedPrice"
              type="number"
              value={form.estimatedPrice}
              onChange={handleChange}
              error={fieldErrors.estimatedPrice}
              readOnly
            />

            <label className="text-sm font-semibold text-msp-primary md:col-span-2">
              Service address

              <textarea
                required
                name="serviceAddress"
                maxLength={500}
                value={form.serviceAddress}
                onChange={handleChange}
                className={`field mt-2 min-h-28 ${
                  fieldErrors.serviceAddress
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter the complete service address"
              />

              <div className="mt-1 flex justify-between gap-3">
                <span className="text-xs text-red-600">
                  {fieldErrors.serviceAddress}
                </span>

                <span className="text-xs text-msp-muted">
                  {form.serviceAddress.length}/500
                </span>
              </div>
            </label>

            <button
              type="submit"
              disabled={saving || missingProvider}
              className="btn-primary md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Creating booking..."
                : "Confirm booking"}
            </button>
          </form>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-8">
          <p className="eyebrow">
            SELECTED PROVIDER
          </p>

          <h2 className="mt-3 font-display text-2xl font-bold text-msp-primary">
            {provider?.fullName ||
              provider?.providerName ||
              "Provider details unavailable"}
          </h2>

          <p className="mt-2 text-sm text-msp-secondary">
            {provider?.city || "Service area"} ·{" "}
            {provider?.experienceYears ?? 0} years
            experience
          </p>

          <div className="mt-5 space-y-3 border-t border-msp-border pt-5 text-sm text-msp-secondary">
            <p className="flex gap-2">
              <ShieldCheck
                size={17}
                className="text-msp-accent"
              />
              Approved provider
            </p>

            <p className="flex gap-2">
              <CalendarCheck
                size={17}
                className="text-msp-accent"
              />
              Track status in dashboard
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  readOnly = false,
  ...inputProps
}) {
  return (
    <label className="text-sm font-semibold text-msp-primary">
      {label}

      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`field mt-2 ${
          readOnly
            ? "cursor-not-allowed opacity-70"
            : ""
        } ${
          error ? "border-red-500" : ""
        }`}
        {...inputProps}
      />

      {error && (
        <span className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}