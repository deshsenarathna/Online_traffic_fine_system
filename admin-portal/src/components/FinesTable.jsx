const money = (n) => 'Rs ' + Number(n || 0).toLocaleString()

// Map backend status values to a badge style.
function badgeClass(status) {
  const s = (status || '').toUpperCase()
  if (s === 'PAID') return 'paid'
  if (s === 'PENDING') return 'pending'
  return 'unpaid'
}

export default function FinesTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Category</th>
            <th>District</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.ref}>
              <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{f.ref}</td>
              <td>{f.category}</td>
              <td>{f.district}</td>
              <td>{money(f.amount)}</td>
              <td><span className={`badge ${badgeClass(f.status)}`}>{f.status}</span></td>
              <td>{f.date}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 28 }}>
                No fines match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
