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

export default function ProviderBookings() {
  const [items, setItems] = useState([]);
  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] =
    useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } =
        await bookingApi.getProviderBookings();

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
          "Provider booking requests are temporarily unavailable."
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

  const closeBookingDetails = () => {
    if (actionLoadingId) {
      return;
    }

    setSelectedBooking(null);
  };

  const handleAccept = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);

      await bookingApi.acceptBooking(bookingId);

      toast.success("Booking accepted");
      setSelectedBooking(null);

      await load();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to accept booking."
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reason = window.prompt(
      "Enter rejection reason"
    );

    if (!reason?.trim()) {
      return;
    }

    try {
      setActionLoadingId(bookingId);

      await bookingApi.rejectBooking(bookingId, {
        reason: reason.trim(),
      });

      toast.success("Booking rejected");
      setSelectedBooking(null);

      await load();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to reject booking."
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStart = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);

      await bookingApi.startBooking(bookingId);

      toast.success("Booking started");
      setSelectedBooking(null);

      await load();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to start booking."
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);

      await bookingApi.completeBooking(bookingId);

      toast.success("Booking completed");
      setSelectedBooking(null);

      await load();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to complete booking."
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderBookingActions = (booking) => {
    const bookingId = getBookingId(booking);
    const status = getBookingStatus(booking);

    const isActionLoading =
      actionLoadingId === bookingId;

    if (status === "PENDING") {
      return (
        <>
          <button
            type="button"
            onClick={() =>
              handleAccept(bookingId)
            }
            disabled={isActionLoading}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isActionLoading
              ? "Processing..."
              : "Accept booking"}
          </button>

          <button
            type="button"
            onClick={() =>
              handleReject(bookingId)
            }
            disabled={isActionLoading}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reject booking
          </button>
        </>
      );
    }

    if (status === "ACCEPTED") {
      return (
        <button
          type="button"
          onClick={() =>
            handleStart(bookingId)
          }
          disabled={isActionLoading}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isActionLoading
            ? "Processing..."
            : "Start service"}
        </button>
      );
    }

    if (status === "IN_PROGRESS") {
      return (
        <button
          type="button"
          onClick={() =>
            handleComplete(bookingId)
          }
          disabled={isActionLoading}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isActionLoading
            ? "Processing..."
            : "Mark completed"}
        </button>
      );
    }

    return (
      <p className="text-sm font-semibold text-msp-secondary">
        No further action is available for this
        booking.
      </p>
    );
  };

  return (
    <div>
      <p className="eyebrow">
        SERVICE REQUESTS
      </p>

      <h1 className="mt-2 display-title">
        Provider bookings
      </h1>

      <p className="mt-2 text-msp-secondary">
        Click any booking to view its complete
        information and update its status.
      </p>

      {error && (
        <div className="mt-6">
          <ApiState
            message={error}
            onRetry={load}
          />
        </div>
      )}

      {loading && (
        <p className="mt-6 text-msp-secondary">
          Loading requests...
        </p>
      )}

      {!loading &&
        !error &&
        items.length === 0 && (
          <div className="mt-6">
            <EmptyState
              title="No service requests"
              message="New bookings assigned to you will appear here automatically."
            />
          </div>
        )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((booking) => {
          const bookingId =
            getBookingId(booking);

          const status =
            getBookingStatus(booking);

          return (
            <article
              key={bookingId}
              onClick={() =>
                setSelectedBooking(booking)
              }
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
                      "Customer service request"}
                  </h2>
                </div>

                <StatusBadge status={status} />
              </div>

              <div className="mt-5 space-y-3 text-sm text-msp-secondary">
                <div className="flex items-start gap-2">
                  <UserRound
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    Customer ID:{" "}
                    {booking.customerId ||
                      booking.userId ||
                      booking.customerAuthUserId ||
                      "Not available"}
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
                      .join(", ") ||
                      "Location not available"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={17} />

                  <span>
                    {booking.scheduledDate ||
                      "Date not available"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={17} />

                  <span>
                    {booking.scheduledTime ||
                      "Time not available"}
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
          onClose={closeBookingDetails}
          renderActions={renderBookingActions}
          getBookingId={getBookingId}
          getBookingStatus={getBookingStatus}
        />
      )}
    </div>
  );
}

function BookingDetailsModal({
  booking,
  actionLoadingId,
  onClose,
  renderActions,
  getBookingId,
  getBookingStatus,
}) {
  const bookingId = getBookingId(booking);
  const status = getBookingStatus(booking);

  const customerId =
    booking.customerId ||
    booking.userId ||
    booking.customerAuthUserId;

  const address = [
    booking.serviceAddress,
    booking.city,
    booking.state,
    booking.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const isActionLoading =
    actionLoadingId === bookingId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-msp-accent">
              Booking #{bookingId}
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-msp-primary">
              {booking.categoryName ||
                booking.serviceName ||
                "Service request"}
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
            Customer information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={UserRound}
              label="Customer ID"
              value={customerId}
            />

            <DetailItem
              icon={UserRound}
              label="Customer name"
              value={
                booking.customerName ||
                booking.fullName
              }
            />

            <DetailItem
              icon={UserRound}
              label="Customer phone"
              value={
                booking.customerPhone ||
                booking.phone ||
                booking.mobile
              }
            />

            <DetailItem
              icon={UserRound}
              label="Customer email"
              value={
                booking.customerEmail ||
                booking.email
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-200 p-5">
          <h3 className="text-lg font-bold text-msp-primary">
            Service details
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={MapPin}
              label="Service address"
              value={address}
            />

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
                booking.estimatedPrice != null
                  ? `₹${booking.estimatedPrice}`
                  : null
              }
            />

            <DetailItem
              icon={UserRound}
              label="Provider ID"
              value={booking.providerId}
            />

            <DetailItem
              icon={UserRound}
              label="Category ID"
              value={booking.categoryId}
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
          </div>

          {(booking.description ||
            booking.customerNote ||
            booking.notes) && (
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-msp-secondary">
                Customer note
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

        {/* <section className="mt-5 rounded-2xl border border-dashed border-gray-300 p-5">
          <h3 className="font-bold text-msp-primary">
            Available booking data
          </h3>

          <p className="mt-1 text-sm text-msp-secondary">
            This section temporarily shows every
            field returned by the backend.
          </p>

          <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-5 text-gray-100">
            {JSON.stringify(booking, null, 2)}
          </pre>
        </section> */}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-5">
          {renderActions(booking)}

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
          {value !== undefined &&
          value !== null &&
          value !== ""
            ? String(value)
            : "Not available"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING:
      "bg-yellow-100 text-yellow-800",
    ACCEPTED:
      "bg-blue-100 text-blue-800",
    IN_PROGRESS:
      "bg-purple-100 text-purple-800",
    COMPLETED:
      "bg-green-100 text-green-800",
    REJECTED:
      "bg-red-100 text-red-800",
    CANCELLED:
      "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}