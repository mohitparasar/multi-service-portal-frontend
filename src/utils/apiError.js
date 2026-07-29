export function getApiErrorMessage(error, fallback = 'We could not complete this request right now.') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback
}
