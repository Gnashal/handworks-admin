// src/renderer/src/components/StatCard.tsx
import React from 'react'

interface StatCardProps {
  title: string
  value: string
  hint?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, hint, icon, trend }) => {
  const trendColor =
    trend === 'up'
      ? 'text-green-500'
      : trend === 'down'
      ? 'text-red-500'
      : 'text-gray-400'

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm flex justify-between items-start">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-3xl font-semibold mt-2">{value}</div>
        {hint && (
          <div className={`text-xs mt-1 ${trendColor}`}>
            {hint}
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>
    </div>
  )
}

export default StatCard
