import React from 'react'

const StatCard: React.FC<{ title: string; value: string; hint?: string }> = ({ title, value, hint }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-3xl font-semibold mt-2">{value}</div>
          {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
        </div>
        <div className="w-12 h-12 rounded-md bg-gray-100" />
      </div>
    </div>
  )
}

export default StatCard
