const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('care24_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Auth ──
export const login    = (body) => req('POST', '/auth/login',    body);
export const register = (body) => req('POST', '/auth/register', body);

// ── User ──
export const getMe          = ()     => req('GET',  '/users/me');
export const updateMe       = (body) => req('PUT',  '/users/me',      body);
export const getPatient     = ()     => req('GET',  '/users/patient');
export const savePatient    = (body) => req('POST', '/users/patient',  body);

// ── Caregivers ──
export const getCaregivers  = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return req('GET', `/caregivers${q ? '?' + q : ''}`);
};
export const getCaregiverById = (id)   => req('GET',  `/caregivers/${id}`);
export const getMyCaregiverProfile = () => req('GET', '/caregivers/me');
export const updateCaregiverProfile = (body) => req('PUT', '/caregivers/me', body);
export const toggleAvailability = ()   => req('PUT',  '/caregivers/availability');

// ── Bookings ──
export const createBooking    = (body) => req('POST', '/bookings',          body);
export const getMyBookings    = ()     => req('GET',  '/bookings/my');
export const getCaregiverBookings = () => req('GET',  '/bookings/caregiver');
export const updateBookingStatus  = (id, body) => req('PUT', `/bookings/${id}/status`, body);
export const getBookingById   = (id)   => req('GET',  `/bookings/${id}`);

// ── Services ──
export const getServices = () => req('GET', '/services');

// ── Care Notes ──
export const addCareNote  = (body) => req('POST', '/carenotes',           body);
export const getCareNotes = (bookingId) => req('GET', `/carenotes/${bookingId}`);

// ── Admin ──
export const getAdminStats          = ()      => req('GET', '/admin/stats');
export const getPendingCaregivers   = ()      => req('GET', '/admin/pending-caregivers');
export const verifyCaregiverAction  = (id, action) => req('PUT', `/admin/caregivers/${id}/verify`, { action });
export const getAdminBookings       = ()      => req('GET', '/admin/bookings');
export const getAdminUsers          = ()      => req('GET', '/admin/users');

// ── Auth helpers ──
export const saveAuth = (token, user) => {
  localStorage.setItem('care24_token', token);
  localStorage.setItem('care24_user',  JSON.stringify(user));
};
export const clearAuth = () => {
  localStorage.removeItem('care24_token');
  localStorage.removeItem('care24_user');
};
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('care24_user')); } catch { return null; }
};
export const isLoggedIn = () => !!getToken();
