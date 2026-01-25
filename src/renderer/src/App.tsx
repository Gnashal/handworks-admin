import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import BookingsPage from './components/BookingsPage'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </div>
    </Router>
  )
}
