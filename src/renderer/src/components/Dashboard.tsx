import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import StatCard from './StatCard'
import SalesChart from './SalesChart'
import ActivityChart from './ActivityChart'
import CustomerTable from './CustomerTable'

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        <Topbar />

        {/* Header / date control */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Top left metric cards (col span 7) */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
            <StatCard title="Orders" value="201" hint="+8.2% since last month" />
            <StatCard title="Approved" value="36" hint="+3.4% since last month" />
            <StatCard title="Month total" value="$25,410" hint="↓ 0.2% since last month" />
            <StatCard title="Revenue" value="$1,352" hint="↓ 1.2% since last month" />
          </div>

          {/* Right column: user donut + subscriptions (col span 5) */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Users</h4>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-3xl font-semibold">4.890</div>
                  <div className="text-xs text-gray-400 mt-1">since last month</div>
                </div>
                <div className="w-24 h-24">
                  {/* simple donut svg */}
                  <svg viewBox="0 0 36 36" className="w-full h-full">
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
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Subscriptions</h4>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-3xl font-semibold">1.201</div>
                  <div className="text-xs text-gray-400 mt-1">since last month</div>
                </div>
                <div className="w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z"
                      fill="none"
                      stroke="#E6EDF3"
                      strokeWidth="6"
                    />
                    <path
                      d="M18 2a16 16 0 0 1 10 5.5"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle area: charts and invoices */}
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Sales dynamics</h4>
              <div className="mt-6">
                <SalesChart />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Overall User Activity</h4>
              <div className="mt-4">
                <ActivityChart />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Paid Invoices</h4>
              <div className="mt-4">
                <div className="text-2xl font-semibold">$30,256.23</div>
                <div className="text-xs text-gray-400 mt-1">Current Financial Year</div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Funds received</h4>
              <div className="mt-4">
                <div className="text-2xl font-semibold">$150,256.23</div>
                <div className="text-xs text-gray-400 mt-1">Current Financial Year</div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h4 className="text-sm text-gray-500">Customer order</h4>
              <CustomerTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
