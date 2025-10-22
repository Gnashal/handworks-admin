import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import {
  Clock,
  Edit,
  FolderOpen,
  Trash2,
  Mail,
  SlidersHorizontal,
  MoreVertical,
  AlertCircle,
  User
} from 'lucide-react'

const bookings = [
  { name: 'John Doe', service: 'General Cleaning', cleanDate: '05/26/25', bookDate: '05/10/25', alert: true },
  { name: 'Jane Doe', service: 'Office Cleaning', cleanDate: '06/01/25', bookDate: '05/09/25' },
  { name: 'Red Ron', service: 'Apartment Cleaning', cleanDate: '06/26/25', bookDate: '05/07/25' },
  { name: 'Dex Morg', service: 'Condo Cleaning', cleanDate: '05/07/25', bookDate: '05/07/25' },
]

const BookingsPage: React.FC = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <Topbar title="Bookings" />

        {/* Toolbar */}
        <div className="bg-gray-100 p-4 rounded-t-xl mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-5 h-5" />
            <Edit className="w-5 h-5" />
            <FolderOpen className="w-5 h-5" />
            <Trash2 className="w-5 h-5" />
            <Mail className="w-5 h-5" />
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div className="text-xs text-gray-400">1 - 10 of 20</div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm">
          <div className="grid grid-cols-4 px-6 py-3 border-b text-sm font-semibold text-gray-600">
            <div>Client</div>
            <div>Service</div>
            <div>Cleaning Date</div>
            <div>Book Date</div>
          </div>

          {bookings.map((b, i) => (
            <div
              key={i}
              className="grid grid-cols-4 px-6 py-3 border-b text-sm items-center hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" />
                <User className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{b.name}</span>
              </div>
              <div className="font-semibold">{b.service}</div>
              <div>{b.cleanDate}</div>
              <div className="flex items-center gap-2">
                {b.bookDate}
                {b.alert && (
                  <AlertCircle className="w-4 h-4 text-red-500 fill-red-500" />
                )}
                <MoreVertical className="w-5 h-5 ml-auto text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookingsPage
