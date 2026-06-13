import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SummaryCard from '../components/SummaryCard'
import DistrictChart from '../components/DistrictChart'
import CategoryChart from '../components/CategoryChart'
import FinesTable from '../components/FinesTable'
import {
  getSummary, getByDistrict, getByCategory, getFines, DISTRICTS,
} from '../api/adminApi'

const money = (n) => 'Rs ' + n.toLocaleString()

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter state for the fines table.
  const [district, setDistrict] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // Load the dashboard-level data once.
  useEffect(() => {
    Promise.all([getSummary(), getByDistrict(), getByCategory()])
      .then(([s, d, c]) => {
        setSummary(s)
        setDistricts(d)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  // Reload the fines table whenever a filter changes.
  useEffect(() => {
    getFines({ district, from, to }).then(setFines)
  }, [district, from, to])

  if (loading) {
    return (
      <div className="shell">
        <Sidebar />
        <main className="main"><div className="loading">Loading dashboard…</div></main>
      </div>
    )
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <div className="page-head">
          <div className="eyebrow">Nationwide overview</div>
          <h1>Traffic Fine Collections</h1>
          <p>Live monitoring of fine payments across all 25 districts.</p>
        </div>

        <div className="card-grid">
          <SummaryCard label="Total collected" value={money(summary.totalCollected)} accent />
          <SummaryCard label="Total fines issued" value={summary.totalFines.toLocaleString()} />
          <SummaryCard label="Paid" value={summary.paid.toLocaleString()} />
          <SummaryCard label="Unpaid" value={summary.unpaid.toLocaleString()} />
        </div>

        <div className="panel-grid">
          <div className="panel">
            <h3>Collections by district</h3>
            <div className="panel-sub">Top 12 districts by total amount collected</div>
            <DistrictChart data={districts} />
          </div>
          <div className="panel">
            <h3>By fine category</h3>
            <div className="panel-sub">Share of total collections</div>
            <CategoryChart data={categories} />
          </div>
        </div>

        <div className="panel">
          <h3>Fine records</h3>
          <div className="panel-sub">Filter the underlying payment records</div>

          <div className="filters">
            <div className="field">
              <label>District</label><br />
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">All districts</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="field">
              <label>From</label><br />
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="field">
              <label>To</label><br />
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <FinesTable rows={fines} />
        </div>
      </main>
    </div>
  )
}
