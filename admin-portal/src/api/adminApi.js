// ============================================================================
//  adminApi.js  —  the ONLY file that talks to the "backend"
// ============================================================================
//
//  Right now this returns MOCK data so you can build the whole UI without
//  waiting for the backend team. Each function has:
//    - a mock implementation (active)
//    - the real call commented out underneath
//
//  When the backend endpoints are ready:
//    1. confirm the exact URLs + JSON shape with the backend dev
//    2. uncomment the real version, delete (or keep) the mock
//    3. the rest of the app doesn't change at all
//
//  Agreed API contract (confirm these with the backend person):
//    POST /api/auth/login                  -> { token }
//    GET  /api/admin/summary               -> { totalCollected, totalFines, paid, unpaid }
//    GET  /api/admin/collections/by-district -> [ { district, total } ]
//    GET  /api/admin/collections/by-category -> [ { category, total, count } ]
//    GET  /api/admin/fines?from=&to=&district= -> [ { ref, category, district, amount, status, date } ]
// ============================================================================

import client from './client'

// Simulate network latency so loading states are visible during development.
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

// ----------------------------------------------------------------------------
//  MOCK DATA
// ----------------------------------------------------------------------------
const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle',
]

const CATEGORIES = [
  'Speeding', 'No helmet', 'No seatbelt', 'Drunk driving',
  'Red light', 'Illegal parking', 'No valid license', 'Overloading',
]

// Deterministic pseudo-random so the dashboard looks the same each refresh.
const seeded = (n) => {
  const x = Math.sin(n * 9973) * 10000
  return x - Math.floor(x)
}

const districtData = DISTRICTS.map((district, i) => ({
  district,
  total: Math.round((20000 + seeded(i) * 480000) / 1000) * 1000,
}))

const categoryData = CATEGORIES.map((category, i) => {
  const count = 80 + Math.round(seeded(i + 50) * 900)
  return { category, count, total: count * (1000 + Math.round(seeded(i + 99) * 4000)) }
})

const totalCollected = districtData.reduce((s, d) => s + d.total, 0)
const totalFines = categoryData.reduce((s, c) => s + c.count, 0)

const finesList = Array.from({ length: 60 }, (_, i) => {
  const status = seeded(i + 7) > 0.25 ? 'PAID' : 'UNPAID'
  const d = new Date(2026, 4, 1 + Math.floor(seeded(i + 11) * 40))
  return {
    ref: `TF-2026-${String(10000 + i)}`,
    category: CATEGORIES[Math.floor(seeded(i + 3) * CATEGORIES.length)],
    district: DISTRICTS[Math.floor(seeded(i + 5) * DISTRICTS.length)],
    amount: (1 + Math.floor(seeded(i + 13) * 5)) * 1000,
    status,
    date: d.toISOString().slice(0, 10),
  }
})

// ----------------------------------------------------------------------------
//  API FUNCTIONS
// ----------------------------------------------------------------------------

export async function login(username, password) {
  await delay()
  // MOCK: accept a fixed demo credential
  if (username === 'admin' && password === 'admin123') {
    return { token: 'mock-jwt-token.eyJyb2xlIjoiQURNSU4ifQ.signature' }
  }
  throw new Error('Invalid username or password')

  // REAL:
  // const { data } = await client.post('/auth/login', { username, password })
  // return data
}

export async function getSummary() {
  await delay()
  const paid = finesList.filter((f) => f.status === 'PAID').length
  return {
    totalCollected,
    totalFines,
    paid,
    unpaid: finesList.length - paid,
  }

  // REAL:
  // const { data } = await client.get('/admin/summary')
  // return data
}

export async function getByDistrict() {
  await delay()
  return [...districtData].sort((a, b) => b.total - a.total)

  // REAL:
  // const { data } = await client.get('/admin/collections/by-district')
  // return data
}

export async function getByCategory() {
  await delay()
  return [...categoryData].sort((a, b) => b.total - a.total)

  // REAL:
  // const { data } = await client.get('/admin/collections/by-category')
  // return data
}

export async function getFines({ district, from, to } = {}) {
  await delay()
  return finesList.filter((f) => {
    if (district && f.district !== district) return false
    if (from && f.date < from) return false
    if (to && f.date > to) return false
    return true
  })

  // REAL:
  // const { data } = await client.get('/admin/fines', { params: { district, from, to } })
  // return data
}

export { DISTRICTS }
