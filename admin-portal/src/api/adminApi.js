
import client from './client'

export async function login(username, password) {
  const { data } = await client.post('/auth/login', { username, password })
  return data
}

export async function getSummary() {
  const { data } = await client.get('/admin/summary')
  return data
}

export async function getByDistrict() {
  const { data } = await client.get('/admin/collections/by-district')
  return data
}

export async function getByCategory() {
  const { data } = await client.get('/admin/collections/by-category')
  return data
}

export async function getFines({ district, from, to } = {}) {
  const params = {}
  if (district) params.district = district
  if (from) params.from = from
  if (to) params.to = to
  const { data } = await client.get('/admin/fines', { params })
  return data
}

// Full list of Sri Lankan districts, used by the dashboard filter dropdown.
// (Static list — fine to keep on the frontend.)
export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
]