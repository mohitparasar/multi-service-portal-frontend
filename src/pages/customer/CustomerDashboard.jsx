import {
  CalendarCheck,
  Heart,
  Search,
  ArrowRight,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-msp-primary to-msp-accent p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] opacity-80">
          CUSTOMER PORTAL
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="mt-3 max-w-2xl text-white/90">
          Book trusted professionals, manage your bookings,
          and track every service from one place.
        </p>

        <Link
          to="/providers"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-msp-primary transition hover:scale-105"
        >
          Find Providers
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid gap-6 md:grid-cols-3">

        <StatCard
          icon={CalendarCheck}
          title="Active Bookings"
          value="0"
          color="bg-blue-100 text-blue-700"
        />

        <StatCard
          icon={BadgeCheck}
          title="Completed Services"
          value="0"
          color="bg-green-100 text-green-700"
        />

        <StatCard
          icon={Heart}
          title="Favourite Providers"
          value="0"
          color="bg-pink-100 text-pink-700"
        />

      </section>

      {/* Quick Actions */}

      <section>

        <h2 className="mb-5 text-2xl font-bold text-msp-primary">
          Quick Actions
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <ActionCard
            icon={Search}
            title="Find Providers"
            description="Browse verified professionals near you."
            to="/providers"
          />

          <ActionCard
            icon={CalendarCheck}
            title="My Bookings"
            description="Track all current and previous bookings."
            to="/customer/bookings"
          />

          <ActionCard
            icon={Heart}
            title="Favourite Providers"
            description="View providers you have saved."
            to="/customer/favorites"
          />

        </div>

      </section>

      {/* Recent Activity */}

      <section className="card p-6">

        <div className="flex items-center gap-3">

          <Clock3 className="text-msp-accent" />

          <h2 className="text-xl font-bold text-msp-primary">
            Recent Activity
          </h2>

        </div>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 py-12 text-center">

          <CalendarCheck
            size={45}
            className="mx-auto text-msp-muted"
          />

          <h3 className="mt-4 text-lg font-bold text-msp-primary">
            No Recent Bookings
          </h3>

          <p className="mt-2 text-msp-secondary">
            Your latest bookings will appear here.
          </p>

        </div>

      </section>

    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="card p-6">

      <div className={`grid h-14 w-14 place-items-center rounded-xl ${color}`}>
        <Icon size={26} />
      </div>

      <p className="mt-5 text-sm text-msp-secondary">
        {title}
      </p>

      <h3 className="mt-2 text-4xl font-bold text-msp-primary">
        {value}
      </h3>

    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="card group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-msp-softGreen text-msp-accent">
        <Icon size={26} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-msp-primary">
        {title}
      </h3>

      <p className="mt-2 text-sm text-msp-secondary">
        {description}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-msp-accent">
        Open
        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />
      </span>

    </Link>
  );
}