import React from 'react'

const rows = [
  { name: 'Press', addr: 'London', date: '22.08.2022', status: 'Delivered', price: '$920' },
  { name: 'Marina', addr: 'Man city', date: '24.08.2022', status: 'Processed', price: '$452' },
  { name: 'Alex', addr: 'Unknown', date: '18.08.2022', status: 'Cancelled', price: '$1200' },
  { name: 'Robert', addr: 'New York', date: '03.08.2022', status: 'Delivered', price: '$1235' }
]

const CustomerTable: React.FC = () => {
  return (
    <div className="divide-y divide-gray-100">
      {rows.map((r, idx) => (
        <div key={idx} className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <div className="text-sm font-medium">{r.name}</div>
              <div className="text-xs text-gray-400">{r.addr}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">{r.date}</div>
          <div className="text-sm">{r.status}</div>
          <div className="font-semibold">{r.price}</div>
        </div>
      ))}
    </div>
  )
}

export default CustomerTable
