import {
  BadgeCheck,
  Camera,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { providerApi } from "../../api/providerApi";
import ApiState from "../../components/common/ApiState";
import { getApiErrorMessage } from "../../utils/apiError";

const emptyProfile = {
  fullName: "",
  phone: "",
  profileImage: "",
  description: "",
  experienceYears: 0,
};

export default function ProviderProfile() {
  const [form, setForm] = useState(emptyProfile);
  const [profile, setProfile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    providerApi
      .getMyProfile()
      .then(({ data }) => {
        const value = data?.data || data;

        setProfile(value);
        setForm({
          ...emptyProfile,
          ...value,
        });

        setImagePreview(value?.profileImage || "");
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setError(
            getApiErrorMessage(
              err,
              "Unable to load your provider profile."
            )
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Remove temporary browser image URL when component closes
   * or when another image is selected.
   */
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      toast.error("Profile image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(profile?.profileImage || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      /*
       * The backend receives profile data as JSON in a
       * multipart field named "profile".
       */
      const profilePayload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        description: form.description.trim(),
        experienceYears: Number(form.experienceYears),
      };

      formData.append(
        "profile",
        new Blob([JSON.stringify(profilePayload)], {
          type: "application/json",
        })
      );

      /*
       * Image is optional while updating.
       * Existing image remains when no new image is selected.
       */
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const response = profile
        ? await providerApi.updateProfile(formData)
        : await providerApi.createProfile(formData);

      const value = response.data?.data || response.data;

      setProfile(value);

      setForm({
        ...emptyProfile,
        ...value,
      });

      setSelectedImage(null);
      setImagePreview(value?.profileImage || "");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        profile
          ? "Profile updated successfully"
          : "Provider profile created successfully"
      );
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Could not save your provider profile."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-msp-secondary">
        Loading provider profile...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow">PROFESSIONAL PROFILE</p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display-title">
          {profile
            ? "Update your profile"
            : "Create your provider profile"}
        </h1>

        {profile?.approvalStatus && (
          <span className="inline-flex items-center gap-2 rounded-full bg-msp-softGreen px-4 py-2 text-sm font-bold text-msp-primary">
            <BadgeCheck size={17} />
            {profile.approvalStatus}
          </span>
        )}
      </div>

      <p className="mt-3 text-msp-secondary">
        Customers see these details when they search for a
        professional.
      </p>

      {error && (
        <div className="mt-6">
          <ApiState message={error} />
        </div>
      )}

      <form
        onSubmit={submit}
        className="card mt-7 grid gap-5 p-6 md:grid-cols-2"
      >
        {/* Profile image section */}
        <div className="flex flex-col gap-5 rounded-xl bg-msp-softGreen p-5 md:col-span-2 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Provider profile preview"
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
              />
            ) : (
              <span className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-white text-msp-primary shadow-sm">
                <UserRound size={38} />
              </span>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-msp-primary text-white shadow-md"
              aria-label="Select profile image"
            >
              <Camera size={17} />
            </button>
          </div>

          <div className="flex-1">
            <p className="font-bold text-msp-primary">
              {form.fullName || "Your public profile"}
            </p>

            <p className="mt-1 text-sm text-msp-secondary">
              {profile?.averageRating ?? 0} rating ·{" "}
              {profile?.totalJobsCompleted ?? 0} jobs completed
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <label className="btn-secondary cursor-pointer">
                <Camera size={17} className="mr-2" />
                {selectedImage
                  ? "Change image"
                  : "Select image"}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="text-sm font-semibold text-red-600"
                >
                  Cancel selection
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-msp-secondary">
              JPG, PNG or WEBP. Maximum size: 5 MB.
            </p>
          </div>
        </div>

        <label className="text-sm font-semibold text-msp-primary">
          Full name

          <input
            required
            name="fullName"
            value={form.fullName}
            onChange={update}
            className="field mt-2"
          />
        </label>

        <label className="text-sm font-semibold text-msp-primary">
          Phone

          <input
            required
            name="phone"
            type="tel"
            value={form.phone}
            onChange={update}
            className="field mt-2"
            placeholder="9876543210"
          />
        </label>

        <label className="text-sm font-semibold text-msp-primary">
          Experience (years)

          <input
            required
            name="experienceYears"
            type="number"
            min="0"
            max="60"
            value={form.experienceYears}
            onChange={update}
            className="field mt-2"
          />
        </label>

        <label className="text-sm font-semibold text-msp-primary md:col-span-2">
          Professional description

          <textarea
            required
            name="description"
            maxLength="1000"
            value={form.description || ""}
            onChange={update}
            className="field mt-2 min-h-32"
            placeholder="Describe your experience and the quality of your work."
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} className="mr-2" />

          {saving
            ? "Saving..."
            : profile
              ? "Save profile changes"
              : "Create profile"}
        </button>
      </form>
    </div>
  );
}