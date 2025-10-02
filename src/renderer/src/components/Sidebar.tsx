import React from 'react'

const MenuItem: React.FC<{ icon?: React.ReactNode; label: string; active?: boolean }> = ({
  icon,
  label,
  active
}) => {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left ${
        active ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600">
        {icon ?? label.charAt(0)}
      </div>
      <div className="text-sm font-medium">{label}</div>
    </button>
  )
}

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-100 p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-pink-500" />
        <div className="text-lg font-bold">Business</div>
      </div>

      <nav className="mt-8 space-y-2">
        <MenuItem label="Analytics" active />
        <MenuItem label="Products" />
        <MenuItem label="Messages" />
        <MenuItem label="Customers" />
      </nav>

      <div className="mt-auto pt-8">
        <div className="p-4 rounded-xl bg-gray-50">
          <div className="text-sm text-gray-600">Need help feel free to contact</div>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md">Get support</button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
