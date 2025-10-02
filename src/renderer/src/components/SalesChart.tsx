import React from 'react'

const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const values = [80,120,140,160,170,180,190,200,220,240,260,300] // relative heights

const SalesChart: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full h-44 flex items-end gap-3">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col-reverse items-center">
            <div
              title={`${months[i]}: ${v}`}
              style={{ height: `${(v / 320) * 100}%` }}
              className="w-full max-w-[24px] rounded-full bg-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        {months.map((m) => (
          <div key={m} className="w-1/12 text-center">{m}</div>
        ))}
      </div>
    </div>
  )
}

export default SalesChart
