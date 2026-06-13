import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// Navy → amber gradient family so it matches the rest of the portal.
const COLORS = [
  '#122b4a', '#1b3a61', '#2a5183', '#3f6ca3',
  '#d4a13a', '#e0b75e', '#ecca85', '#f0d39a',
]

export default function CategoryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="45%"
          outerRadius={105}
          innerRadius={55}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => 'Rs ' + v.toLocaleString()} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
