// src/renderer/src/components/Topbar.tsx
import React from 'react'

const Topbar: React.FC<{ title?: string }> = ({ title = 'Analytics' }) => {
  return (
    <header className="flex items-center justify-between">
      <div className="text-2xl font-extrabold">{title}</div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-white shadow-sm">🔔</button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            👤
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
