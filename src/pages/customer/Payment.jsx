import {
    ArrowLeft,
    Banknote,
    CheckCircle2,
    CreditCard,
    IndianRupee,
    Smartphone,
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import { bookingApi } from "../../api/bookingApi";
import { getApiErrorMessage } from "../../utils/apiError";

const paymentMethods = [
    {
        value: "CREDIT_CARD",
        label: "Credit / Debit Card",
        description: "Pay securely using your card",
        icon: CreditCard,
    },
    {
        value: "UPI",
        label: "UPI",
        description: "Pay using Google Pay, PhonePe, Paytm or any UPI app",
        icon: Smartphone,
    },
    {
        value: "CASH",
        label: "Cash",
        description: "Pay the provider using cash",
        icon: Banknote,
    },
];

export default function Payment() {
    const { bookingId } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const booking = location.state?.booking;

    const [selectedMethod, setSelectedMethod] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const status = String(
        booking?.bookingStatus ||
        booking?.status ||
        ""
    ).toUpperCase();

    const paymentStatus = String(
        booking?.paymentStatus ||
        "PENDING"
    ).toUpperCase();

    const amount =
        booking?.estimatedPrice ??
        booking?.finalPrice ??
        0;

    const handlePayment = async () => {
        if (!selectedMethod) {
            setError("Please select a payment method.");
            return;
        }

        if (status !== "COMPLETED") {
            setError(
                "Payment is available only after the booking is completed."
            );
            return;
        }

        try {
            setProcessing(true);
            setError("");

            await bookingApi.updatePayment(
                bookingId,
                {
                    paymentStatus: "PAID",
                    paymentMethod: selectedMethod,
                }
            );

            toast.success("Payment completed successfully");

            navigate("/customer/bookings", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Payment update failed:",
                error.response?.data || error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Unable to complete the payment."
                )
            );
        } finally {
            setProcessing(false);
        }
    };

    if (!booking) {
        return (
            <div className="mx-auto max-w-2xl">
                <div className="card p-8 text-center">
                    <h1 className="font-display text-2xl font-bold text-msp-primary">
                        Booking information is missing
                    </h1>

                    <p className="mt-3 text-msp-secondary">
                        Open the payment page from your booking
                        details.
                    </p>

                    <Link
                        to="/customer/bookings"
                        className="btn-primary mt-6 inline-flex"
                    >
                        View bookings
                    </Link>
                </div>
            </div>
        );
    }

    if (paymentStatus === "PAID") {
        return (
            <div className="mx-auto max-w-2xl">
                <div className="card p-8 text-center">
                    <CheckCircle2
                        size={52}
                        className="mx-auto text-green-600"
                    />

                    <h1 className="mt-4 font-display text-2xl font-bold text-msp-primary">
                        Payment already completed
                    </h1>

                    <p className="mt-2 text-msp-secondary">
                        Payment for booking #{bookingId} has
                        already been completed.
                    </p>

                    <Link
                        to="/customer/bookings"
                        className="btn-primary mt-6 inline-flex"
                    >
                        Back to bookings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link
                to="/customer/bookings"
                className="inline-flex items-center gap-2 font-bold text-msp-accent"
            >
                <ArrowLeft size={18} />
                Back to bookings
            </Link>

            <div className="card mt-6 p-6 md:p-8">
                <p className="eyebrow">PAYMENT</p>

                <h1 className="mt-2 display-title">
                    Complete your payment
                </h1>

                <p className="mt-2 text-msp-secondary">
                    Select a payment method for booking #
                    {bookingId}.
                </p>

                <div className="mt-6 rounded-2xl bg-msp-softGreen p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-msp-secondary">
                                Service
                            </p>

                            <p className="mt-1 text-lg font-bold text-msp-primary">
                                {booking.categoryName ||
                                    booking.serviceName ||
                                    "Booked service"}
                            </p>

                            <p className="mt-1 text-sm text-msp-secondary">
                                Provider:{" "}
                                {booking.providerName ||
                                    `Provider #${booking.providerId}`}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-semibold text-msp-secondary">
                                Amount
                            </p>

                            <p className="mt-1 flex items-center text-2xl font-bold text-msp-primary">
                                <IndianRupee size={22} />
                                {amount}
                            </p>
                        </div>
                    </div>
                </div>

                {status !== "COMPLETED" && (
                    <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-semibold text-yellow-800">
                        This booking is not completed yet.
                        Payment will become available after
                        completion.
                    </div>
                )}

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <div className="mt-7">
                    <h2 className="text-lg font-bold text-msp-primary">
                        Select payment method
                    </h2>

                    <div className="mt-4 grid gap-4">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            const selected =
                                selectedMethod === method.value;

                            return (
                                <button
                                    key={method.value}
                                    type="button"
                                    disabled={
                                        processing ||
                                        status !== "COMPLETED"
                                    }
                                    onClick={() => {
                                        setSelectedMethod(method.value);
                                        setError("");
                                    }}
                                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${selected
                                            ? "border-msp-accent bg-msp-softGreen"
                                            : "border-gray-200 hover:border-msp-accent"
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-msp-primary shadow-sm">
                                        <Icon size={23} />
                                    </span>

                                    <span className="flex-1">
                                        <span className="block font-bold text-msp-primary">
                                            {method.label}
                                        </span>

                                        <span className="mt-1 block text-sm text-msp-secondary">
                                            {method.description}
                                        </span>
                                    </span>

                                    <span
                                        className={`h-5 w-5 rounded-full border-2 ${selected
                                                ? "border-msp-accent bg-msp-accent"
                                                : "border-gray-300"
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handlePayment}
                    disabled={
                        processing ||
                        !selectedMethod ||
                        status !== "COMPLETED"
                    }
                    className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing
                        ? "Processing payment..."
                        : `Pay ₹${amount}`}
                </button>
            </div>
        </div>
    );
}