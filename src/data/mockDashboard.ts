export const mockDashboardData = {
  todayBookings: 8,
  pendingActions: 5,

  revenue: 25400,
  paid: 18000,
  unpaid: 7400,

  activeClients: 12,
  newClients: 7,
  returningClients: 3,
  inactiveClients: 2,

  employeesActive: 4,
  employeesTotal: 6,

  lowStockItems: 3,

  unreadMessages: 2,
};

export const recentActivities = [
  {
    id: 1,
    type: "booking",
    title: "John booked Laundry Service",
    time: "2 mins ago",
  },
  {
    id: 2,
    type: "client",
    title: "New client registered (Maria)",
    time: "10 mins ago",
  },
  {
    id: 3,
    type: "cancel",
    title: "Booking cancelled by Alex",
    time: "30 mins ago",
  },
];

export const inventoryAlerts = [
  { id: 1, name: "Detergent", stock: 2 },
  { id: 2, name: "Fabric Softener", stock: 1 },
  { id: 3, name: "Bleach", stock: 3 },
];

export const topServices = [
  { id: 1, name: "Laundry", bookings: 32 },
  { id: 2, name: "Dry Clean", bookings: 18 },
  { id: 3, name: "Ironing", bookings: 12 },
];