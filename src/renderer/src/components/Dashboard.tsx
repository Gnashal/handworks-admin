import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import StatCard from './StatCard'
import SalesChart from './SalesChart'
import {
  BarChart3,
  BookOpen,
  Users,
  Clock,
  Cog,
  Wallet,
  PiggyBank,
  ArrowRight
} from 'lucide-react'

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        <Topbar title="Overview" />

        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Top row */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            <StatCard
              title="Weekly Sales"
              value="75"
              hint="↑ 8.2% since last month"
              trend="up"
              icon={<BarChart3 className="w-6 h-6" />}
            />

            {/* Bookings Card with link */}
            <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Bookings</div>
                  <div className="text-3xl font-semibold mt-2">15</div>
                  <div className="text-xs text-green-500 mt-1">↑ 3.4% since last month</div>
                </div>
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <Link
                to="/bookings"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:underline"
              >
                View Bookings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Clients */}
            <div className="rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">Clients</div>
                  <div className="text-3xl font-semibold mt-2">6</div>
                  <div className="text-xs text-gray-400 mt-1">since last month</div>
                </div>
                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              {/* Donut chart */}
              <div className="mt-6 flex justify-center">
                <svg viewBox="0 0 36 36" className="w-24 h-24">
                  <path
                    d="M18 2a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z"
                    fill="none"
                    stroke="#E6EDF3"
                    strokeWidth="6"
                  />
                  <path
                    d="M18 2a16 16 0 1 1 0 32"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="62 38"
                  />
                </svg>
              </div>
              <div className="flex justify-center gap-6 text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> 62% New
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full"></span> 26% Returning
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-100 rounded-full border border-yellow-300"></span> 12% Inactive
                </div>
              </div>
            </div>
          </div>

          {/* Middle row */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6 mt-6">
            <StatCard
              title="Active Sessions"
              value="3"
              hint="↓ 1.2% since last month"
              trend="down"
              icon={<Clock className="w-6 h-6" />}
            />
            <StatCard
              title="Active Worker"
              value="7"
              icon={<Cog className="w-6 h-6" />}
            />
          </div>

          {/* Bottom row */}
          <div className="col-span-12 mt-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Service Dynamics</h4>
              <div className="mt-6">
                <SalesChart />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h4 className="text-sm text-gray-500">Paid Invoices</h4>
                <div className="mt-4">
                  <div className="text-2xl font-semibold">₱80,465.23</div>
                  <div className="text-xs text-gray-400 mt-1">Current Financial Year</div>
                </div>
                <div className="mt-3 text-gray-600">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h4 className="text-sm text-gray-500">Fund Received</h4>
                <div className="mt-4">
                  <div className="text-2xl font-semibold">₱153,355.00</div>
                  <div className="text-xs text-gray-400 mt-1">Current Financial Year</div>
                </div>
                <div className="mt-3 text-gray-600">
                  <PiggyBank className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
