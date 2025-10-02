import React from 'react'

const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-extrabold">Analytics</div>
        <div className="ml-2 text-xs text-gray-400 rounded-md px-3 py-1 bg-white shadow-sm">01.08.2022 - 31.08.2022</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-white shadow-sm">🌙</button>
        <div className="flex items-center gap-3">
          <div className="text-sm">Jon Dough</div>
          <div className="w-9 h-9 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
