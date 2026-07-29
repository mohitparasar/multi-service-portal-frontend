import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getDashboardForRole } from '../utils/roles'
export default function RoleRoute({ allowedRoles }) { const { role } = useAuth(); return allowedRoles.includes(role) ? <Outlet/> : <Navigate to={getDashboardForRole(role)} replace/> }
