export default function SummaryCard({ label, value, sub, accent, variant }) {
  const cls = ['stat-card']
  if (accent) cls.push('accent')
  if (variant === 'paid') cls.push('s-paid')
  if (variant === 'pending') cls.push('s-pending')
  return (
    <div className={cls.join(' ')}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}
