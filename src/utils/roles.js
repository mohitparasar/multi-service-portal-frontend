export const ROLES = { CUSTOMER: 'CUSTOMER', PROVIDER: 'PROVIDER', ADMIN: 'ADMIN' }
export const dashboardByRole = {
  CUSTOMER: '/customer/dashboard',
  PROVIDER: '/provider/dashboard',
  ADMIN: '/admin/dashboard'
}
export const getDashboardForRole = (role) => dashboardByRole[role] ?? '/'
