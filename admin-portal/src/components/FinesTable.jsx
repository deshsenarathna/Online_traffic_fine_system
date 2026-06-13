const money = (n) => 'Rs ' + n.toLocaleString()

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
              <td style={{ fontVariantNumeric: 'tabular-nums' }}>{f.ref}</td>
              <td>{f.category}</td>
              <td>{f.district}</td>
              <td>{money(f.amount)}</td>
              <td>
                <span className={`badge ${f.status === 'PAID' ? 'paid' : 'unpaid'}`}>
                  {f.status}
                </span>
              </td>
              <td>{f.date}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#667085', padding: 28 }}>
                No fines match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
