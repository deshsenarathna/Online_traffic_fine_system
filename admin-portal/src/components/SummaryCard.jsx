export default function SummaryCard({ label, value, accent }) {
  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}
