<<<<<<< Updated upstream
import { CalendarDays, FileCheck2, Heart, MapPin, Search, UserRound, Users, Wrench } from 'lucide-react'
=======
import { BarChart3, CalendarDays, FileCheck2, Heart, Search, Settings, UserRound, Users, Wrench } from 'lucide-react'
>>>>>>> Stashed changes
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CategoryManagement from './pages/admin/CategoryManagement'
import DocumentVerification from './pages/admin/DocumentVerification'
import PendingProviders from './pages/admin/PendingProviders'
import PlaceholderPage from './pages/PlaceholderPage'
import CreateBooking from './pages/customer/CreateBooking'
import CustomerBookings from './pages/customer/CustomerBookings'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import ProviderSearch from './pages/customer/ProviderSearch'
import ProviderBookings from './pages/provider/ProviderBookings'
import ProviderDashboard from './pages/provider/ProviderDashboard'
import ProviderProfile from './pages/provider/ProviderProfile'
import ProviderSkills from './pages/provider/ProviderSkills'
import ProviderAddresses from './pages/provider/ProviderAddresses'
import ProviderDocuments from './pages/provider/ProviderDocuments'
import Contact from './pages/public/Contact'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Providers from './pages/public/Providers'
import Register from './pages/public/Register'
import Services from './pages/public/Services'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import { ROLES } from './utils/roles'
<<<<<<< Updated upstream
export default function App(){return <Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="services" element={<Services/>}/><Route path="providers" element={<Providers/>}/><Route path="contact" element={<Contact/>}/><Route path="login" element={<Login/>}/><Route path="register" element={<Register/>}/></Route><Route element={<ProtectedRoute/>}><Route element={<RoleRoute allowedRoles={[ROLES.CUSTOMER]}/> }><Route path="customer" element={<DashboardLayout title="Customer account" links={[{to:'profile',label:'Profile',icon:UserRound},{to:'/providers',label:'Find providers',icon:Search},{to:'bookings',label:'Bookings',icon:CalendarDays},{to:'favorites',label:'Favorites',icon:Heart}]}/>}><Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<CustomerDashboard/>}/><Route path="profile" element={<PlaceholderPage title="Customer profile"/>}/><Route path="search" element={<ProviderSearch/>}/><Route path="bookings" element={<CustomerBookings/>}/><Route path="bookings/new" element={<CreateBooking/>}/><Route path="favorites" element={<PlaceholderPage title="Favorite providers"/>}/></Route></Route><Route element={<RoleRoute allowedRoles={[ROLES.PROVIDER]}/> }><Route path="provider" element={<DashboardLayout title="Provider account" links={[{to:'profile',label:'Profile',icon:UserRound},{to:'skills',label:'Skills & pricing',icon:Wrench},{to:'addresses',label:'Service areas',icon:MapPin},{to:'documents',label:'Documents',icon:FileCheck2},{to:'bookings',label:'Bookings',icon:CalendarDays}]}/>}><Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<ProviderDashboard/>}/><Route path="profile" element={<ProviderProfile/>}/><Route path="skills" element={<ProviderSkills/>}/><Route path="addresses" element={<ProviderAddresses/>}/><Route path="documents" element={<ProviderDocuments/>}/><Route path="bookings" element={<ProviderBookings/>}/></Route></Route><Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]}/> }><Route path="admin" element={<DashboardLayout title="Administration" links={[{to:'providers',label:'Providers',icon:Users},{to:'documents',label:'Documents',icon:FileCheck2},{to:'categories',label:'Categories',icon:Wrench}]}/>}><Route index element={<Navigate to="dashboard" replace/>}/><Route path="dashboard" element={<AdminDashboard/>}/><Route path="providers" element={<PlaceholderPage title="Pending providers"/>}/><Route path="documents" element={<PlaceholderPage title="Pending documents"/>}/><Route path="categories" element={<PlaceholderPage title="Service categories"/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
=======

export default function App() {
  const customerLinks = [
    { to: 'profile', label: 'Profile', icon: UserRound },
    { to: '/providers', label: 'Find providers', icon: Search },
    { to: 'bookings', label: 'Bookings', icon: CalendarDays },
    { to: 'favorites', label: 'Favorites', icon: Heart }
  ]
  const providerLinks = [
    { to: 'profile', label: 'Profile', icon: UserRound },
    { to: 'skills', label: 'Skills', icon: Wrench },
    { to: 'documents', label: 'Documents', icon: FileCheck2 },
    { to: 'bookings', label: 'Bookings', icon: CalendarDays }
  ]
  const adminLinks = [
    { to: 'approvals', label: 'Provider Approvals', icon: Users },
    { to: 'documents', label: 'Document Verification', icon: FileCheck2 },
    { to: 'categories', label: 'Categories', icon: Wrench },
    { to: 'providers', label: 'Providers', icon: Users },
    { to: 'users', label: 'Users', icon: UserRound },
    { to: 'bookings', label: 'Bookings', icon: CalendarDays },
    { to: 'reports', label: 'Reports', icon: BarChart3 },
    { to: 'settings', label: 'Settings', icon: Settings }
  ]

  return <Routes>
    <Route element={<PublicLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="services" element={<Services/>}/>
      <Route path="providers" element={<Providers/>}/>
      <Route path="contact" element={<Contact/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
    </Route>

    <Route element={<ProtectedRoute/>}>
      <Route element={<RoleRoute allowedRoles={[ROLES.CUSTOMER]}/>}>
        <Route path="customer" element={<DashboardLayout title="Customer account" links={customerLinks}/>}>
          <Route index element={<Navigate to="dashboard" replace/>}/>
          <Route path="dashboard" element={<CustomerDashboard/>}/>
          <Route path="profile" element={<PlaceholderPage title="Customer profile"/>}/>
          <Route path="search" element={<ProviderSearch/>}/>
          <Route path="bookings" element={<CustomerBookings/>}/>
          <Route path="bookings/new" element={<CreateBooking/>}/>
          <Route path="favorites" element={<PlaceholderPage title="Favorite providers"/>}/>
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={[ROLES.PROVIDER]}/>}>
        <Route path="provider" element={<DashboardLayout title="Provider account" links={providerLinks}/>}>
          <Route index element={<Navigate to="dashboard" replace/>}/>
          <Route path="dashboard" element={<ProviderDashboard/>}/>
          <Route path="profile" element={<PlaceholderPage title="Provider profile"/>}/>
          <Route path="skills" element={<PlaceholderPage title="Provider skills"/>}/>
          <Route path="documents" element={<PlaceholderPage title="Provider documents"/>}/>
          <Route path="bookings" element={<ProviderBookings/>}/>
        </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]}/>}>
        <Route path="admin" element={<DashboardLayout title="Administration" links={adminLinks}/>}>
          <Route index element={<Navigate to="dashboard" replace/>}/>
          <Route path="dashboard" element={<AdminDashboard/>}/>
          <Route path="approvals" element={<PendingProviders/>}/>
          <Route path="documents" element={<DocumentVerification/>}/>
          <Route path="categories" element={<CategoryManagement/>}/>
          <Route path="providers" element={<PlaceholderPage title="All providers"/>}/>
          <Route path="users" element={<PlaceholderPage title="All users"/>}/>
          <Route path="bookings" element={<PlaceholderPage title="All bookings"/>}/>
          <Route path="reports" element={<PlaceholderPage title="Reports"/>}/>
          <Route path="settings" element={<PlaceholderPage title="Settings"/>}/>
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
>>>>>>> Stashed changes
