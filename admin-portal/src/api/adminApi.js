

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

// ---- Officer management ----
export async function getOfficers() {
  const { data } = await client.get('/admin/officers')
  return data
}

export async function getDistrictList() {
  const { data } = await client.get('/admin/districts')
  return data
}

export async function createOfficer(officer) {
  const { data } = await client.post('/admin/officers', {
    officerName: officer.officerName,
    badgeNumber: officer.badgeNumber,
    phoneNumber: officer.phoneNumber,
    districtId: Number(officer.districtId),
  })
  return data
}

export async function updateOfficer(id, officer) {
  const { data } = await client.put(`/admin/officers/${id}`, {
    officerName: officer.officerName,
    badgeNumber: officer.badgeNumber,
    phoneNumber: officer.phoneNumber,
    districtId: Number(officer.districtId),
  })
  return data
}

export async function deleteOfficer(id) {
  await client.delete(`/admin/officers/${id}`)
}

// Static district list used by the dashboard's fine-records filter dropdown.
export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
]
