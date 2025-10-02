import React from 'react'

const ActivityChart: React.FC = () => {
  const points = [20, 40, 30, 70, 60, 120, 150, 180, 200, 170, 210, 260]
  const w = 800
  const h = 220
  const max = Math.max(...points)
  const stepX = w / (points.length - 1)
  const path = points
    .map((p, i) => {
      const x = i * stepX
      const y = h - (p / max) * h
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
    })
    .join(' ')
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
        <path d={path} fill="none" stroke="#A78BFA" strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default ActivityChart
