import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SummaryCard from '../components/SummaryCard'
import DistrictChart from '../components/DistrictChart'
import CategoryChart from '../components/CategoryChart'
import FinesTable from '../components/FinesTable'
import {
  getSummary, getByDistrict, getByCategory, getFines, DISTRICTS,
} from '../api/adminApi'

const money = (n) => 'Rs ' + Number(n || 0).toLocaleString()

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [districts, setDistricts] = useState([])
  const [categories, setCategories] = useState([])
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)

  const [district, setDistrict] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    Promise.all([getSummary(), getByDistrict(), getByCategory()])
      .then(([s, d, c]) => {
        setSummary(s)
        setDistricts(d)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getFines({ district, from, to }).then(setFines)
  }, [district, from, to])

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  if (loading) {
    return (
      <div className="shell">
        <Sidebar />
        <div className="main">
          <div className="gov-strip" />
          <div className="loading">Loading dashboard…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <div className="gov-strip" />

        <header className="topbar">
          <div className="row">
            <div className="t-left">
              <div className="eyebrow">Nationwide overview</div>
              <h1>Traffic Fine Collections</h1>
            </div>
            <div className="t-right">
              <span>{today}</span>
              <span className="live"><span className="pulse" /> Live data</span>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="card-grid">
            <SummaryCard label="Total collected" value={money(summary.totalCollected)} sub="Across all districts" accent />
            <SummaryCard label="Total fines issued" value={Number(summary.totalFines || 0).toLocaleString()} sub="All records" />
            <SummaryCard label="Paid" value={Number(summary.paid || 0).toLocaleString()} sub="Settled fines" variant="paid" />
            <SummaryCard label="Pending" value={Number(summary.unpaid || 0).toLocaleString()} sub="Awaiting payment" variant="pending" />
          </div>

          <div className="panel-grid">
            <div className="panel">
              <h3>Collections by district</h3>
              <div className="panel-sub">Total amount collected per district</div>
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
            <div className="panel-sub">Search and filter individual fine payments</div>

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
        </div>
      </div>
    </div>
  )
}
