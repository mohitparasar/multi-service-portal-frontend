import {
  CalendarDays,
  Edit3,
  LoaderCircle,
  Phone,
  Save,
  
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { userApi } from "../../api/userApi";
import { getApiErrorMessage } from "../../utils/apiError";

const initialForm = {
  fullName: "",
  mobile: "",
  gender: "",
  dateOfBirth: "",
};

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [profileExists, setProfileExists] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await userApi.getProfile();

      const data =
        response?.data?.data ||
        response?.data;

      setProfile(data);
      setProfileExists(true);
      setEditing(false);

      setForm({
        fullName: data?.fullName || "",
        mobile: data?.mobile || "",
        gender: data?.gender || "",
        dateOfBirth:
          data?.dateOfBirth || "",
      });
    } catch (error) {
      if (error?.response?.status === 404) {
        setProfile(null);
        setProfileExists(false);
        setEditing(true);
        setForm(initialForm);
      } else {
        setError(
          getApiErrorMessage(
            error,
            "Unable to load your profile."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } =
      event.target;

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

    if (!form.fullName.trim()) {
      errors.fullName =
        "Full name is required.";
    }

    if (
      !/^[6-9][0-9]{9}$/.test(
        form.mobile.trim()
      )
    ) {
      errors.mobile =
        "Enter a valid 10-digit mobile number.";
    }

    if (!form.gender) {
      errors.gender =
        "Please select your gender.";
    }

    if (!form.dateOfBirth) {
      errors.dateOfBirth =
        "Date of birth is required.";
    } else {
      const selectedDate =
        new Date(form.dateOfBirth);

      const today = new Date();

      if (selectedDate > today) {
        errors.dateOfBirth =
          "Date of birth cannot be in the future.";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      mobile: form.mobile.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
    };

    try {
      setSaving(true);
      setError("");

      const response = profileExists
        ? await userApi.updateProfile(
            payload
          )
        : await userApi.createProfile(
            payload
          );

      const updatedProfile =
        response?.data?.data ||
        response?.data;

      setProfile(updatedProfile);
      setProfileExists(true);
      setEditing(false);

      setForm({
        fullName:
          updatedProfile?.fullName ||
          payload.fullName,

        mobile:
          updatedProfile?.mobile ||
          payload.mobile,

        gender:
          updatedProfile?.gender ||
          payload.gender,

        dateOfBirth:
          updatedProfile?.dateOfBirth ||
          payload.dateOfBirth,
      });

      toast.success(
        profileExists
          ? "Profile updated successfully."
          : "Profile created successfully."
      );
    } catch (error) {
      console.error(
        "Profile save error:",
        error?.response?.data || error
      );

      setError(
        getApiErrorMessage(
          error,
          "Unable to save your profile."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    if (!profileExists) {
      return;
    }

    setEditing(false);
    setFieldErrors({});
    setError("");

    setForm({
      fullName: profile?.fullName || "",
      mobile: profile?.mobile || "",
      gender: profile?.gender || "",
      dateOfBirth:
        profile?.dateOfBirth || "",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={38}
            className="mx-auto animate-spin text-msp-accent"
          />

          <p className="mt-3 text-msp-secondary">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            CUSTOMER PROFILE
          </p>

          <h1 className="mt-3 display-title">
            Personal information
          </h1>

          <p className="mt-3 max-w-2xl text-msp-secondary">
            Keep your profile information
            accurate for smooth communication
            during service bookings.
          </p>
        </div>

        {profileExists && !editing && (
          <button
            type="button"
            onClick={() =>
              setEditing(true)
            }
            className="btn-primary inline-flex items-center gap-2"
          >
            <Edit3 size={18} />
            Edit profile
          </button>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <ProfileCard
          profile={profile}
          form={form}
        />

        {editing ? (
          <ProfileForm
            form={form}
            fieldErrors={fieldErrors}
            saving={saving}
            profileExists={profileExists}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={cancelEditing}
          />
        ) : (
          <ProfileDetails
            profile={profile}
          />
        )}
      </div>
    </div>
  );
}

function ProfileCard({
  profile,
  form,
}) {
  const fullName =
    form.fullName ||
    profile?.fullName ||
    "Customer";

  const firstLetter =
    fullName.charAt(0).toUpperCase();

  return (
    <aside className="card h-fit overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-msp-primary to-msp-accent" />

      <div className="px-6 pb-7">
        <div className="-mt-14 flex flex-col items-center">
          <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-msp-softGreen text-4xl font-bold text-msp-accent shadow-lg">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={fullName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              firstLetter
            )}
          </div>

          <h2 className="mt-4 text-center text-2xl font-bold text-msp-primary">
            {fullName}
          </h2>

          <p className="mt-1 text-sm text-msp-secondary">
            MSP Customer
          </p>

          <span className="mt-4 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
            Active account
          </span>
        </div>

        <div className="mt-6 space-y-3 border-t border-msp-border pt-5">
          <ProfileSummaryRow
            icon={Phone}
            value={
              form.mobile ||
              profile?.mobile ||
              "Mobile not added"
            }
          />

          <ProfileSummaryRow
            icon={UserRound}
            value={formatGender(
              form.gender ||
                profile?.gender
            )}
          />

          <ProfileSummaryRow
            icon={CalendarDays}
            value={formatDate(
              form.dateOfBirth ||
                profile?.dateOfBirth
            )}
          />
        </div>
      </div>
    </aside>
  );
}

function ProfileSummaryRow({
  icon: Icon,
  value,
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-msp-secondary">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-msp-softGreen text-msp-accent">
        <Icon size={17} />
      </span>

      <span>{value}</span>
    </div>
  );
}

function ProfileForm({
  form,
  fieldErrors,
  saving,
  profileExists,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="card p-6 md:p-8"
    >
      <p className="eyebrow">
        PERSONAL DETAILS
      </p>

      <h2 className="mt-2 text-2xl font-bold text-msp-primary">
        {profileExists
          ? "Update your profile"
          : "Complete your profile"}
      </h2>

      <p className="mt-2 text-sm text-msp-secondary">
        Enter the information associated
        with your customer account.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <FormField
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          error={fieldErrors.fullName}
          placeholder="Enter your full name"
        />

        <FormField
          label="Mobile number"
          name="mobile"
          type="tel"
          value={form.mobile}
          onChange={onChange}
          error={fieldErrors.mobile}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          inputMode="numeric"
        />

        <label className="text-sm font-semibold text-msp-primary">
          Gender

          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className={`field mt-2 ${
              fieldErrors.gender
                ? "border-red-500"
                : ""
            }`}
          >
            <option value="">
              Select gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>

          {fieldErrors.gender && (
            <span className="mt-1 block text-xs font-medium text-red-600">
              {fieldErrors.gender}
            </span>
          )}
        </label>

        <FormField
          label="Date of birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth}
          onChange={onChange}
          error={fieldErrors.dateOfBirth}
          max={
            new Date()
              .toISOString()
              .split("T")[0]
          }
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-msp-border pt-6">
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
            : profileExists
              ? "Save changes"
              : "Create profile"}
        </button>

        {profileExists && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <label className="text-sm font-semibold text-msp-primary">
      {label}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`field mt-2 ${
          error
            ? "border-red-500"
            : ""
        }`}
        {...props}
      />

      {error && (
        <span className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function ProfileDetails({ profile }) {
  if (!profile) {
    return null;
  }

  return (
    <section className="card p-6 md:p-8">
      <p className="eyebrow">
        PROFILE OVERVIEW
      </p>

      <h2 className="mt-2 text-2xl font-bold text-msp-primary">
        Account details
      </h2>

      <p className="mt-2 text-sm text-msp-secondary">
        Your personal information saved
        in the Multi-Service Portal.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <DetailItem
          icon={UserRound}
          label="Full name"
          value={profile.fullName}
        />

        <DetailItem
          icon={Phone}
          label="Mobile number"
          value={profile.mobile}
        />

        <DetailItem
          icon={UserRound}
          label="Gender"
          value={formatGender(
            profile.gender
          )}
        />

        <DetailItem
          icon={CalendarDays}
          label="Date of birth"
          value={formatDate(
            profile.dateOfBirth
          )}
        />
      </div>
    </section>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-msp-border bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-msp-softGreen text-msp-accent">
          <Icon size={18} />
        </span>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-msp-muted">
            {label}
          </p>

          <p className="mt-2 font-semibold text-msp-primary">
            {value || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatGender(gender) {
  if (!gender) {
    return "Gender not added";
  }

  return gender
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(date) {
  if (!date) {
    return "Date of birth not added";
  }

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}