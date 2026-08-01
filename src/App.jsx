import {
  BarChart3,
  CalendarDays,
  FileCheck2,
  Heart,
  MapPin,
  Search,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./layouts/PublicLayout";

import AdminBookings from "./pages/admin/AdminBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminReports from "./pages/admin/AdminReports";
import AdminUsers from "./pages/admin/AdminUsers";
import CategoryManagement from "./pages/admin/CategoryManagement";
import DocumentVerification from "./pages/admin/DocumentVerification";
import PendingProviders from "./pages/admin/PendingProviders";

import CreateBooking from "./pages/customer/CreateBooking";
import CustomerBookings from "./pages/customer/CustomerBookings";
import CustomerAddresses from "./pages/customer/CustomerAddresses";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerFavorites from "./pages/customer/CustomerFavorites";
import CustomerProfile from "./pages/customer/CustomerProfile";
import Payment from "./pages/customer/Payment";
import ProviderSearch from "./pages/customer/ProviderSearch";

import ProviderAddresses from "./pages/provider/ProviderAddresses";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderDocuments from "./pages/provider/ProviderDocuments";
import ProviderProfile from "./pages/provider/ProviderProfile";
import ProviderSkills from "./pages/provider/ProviderSkills";

import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Providers from "./pages/public/Providers";
import Register from "./pages/public/Register";
import Services from "./pages/public/Services";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import { ROLES } from "./utils/roles";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />

        <Route path="services" element={<Services />} />

        <Route path="providers" element={<Providers />} />

        <Route path="contact" element={<Contact />} />

        <Route path="login" element={<Login />} />

        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Customer */}
        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.CUSTOMER]} />
          }
        >
          <Route
            path="customer"
            element={
              <DashboardLayout
                title="Customer account"
                links={[
                  {
                    to: "profile",
                    label: "Profile",
                    icon: UserRound,
                  },
                  {
                    to: "/providers",
                    label: "Find providers",
                    icon: Search,
                  },
                  {
                    to: "bookings",
                    label: "Bookings",
                    icon: CalendarDays,
                  },
                  {
                    to: "addresses",
                    label: "Addresses",
                    icon: MapPin,
                  },
                  {
                    to: "favorites",
                    label: "Favorites",
                    icon: Heart,
                  },
                ]}
              />
            }
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<CustomerDashboard />}
            />

            <Route
              path="profile"
              element={<CustomerProfile />}
            />

            <Route
              path="search"
              element={<ProviderSearch />}
            />

            <Route
              path="bookings"
              element={<CustomerBookings />}
            />

            <Route
              path="bookings/new"
              element={<CreateBooking />}
            />
            <Route
              path="/customer/bookings/:bookingId/payment"
              element={<Payment />}
            />

            <Route
              path="addresses"
              element={<CustomerAddresses />}
            />

            <Route
              path="favorites"
              element={<CustomerFavorites />}
            />
          </Route>
        </Route>

        {/* Provider */}
        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.PROVIDER]} />
          }
        >
          <Route
            path="provider"
            element={
              <DashboardLayout
                title="Provider account"
                links={[
                  {
                    to: "profile",
                    label: "Profile",
                    icon: UserRound,
                  },
                  {
                    to: "skills",
                    label: "Skills & pricing",
                    icon: Wrench,
                  },
                  {
                    to: "addresses",
                    label: "Service areas",
                    icon: MapPin,
                  },
                  {
                    to: "documents",
                    label: "Documents",
                    icon: FileCheck2,
                  },
                  {
                    to: "bookings",
                    label: "Bookings",
                    icon: CalendarDays,
                  },
                ]}
              />
            }
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<ProviderDashboard />}
            />

            <Route
              path="profile"
              element={<ProviderProfile />}
            />

            <Route
              path="skills"
              element={<ProviderSkills />}
            />

            <Route
              path="addresses"
              element={<ProviderAddresses />}
            />

            <Route
              path="documents"
              element={<ProviderDocuments />}
            />

            <Route
              path="bookings"
              element={<ProviderBookings />}
            />
          </Route>
        </Route>

        {/* Admin */}
        <Route
          element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]} />
          }
        >
          <Route
            path="admin"
            element={
              <DashboardLayout
                title="Administration"
                links={[
                  {
                    to: "approvals",
                    label: "Provider Approvals",
                    icon: Users,
                  },
                  {
                    to: "documents",
                    label: "Document Verification",
                    icon: FileCheck2,
                  },
                  {
                    to: "categories",
                    label: "Categories",
                    icon: Wrench,
                  },
                  {
                    to: "providers",
                    label: "Providers",
                    icon: Users,
                  },
                  {
                    to: "users",
                    label: "Users",
                    icon: UserRound,
                  },
                  {
                    to: "bookings",
                    label: "Bookings",
                    icon: CalendarDays,
                  },
                  {
                    to: "reports",
                    label: "Reports",
                    icon: BarChart3,
                  },
                ]}
              />
            }
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="approvals"
              element={<PendingProviders />}
            />

            <Route
              path="documents"
              element={<DocumentVerification />}
            />

            <Route
              path="categories"
              element={<CategoryManagement />}
            />

            <Route
              path="providers"
              element={<AdminProviders />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="bookings"
              element={<AdminBookings />}
            />

            <Route
              path="reports"
              element={<AdminReports />}
            />

          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
