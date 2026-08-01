import {
  BriefcaseBusiness,
  Heart,
  LoaderCircle,
  MapPin,
  Search,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { providerApi } from "../../api/providerApi";
import { userApi } from "../../api/userApi";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CustomerFavorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const favoriteResponse =
        await userApi.getFavorites();

      const favoriteData =
        favoriteResponse?.data?.data ??
        favoriteResponse?.data ??
        [];

      if (!Array.isArray(favoriteData)) {
        setFavorites([]);
        return;
      }

      const favoriteProviders =
        await Promise.all(
          favoriteData.map(async (favorite) => {
            try {
              const providerResponse =
                await providerApi.getProviderById(
                  favorite.providerId
                );

              const provider =
                providerResponse?.data?.data ??
                providerResponse?.data ??
                {};

              return {
                ...provider,
                favoriteId: favorite.id,
                favoriteCreatedAt:
                  favorite.createdAt,
                providerId:
                  provider?.providerId ??
                  provider?.id ??
                  favorite.providerId,
              };
            } catch (providerError) {
              console.error(
                `Unable to fetch provider ${favorite.providerId}:`,
                providerError?.response?.data ||
                  providerError
              );

              return {
                favoriteId: favorite.id,
                favoriteCreatedAt:
                  favorite.createdAt,
                providerId:
                  favorite.providerId,
                providerLoadFailed: true,
              };
            }
          })
        );

      setFavorites(favoriteProviders);
    } catch (error) {
      console.error(
        "Favorites load error:",
        error?.response?.data || error
      );

      setError(
        getApiErrorMessage(
          error,
          "Unable to load favorite providers."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite =
    async (favorite) => {
      const providerId =
        favorite?.providerId;

      if (!providerId) {
        toast.error(
          "Provider ID is not available."
        );
        return;
      }

      const confirmed = window.confirm(
        "Remove this provider from favorites?"
      );

      if (!confirmed) {
        return;
      }

      try {
        setRemovingId(providerId);

        await userApi.removeFavorite(
          providerId
        );

        setFavorites((previous) =>
          previous.filter(
            (item) =>
              item.providerId !==
              providerId
          )
        );

        toast.success(
          "Provider removed from favorites."
        );
      } catch (error) {
        console.error(
          "Remove favorite error:",
          error?.response?.data || error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to remove this provider."
          )
        );
      } finally {
        setRemovingId(null);
      }
    };

  const handleBookProvider =
    (favorite) => {
      const providerId =
        favorite?.providerId;

      const categoryId =
        favorite?.categoryId ||
        favorite?.skill?.categoryId ||
        "";

      const params =
        new URLSearchParams();

      if (providerId) {
        params.set(
          "providerId",
          providerId
        );
      }

      if (categoryId) {
        params.set(
          "categoryId",
          categoryId
        );
      }

      navigate(
        `/customer/bookings/new?${params.toString()}`
      );
    };

  const handleFindProviders = () => {
    navigate("/providers");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            FAVORITE PROVIDERS
          </p>

          <h1 className="mt-3 display-title">
            Your saved professionals
          </h1>

          <p className="mt-3 max-w-2xl text-msp-secondary">
            View and book the service
            professionals saved to your
            customer account.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFindProviders}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Search size={18} />
          Find providers
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8">
        <div>
          <h2 className="text-xl font-bold text-msp-primary">
            Saved providers
          </h2>

          <p className="mt-1 text-sm text-msp-secondary">
            {favorites.length}{" "}
            {favorites.length === 1
              ? "provider"
              : "providers"}{" "}
            saved
          </p>
        </div>

        {loading ? (
          <LoadingFavorites />
        ) : favorites.length === 0 ? (
          <EmptyFavorites
            onSearch={
              handleFindProviders
            }
          />
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map(
              (favorite, index) => (
                <FavoriteCard
                  key={
                    favorite.favoriteId ||
                    favorite.providerId ||
                    index
                  }
                  favorite={favorite}
                  removing={
                    removingId ===
                    favorite.providerId
                  }
                  onBook={() =>
                    handleBookProvider(
                      favorite
                    )
                  }
                  onRemove={() =>
                    handleRemoveFavorite(
                      favorite
                    )
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

function FavoriteCard({
  favorite,
  removing,
  onBook,
  onRemove,
}) {
  if (favorite.providerLoadFailed) {
    return (
      <article className="card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600">
            <UserRound size={26} />
          </div>

          <div>
            <h3 className="font-bold text-msp-primary">
              Provider unavailable
            </h3>

            <p className="mt-1 text-sm text-msp-secondary">
              Provider ID:{" "}
              {favorite.providerId}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-msp-secondary">
          The provider details could not be
          loaded at this time.
        </p>

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {removing ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={16} />
          )}

          Remove favorite
        </button>
      </article>
    );
  }

  const fullName =
    favorite?.fullName ||
    favorite?.providerName ||
    "Service provider";

  const profileImage =
    favorite?.profileImage ||
    favorite?.profileImageUrl ||
    null;

  const categoryName =
    favorite?.categoryName ||
    favorite?.serviceName ||
    favorite?.category?.name ||
    "Service provider";

  const city =
    favorite?.city ||
    favorite?.primaryAddress?.city ||
    favorite?.address?.city ||
    "Location not available";

  const state =
    favorite?.state ||
    favorite?.primaryAddress?.state ||
    favorite?.address?.state ||
    "";

  const rating =
    favorite?.averageRating ??
    favorite?.rating ??
    0;

  const experience =
    favorite?.experienceYears ??
    favorite?.experience ??
    null;

  const jobsCompleted =
    favorite?.totalJobsCompleted ??
    null;

  const basePrice =
    favorite?.basePrice ??
    favorite?.price ??
    favorite?.skill?.basePrice ??
    null;

  return (
    <article className="card overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-msp-primary to-msp-accent">
        <div className="absolute left-5 top-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-msp-primary">
            <Heart
              size={13}
              className="fill-current"
            />
            Favorite
          </span>
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="-mt-12 flex items-end justify-between gap-3">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-msp-softGreen text-2xl font-bold text-msp-accent shadow-md">
            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={38} />
            )}
          </div>

          {Number(rating) > 0 && (
            <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
              <Star
                size={15}
                className="fill-current"
              />

              {Number(rating).toFixed(1)}
            </div>
          )}
        </div>

        <h3 className="mt-4 text-xl font-bold text-msp-primary">
          {fullName}
        </h3>

        <p className="mt-1 text-sm font-semibold text-msp-accent">
          {categoryName}
        </p>

        <div className="mt-4 space-y-3 text-sm text-msp-secondary">
          <InfoRow
            icon={MapPin}
            text={
              state
                ? `${city}, ${state}`
                : city
            }
          />

          {experience !== null && (
            <InfoRow
              icon={BriefcaseBusiness}
              text={`${experience} ${
                Number(experience) === 1
                  ? "year"
                  : "years"
              } experience`}
            />
          )}

          {jobsCompleted !== null && (
            <InfoRow
              icon={UserRound}
              text={`${jobsCompleted} jobs completed`}
            />
          )}
        </div>

        {basePrice !== null && (
          <div className="mt-5 rounded-2xl bg-msp-softGreen px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-msp-muted">
              Starting price
            </p>

            <p className="mt-1 text-xl font-bold text-msp-primary">
              ₹
              {Number(
                basePrice
              ).toLocaleString("en-IN")}
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-2 border-t border-msp-border pt-5">
          <button
            type="button"
            onClick={onBook}
            className="btn-primary flex-1"
          >
            Book now
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Remove provider from favorites"
          >
            {removing ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={16}
        className="shrink-0 text-msp-accent"
      />

      <span>{text}</span>
    </div>
  );
}

function LoadingFavorites() {
  return (
    <div className="mt-5 flex min-h-[280px] items-center justify-center rounded-3xl border border-msp-border bg-white">
      <div className="text-center">
        <LoaderCircle
          size={36}
          className="mx-auto animate-spin text-msp-accent"
        />

        <p className="mt-3 text-msp-secondary">
          Loading favorite providers...
        </p>
      </div>
    </div>
  );
}

function EmptyFavorites({
  onSearch,
}) {
  return (
    <div className="card mt-5 flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-msp-softGreen text-msp-accent">
        <Heart size={30} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-msp-primary">
        No favorite providers yet
      </h3>

      <p className="mt-2 max-w-md text-msp-secondary">
        Explore available providers and
        save the professionals you would
        like to book again.
      </p>

      <button
        type="button"
        onClick={onSearch}
        className="btn-primary mt-6 inline-flex items-center gap-2"
      >
        <Search size={18} />
        Browse providers
      </button>
    </div>
  );
}