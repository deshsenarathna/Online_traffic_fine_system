import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import {
  getOfficers, getDistrictList, createOfficer, updateOfficer, deleteOfficer,
} from '../api/adminApi'

const EMPTY = { officerName: '', badgeNumber: '', phoneNumber: '', districtId: '' }

export default function Officers() {
  const [officers, setOfficers] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    Promise.all([getOfficers(), getDistrictList()])
      .then(([o, d]) => { setOfficers(o); setDistricts(d) })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openAdd() {
    setEditingId(null); setForm(EMPTY); setError(''); setShowForm(true)
  }
  function openEdit(o) {
    setEditingId(o.id)
    setForm({
      officerName: o.officerName, badgeNumber: o.badgeNumber,
      phoneNumber: o.phoneNumber, districtId: String(o.districtId ?? ''),
    })
    setError(''); setShowForm(true)
  }
  function cancel() { setShowForm(false); setForm(EMPTY); setEditingId(null); setError('') }

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function save() {
    if (!form.officerName || !form.badgeNumber || !form.districtId) {
      setError('Name, badge number and district are required.')
      return
    }
    setSaving(true); setError('')
    try {
      if (editingId) await updateOfficer(editingId, form)
      else await createOfficer(form)
      cancel(); load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Could not save officer.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(o) {
    if (!window.confirm(`Delete officer ${o.officerName} (${o.badgeNumber})?`)) return
    try {
      await deleteOfficer(o.id); load()
    } catch (e) {
      alert('Could not delete. This officer may have issued fines on record.')
    }
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <div className="gov-strip" />

        <header className="topbar">
          <div className="row">
            <div className="t-left">
              <div className="eyebrow">Administration</div>
              <h1>Police Officer Management</h1>
            </div>
            <div className="t-right">
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px' }} onClick={openAdd}>
                + Add officer
              </button>
            </div>
          </div>
        </header>

        <div className="content">
          {showForm && (
            <div className="panel" style={{ marginBottom: 20 }}>
              <h3>{editingId ? 'Edit officer' : 'Add new officer'}</h3>
              <div className="panel-sub">
                {editingId ? 'Update the officer’s details.' : 'Register a new police officer in the system.'}
              </div>

              {error && <div className="error-msg">{error}</div>}

              <div className="officer-form">
                <div className="field">
                  <label>Officer name</label>
                  <input value={form.officerName} onChange={(e) => set('officerName', e.target.value)} placeholder="e.g. K. Perera" />
                </div>
                <div className="field">
                  <label>Badge number</label>
                  <input value={form.badgeNumber} onChange={(e) => set('badgeNumber', e.target.value)} placeholder="e.g. PO1001" />
                </div>
                <div className="field">
                  <label>Phone number</label>
                  <input value={form.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} placeholder="e.g. 0771234567" />
                </div>
                <div className="field">
                  <label>District</label>
                  <select value={form.districtId} onChange={(e) => set('districtId', e.target.value)}>
                    <option value="">Select district</option>
                    {districts.map((d) => <option key={d.id} value={d.id}>{d.districtName}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn-primary" style={{ width: 'auto', padding: '11px 22px' }} onClick={save} disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update officer' : 'Save officer'}
                </button>
                <button className="btn-ghost" onClick={cancel}>Cancel</button>
              </div>
            </div>
          )}

          <div className="panel">
            <h3>Registered officers</h3>
            <div className="panel-sub">{officers.length} officer{officers.length !== 1 ? 's' : ''} on record</div>

            {loading ? (
              <div className="loading">Loading officers…</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Officer name</th>
                      <th>Badge no.</th>
                      <th>Phone</th>
                      <th>District</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officers.map((o) => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 600 }}>{o.officerName}</td>
                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{o.badgeNumber}</td>
                        <td>{o.phoneNumber}</td>
                        <td>{o.districtName}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button className="link-btn" onClick={() => openEdit(o)}>Edit</button>
                          <button className="link-btn danger" onClick={() => remove(o)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {officers.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 28 }}>
                        No officers registered yet.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
