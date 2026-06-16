import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const fmt = (n) => 'Rs ' + (n / 1000).toFixed(0) + 'k'

export default function DistrictChart({ data }) {
  // Show the top 12 districts so the chart stays readable.
  const top = data.slice(0, 12)
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={top} margin={{ top: 8, right: 12, left: 4, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f3" />
        <XAxis
          dataKey="district"
          angle={-40}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 12, fill: '#667085' }}
        />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 12, fill: '#667085' }} />
        <Tooltip
          formatter={(v) => ['Rs ' + v.toLocaleString(), 'Collected']}
          contentStyle={{ borderRadius: 10, border: '1px solid #e4e7ec' }}
        />
        <Bar dataKey="total" fill="#122b4a" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
