import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  FileCheck2,
  Star,
  UserRound,
  Wrench,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { providerApi } from "../../api/providerApi";

export default function ProviderDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    providerApi
      .getMyProfile()
      .then(({ data }) => setProfile(data.data || data))
      .catch(() => {});
  }, []);

  const quickActions = [
    {
      title: "Profile",
      icon: BriefcaseBusiness,
      color: "bg-blue-100 text-blue-600",
      to: "/provider/profile",
      desc: "Update professional profile",
    },
    {
      title: "Skills",
      icon: Wrench,
      color: "bg-green-100 text-green-600",
      to: "/provider/skills",
      desc: "Manage services & pricing",
    },
    {
      title: "Documents",
      icon: FileCheck2,
      color: "bg-purple-100 text-purple-600",
      to: "/provider/documents",
      desc: "Verification documents",
    },
    {
      title: "Bookings",
      icon: ClipboardList,
      color: "bg-orange-100 text-orange-600",
      to: "/provider/bookings",
      desc: "View customer bookings",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl bg-gradient-to-r from-msp-primary to-emerald-600 p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center">

          <div className="flex items-center gap-6">

            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt=""
                className="h-28 w-28 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-msp-primary">
                <UserRound size={50} />
              </div>
            )}

            <div>

              <h1 className="text-4xl font-bold">
                Welcome, {profile?.fullName || "Provider"} 👋
              </h1>

              <p className="mt-2 max-w-xl text-white/90">
                Manage your services, profile, pricing and customer bookings
                from one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <span className="rounded-full bg-white/20 px-4 py-2">
                  {profile?.experienceYears ?? 0} Years Experience
                </span>

                <span className="rounded-full bg-white/20 px-4 py-2 flex items-center gap-2">
                  <Star size={16} />
                  {profile?.averageRating ?? 0}
                </span>

                <span className="rounded-full bg-white/20 px-4 py-2">
                  {profile?.totalJobsCompleted ?? 0} Jobs
                </span>

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-white p-5 text-center text-msp-primary shadow-lg">

            <BadgeCheck className="mx-auto mb-2" size={36} />

            <h3 className="font-bold">
              {profile?.approvalStatus || "PENDING"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Account Status
            </p>

          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div>

        <h2 className="mb-4 text-2xl font-bold text-msp-primary">
          Quick Actions
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.desc}
                </p>

                <div className="mt-5 flex items-center gap-2 font-semibold text-msp-primary">
                  Open
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

              </Link>
            );
          })}

        </div>

      </div>

      {/* Business Summary */}

      <div className="grid gap-5 lg:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <TrendingUp className="text-green-600" size={30} />

          <h3 className="mt-4 font-bold text-xl">
            Profile Completion
          </h3>

          <p className="mt-2 text-gray-500">
            Keep your profile complete to improve customer trust.
          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <ShieldCheck className="text-blue-600" size={30} />

          <h3 className="mt-4 font-bold text-xl">
            Verification
          </h3>

          <p className="mt-2 text-gray-500">
            Upload all documents to receive bookings faster.
          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <ClipboardList className="text-orange-600" size={30} />

          <h3 className="mt-4 font-bold text-xl">
            Bookings
          </h3>

          <p className="mt-2 text-gray-500">
            Accept bookings quickly to improve your rating.
          </p>

        </div>

      </div>

    </div>
  );
}