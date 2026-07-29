import {
  BadgeCheck,
  BriefcaseBusiness,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { providerApi } from "../../api/providerApi";
import ApiState from "../../components/common/ApiState";
import EmptyState from "../../components/common/EmptyState";
import { services } from "../../data/services";
import useAuth from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/apiError";
import { getDashboardForRole, ROLES } from "../../utils/roles";

const defaultFilters = {
  categoryId: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  sort: "RATING_DESC",
  page: 0,
  size: 9,
};

export default function Providers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategoryId = searchParams.get("categoryId") || "";

  const [filters, setFilters] = useState({
    ...defaultFilters,
    categoryId: initialCategoryId,
  });

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(Boolean(initialCategoryId));
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const selectedService = useMemo(() => {
    return services.find(
      (service) => String(service.id) === String(filters.categoryId),
    );
  }, [filters.categoryId]);

  const hasInvalidRange = useMemo(() => {
    if (filters.minPrice === "" || filters.maxPrice === "") {
      return false;
    }

    return Number(filters.minPrice) > Number(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const hasActiveFilters = Boolean(
    filters.city ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minRating ||
      filters.sort !== "RATING_DESC",
  );

  const updateFilter = (name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      page: 0,
    }));
  };

  const searchProviders = async (customFilters = filters) => {
    if (!customFilters.categoryId) {
      setProviders([]);
      setSearched(false);
      setError("");
      return;
    }

    const invalidPriceRange =
      customFilters.minPrice !== "" &&
      customFilters.maxPrice !== "" &&
      Number(customFilters.minPrice) >
        Number(customFilters.maxPrice);

    if (invalidPriceRange) {
      setError(
        "Minimum price cannot be greater than maximum price.",
      );
      return;
    }

    setLoading(true);
    setSearched(true);
    setError("");

    try {
      const params = Object.fromEntries(
        Object.entries(customFilters).filter(
          ([, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined,
        ),
      );

      const response = await providerApi.search(params);

      const responseBody = response?.data;

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: {
       *     content: [...]
       *   }
       * }
       */
      const providerList =
        responseBody?.data?.content ||
        responseBody?.content ||
        responseBody?.providers ||
        (Array.isArray(responseBody?.data)
          ? responseBody.data
          : []) ||
        (Array.isArray(responseBody) ? responseBody : []);

      setProviders(
        Array.isArray(providerList) ? providerList : [],
      );
    } catch (err) {
      setProviders([]);

      setError(
        getApiErrorMessage(
          err,
          "Provider search is temporarily unavailable. Our team is working to restore it.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const selectService = (service) => {
    const nextFilters = {
      ...filters,
      categoryId: String(service.id),
      page: 0,
    };

    setFilters(nextFilters);

    setSearchParams({
      categoryId: String(service.id),
    });

    searchProviders(nextFilters);
  };

  const submitFilters = (event) => {
    event.preventDefault();

    if (!filters.categoryId) {
      setError("Select a service before applying filters.");
      return;
    }

    searchProviders(filters);
  };

  const clearFilters = () => {
    const nextFilters = {
      ...defaultFilters,
      categoryId: filters.categoryId,
    };

    setFilters(nextFilters);
    setShowFilters(false);
    searchProviders(nextFilters);
  };

  useEffect(() => {
    if (initialCategoryId) {
      searchProviders({
        ...defaultFilters,
        categoryId: initialCategoryId,
      });
    }

    // Run only when the page first loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startBooking = (provider) => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/customer/bookings/new",
          bookingProvider: provider,
          message:
            "Log in as a customer to book this provider.",
        },
      });

      return;
    }

    if (role !== ROLES.CUSTOMER) {
      navigate(getDashboardForRole(role), {
        state: {
          notice:
            "Only customer accounts can create bookings.",
        },
      });

      return;
    }

    navigate("/customer/bookings/new", {
      state: {
        provider,
      },
    });
  };

  return (
    <main className="page-shell">
      {/* Hero section */}
      <section className="rounded-3xl bg-gradient-to-br from-msp-softGreen to-msp-softWarm px-6 py-10 md:px-10">
        <div className="max-w-3xl">
          <p className="eyebrow">
            VERIFIED PROFESSIONALS
          </p>

          <h1 className="mt-4 display-title">
            Choose a service and find trusted
            professionals.
          </h1>

          <p className="mt-4 text-lg leading-8 text-msp-secondary">
            Browse approved professionals without signing in.
            Login is required only when you create a booking.
          </p>
        </div>
      </section>

      {/* Service categories */}
      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">OUR SERVICES</p>

            <h2 className="mt-2 font-display text-3xl font-bold text-msp-primary">
              What service do you need?
            </h2>

            <p className="mt-2 text-msp-secondary">
              Select a category to view available providers.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters((currentValue) => !currentValue)
            }
            className="btn-secondary relative self-start sm:self-auto"
          >
            <SlidersHorizontal
              size={18}
              className="mr-2"
            />

            {showFilters ? "Hide filters" : "Filters"}

            {hasActiveFilters && (
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-msp-accent" />
            )}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon;

            const isSelected =
              String(filters.categoryId) ===
              String(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => selectService(service)}
                className={`group rounded-2xl border p-5 text-left transition duration-300 ${
                  isSelected
                    ? "border-msp-primary bg-msp-primary text-white shadow-msp"
                    : "border-msp-border bg-white text-msp-primary hover:-translate-y-1 hover:border-msp-primary hover:shadow-msp"
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : "bg-msp-softGreen text-msp-primary"
                  }`}
                >
                  {Icon && <Icon size={22} />}
                </span>

                <h3 className="mt-4 font-bold">
                  {service.title}
                </h3>

                <p
                  className={`mt-2 line-clamp-2 text-sm leading-6 ${
                    isSelected
                      ? "text-white/75"
                      : "text-msp-secondary"
                  }`}
                >
                  {service.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Advanced filters */}
      {showFilters && (
        <section className="mt-8 rounded-3xl border border-msp-border bg-white p-6 shadow-msp">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-msp-primary">
                Refine your results
              </h2>

              <p className="mt-1 text-sm text-msp-secondary">
                Filter providers by location, price and rating.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="rounded-full p-2 text-msp-secondary transition hover:bg-msp-softGreen hover:text-msp-primary"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={submitFilters}
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5"
          >
            <label className="text-sm font-semibold text-msp-primary">
              City
              <input
                type="text"
                value={filters.city}
                onChange={(event) =>
                  updateFilter(
                    "city",
                    event.target.value,
                  )
                }
                placeholder="For example, Pune"
                className="field mt-2 bg-white"
              />
            </label>

            <label className="text-sm font-semibold text-msp-primary">
              Minimum price
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) =>
                  updateFilter(
                    "minPrice",
                    event.target.value,
                  )
                }
                placeholder="₹0"
                className="field mt-2 bg-white"
              />
            </label>

            <label className="text-sm font-semibold text-msp-primary">
              Maximum price
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) =>
                  updateFilter(
                    "maxPrice",
                    event.target.value,
                  )
                }
                placeholder="₹5000"
                className="field mt-2 bg-white"
              />
            </label>

            <label className="text-sm font-semibold text-msp-primary">
              Minimum rating
              <select
                value={filters.minRating}
                onChange={(event) =>
                  updateFilter(
                    "minRating",
                    event.target.value,
                  )
                }
                className="field mt-2 bg-white"
              >
                <option value="">Any rating</option>
                <option value="4.5">4.5 and above</option>
                <option value="4">
                  4.0 and above
                </option>
                <option value="3.5">
                  3.5 and above
                </option>
                <option value="3">
                  3.0 and above
                </option>
              </select>
            </label>

            <label className="text-sm font-semibold text-msp-primary">
              Sort by
              <select
                value={filters.sort}
                onChange={(event) =>
                  updateFilter(
                    "sort",
                    event.target.value,
                  )
                }
                className="field mt-2 bg-white"
              >
                <option value="RATING_DESC">
                  Top rated
                </option>

                <option value="PRICE_ASC">
                  Price: low to high
                </option>

                <option value="PRICE_DESC">
                  Price: high to low
                </option>

                <option value="EXPERIENCE_DESC">
                  Most experienced
                </option>
              </select>
            </label>

            {hasInvalidRange && (
              <p className="text-sm font-medium text-red-600 md:col-span-2 lg:col-span-5">
                Minimum price cannot be greater than maximum
                price.
              </p>
            )}

            <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-5">
              <button
                type="submit"
                disabled={
                  loading ||
                  hasInvalidRange ||
                  !filters.categoryId
                }
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search
                  size={17}
                  className="mr-2"
                />

                {loading
                  ? "Searching..."
                  : "Apply filters"}
              </button>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!filters.categoryId}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear filters
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Selected service heading */}
      {selectedService && (
        <section className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">
              AVAILABLE PROFESSIONALS
            </p>

            <h2 className="mt-2 font-display text-3xl font-bold text-msp-primary">
              {selectedService.title}
            </h2>

            <p className="mt-2 text-msp-secondary">
              Showing approved providers for this service.
            </p>
          </div>

          {!loading && searched && (
            <p className="text-sm font-semibold text-msp-secondary">
              {providers.length}{" "}
              {providers.length === 1
                ? "provider"
                : "providers"}{" "}
              found
            </p>
          )}
        </section>
      )}

      {/* Loading cards */}
      {loading && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="card animate-pulse overflow-hidden p-6"
            >
              <div className="h-5 w-24 rounded bg-msp-border" />
              <div className="mt-5 h-8 w-3/4 rounded bg-msp-border" />
              <div className="mt-6 h-4 w-1/2 rounded bg-msp-border" />
              <div className="mt-3 h-4 w-2/3 rounded bg-msp-border" />
              <div className="mt-8 h-12 rounded bg-msp-border" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-8">
          <ApiState
            message={error}
            onRetry={() => searchProviders(filters)}
          />
        </div>
      )}

      {/* No category selected */}
      {!error && !searched && !loading && (
        <div className="mt-8">
          <EmptyState
            title="Select a service"
            message="Choose Plumbing, Electrical, Cleaning or another service to view available professionals."
          />
        </div>
      )}

      {/* Empty result */}
      {!error &&
        searched &&
        providers.length === 0 &&
        !loading && (
          <div className="mt-8">
            <EmptyState
              title={`No ${
                selectedService?.title || "service"
              } providers found`}
              message="Try clearing the filters or selecting another service category."
            />
          </div>
        )}

      {/* Provider cards */}
      {!loading &&
        !error &&
        providers.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider, index) => {
              const id =
                provider.providerId ||
                provider.id ||
                `${provider.fullName}-${index}`;

              const rating = Number(
                provider.averageRating,
              );

              return (
                <article
                  key={id}
                  className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-msp-lg"
                >
                  <div className="h-1.5 bg-msp-accent" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-msp-softGreen px-3 py-1 text-xs font-bold uppercase tracking-wider text-msp-primary">
                          <BadgeCheck size={14} />
                          Approved
                        </span>

                        <h2 className="mt-4 font-display text-2xl font-bold text-msp-primary">
                          {provider.fullName ||
                            provider.providerName ||
                            "Service professional"}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-msp-accent">
                          {provider.categoryName ||
                            selectedService?.title ||
                            "Professional service"}
                        </p>
                      </div>

                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
                        <Star
                          size={14}
                          fill={
                            rating > 0
                              ? "currentColor"
                              : "none"
                          }
                        />

                        {rating > 0
                          ? rating.toFixed(1)
                          : "New"}
                      </span>
                    </div>

                    {provider.description && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-msp-secondary">
                        {provider.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-3 text-sm text-msp-secondary">
                      <p className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="shrink-0 text-msp-accent"
                        />

                        {provider.city
                          ? `${provider.city}${
                              provider.state
                                ? `, ${provider.state}`
                                : ""
                            }`
                          : "Service area available"}
                      </p>

                      <p className="flex items-center gap-2">
                        <BriefcaseBusiness
                          size={17}
                          className="shrink-0 text-msp-accent"
                        />

                        {provider.experienceYears
                          ? `${provider.experienceYears} years experience`
                          : "Recently joined professional"}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-t border-msp-border pt-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-msp-muted">
                          Starts from
                        </span>

                        <strong className="text-2xl text-msp-primary">
                          {provider.basePrice != null ||
                          provider.price != null
                            ? `₹${
                                provider.basePrice ??
                                provider.price
                              }`
                            : "Price on request"}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          startBooking(provider)
                        }
                        className="btn-primary !px-5 !py-2.5"
                      >
                        Book now
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </main>
  );
}