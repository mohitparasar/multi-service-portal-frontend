import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  IndianRupee,
  MapPin,
  UserRound,
  X,
} from "lucide-react";

import { bookingApi } from "../../api/bookingApi";
import ApiState from "../../components/common/ApiState";
import EmptyState from "../../components/common/EmptyState";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CustomerBookings() {
  const [items, setItems] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await bookingApi.getCustomerBookings();

      const bookings =
        data?.data?.content ||
        data?.content ||
        data?.bookings ||
        data?.data ||
        data ||
        [];

      setItems(Array.isArray(bookings) ? bookings : []);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Customer bookings are temporarily unavailable."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getBookingId = (booking) =>
    booking?.bookingId || booking?.id;

  const getBookingStatus = (booking) =>
    booking?.status ||
    booking?.bookingStatus ||
    "PENDING";

  const closeDetails = () => {
    if (actionLoadingId !== null) {
      return;
    }

    setSelectedBooking(null);
  };

  const handleCancelBooking = async (booking) => {
  const bookingId = getBookingId(booking);

  const remarks = window.prompt(
    "Enter the reason for cancelling this booking"
  );

  if (!remarks?.trim()) {
    return;
  }

  try {
    setActionLoadingId(bookingId);

    await bookingApi.cancel(bookingId, {
      cancellationReason: "CUSTOMER_CANCELLED",
      cancellationRemarks: remarks.trim(),
    });

    toast.success("Booking cancelled successfully");

    setSelectedBooking(null);

    await load();
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error.response?.data
    );

    toast.error(
      getApiErrorMessage(
        error,
        "Unable to cancel the booking."
      )
    );
  } finally {
    setActionLoadingId(null);
  }
};

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">MY BOOKINGS</p>

          <h1 className="mt-2 display-title">
            Track service requests
          </h1>

          <p className="mt-2 text-msp-secondary">
            View booking information and track the progress of your services.
          </p>
        </div>

        <Link to="/providers" className="btn-primary">
          Create booking
        </Link>
      </div>

      {error && (
        <div className="mt-6">
          <ApiState message={error} onRetry={load} />
        </div>
      )}

      {loading && (
        <p className="mt-6 text-msp-secondary">
          Loading bookings...
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No bookings yet"
            message="Search for a provider and create your first booking."
            action={
              <Link className="btn-primary" to="/providers">
                Find providers
              </Link>
            }
          />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((booking) => {
          const bookingId = getBookingId(booking);
          const status = getBookingStatus(booking);

          return (
            <article
              key={bookingId}
              onClick={() => setSelectedBooking(booking)}
              className="card cursor-pointer p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-msp-accent">
                    Booking #{bookingId}
                  </p>

                  <h2 className="mt-2 font-display text-xl font-bold text-msp-primary">
                    {booking.categoryName ||
                      booking.serviceName ||
                      "Booked service"}
                  </h2>

                  <p className="mt-2 text-sm text-msp-secondary">
                    Provider:{" "}
                    {booking.providerName ||
                      `Provider #${booking.providerId || "N/A"}`}
                  </p>
                </div>

                <StatusBadge status={status} />
              </div>

              <div className="mt-5 space-y-3 text-sm text-msp-secondary">
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} />

                  <span>
                    {booking.scheduledDate || "Date not available"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={17} />

                  <span>
                    {booking.scheduledTime || "Time not available"}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {[
                      booking.serviceAddress,
                      booking.city,
                      booking.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location not available"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary mt-5 w-full"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedBooking(booking);
                }}
              >
                View booking details
              </button>
            </article>
          );
        })}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          actionLoadingId={actionLoadingId}
          getBookingId={getBookingId}
          getBookingStatus={getBookingStatus}
          onClose={closeDetails}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
}

function BookingDetailsModal({
  booking,
  actionLoadingId,
  getBookingId,
  getBookingStatus,
  onClose,
  onCancel,
}) {
  const bookingId = getBookingId(booking);
  const status = getBookingStatus(booking);

  const isActionLoading =
    actionLoadingId === bookingId;

  const address = [
    booking.serviceAddress,
    booking.city,
    booking.state,
    booking.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const canCancel = [
    "CREATED",
    "PENDING",
    "ACCEPTED",
  ].includes(status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-msp-accent">
              Booking #{bookingId}
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-msp-primary">
              {booking.categoryName ||
                booking.serviceName ||
                "Service booking"}
            </h2>

            <div className="mt-3">
              <StatusBadge status={status} />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close booking details"
          >
            <X size={20} />
          </button>
        </div>

        <section className="mt-6 rounded-2xl bg-msp-softGreen p-5">
          <h3 className="text-lg font-bold text-msp-primary">
            Provider information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={UserRound}
              label="Provider ID"
              value={booking.providerId}
            />

            <DetailItem
              icon={UserRound}
              label="Provider name"
              value={booking.providerName}
            />

            <DetailItem
              icon={UserRound}
              label="Category ID"
              value={booking.categoryId}
            />

            <DetailItem
              icon={UserRound}
              label="Service"
              value={
                booking.categoryName ||
                booking.serviceName
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-msp-primary">
            Booking information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label="Scheduled date"
              value={booking.scheduledDate}
            />

            <DetailItem
              icon={Clock3}
              label="Scheduled time"
              value={booking.scheduledTime}
            />

            <DetailItem
              icon={IndianRupee}
              label="Estimated price"
              value={
                booking.estimatedPrice !== undefined &&
                booking.estimatedPrice !== null
                  ? `₹${booking.estimatedPrice}`
                  : null
              }
            />

            <DetailItem
              icon={UserRound}
              label="Payment status"
              value={booking.paymentStatus}
            />

            <DetailItem
              icon={UserRound}
              label="Booking status"
              value={status}
            />

            <DetailItem
              icon={MapPin}
              label="Service address"
              value={address}
            />
          </div>

          {(booking.description ||
            booking.customerNote ||
            booking.notes) && (
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-msp-secondary">
                Service description
              </p>

              <p className="mt-2 text-sm leading-6 text-msp-primary">
                {booking.description ||
                  booking.customerNote ||
                  booking.notes}
              </p>
            </div>
          )}

          {booking.rejectionReason && (
            <div className="mt-5 rounded-xl bg-red-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                Rejection reason
              </p>

              <p className="mt-2 text-sm text-red-700">
                {booking.rejectionReason}
              </p>
            </div>
          )}

          {booking.cancellationReason && (
            <div className="mt-5 rounded-xl bg-red-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                Cancellation reason
              </p>

              <p className="mt-2 text-sm text-red-700">
                {booking.cancellationReason}
              </p>
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-5">
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              disabled={isActionLoading}
              className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isActionLoading
                ? "Cancelling..."
                : "Cancel booking"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={isActionLoading}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  const displayValue =
    value !== undefined &&
    value !== null &&
    value !== ""
      ? String(value)
      : "Not available";

  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-msp-primary shadow-sm">
        <Icon size={18} />
      </span>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-msp-secondary">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-msp-primary">
          {displayValue}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus =
    String(status || "PENDING").toUpperCase();

  const styles = {
    CREATED: "bg-yellow-100 text-yellow-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-flex h-fit rounded-full px-3 py-1 text-xs font-bold ${
        styles[normalizedStatus] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {normalizedStatus.replaceAll("_", " ")}
    </span>
  );
}