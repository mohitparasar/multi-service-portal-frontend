import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingScreen from '../components/common/LoadingScreen'
export default function ProtectedRoute() { const { isAuthenticated, initializing } = useAuth(); const location = useLocation(); if(initializing) return <LoadingScreen/>; return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace state={{from:location}}/> }
