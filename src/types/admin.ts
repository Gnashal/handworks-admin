export interface IAdminDashboardRequest {
  adminId: string;
  dateFilter: string;
}
export interface IDashboardData {
  sales: number;
  bookings: number;
  activeSessions: number;
  clients: number;
}
export interface IAdminDashboardResponse {
  sales: number;
  bookings: number;
  activeSessions: number;
  clients: number;
  growthIndex: IGrowthIndex;
  activeClients: number;
  employeesActive: number;
  employeesTotal: number;
  inactiveClients: number;
  lowStockItems: [
    {
      id: number;
      name: string;
      stock: number;
    },
  ];
  newClients: number;
  paid: number;
  pendingActions: number;
  recentActivities: [
    {
      id: number;
      time: string;
      title: string;
      type: string;
    },
  ];
  returningClients: number;
  revenue: number;
  todayBookings: number;
  topServices: [
    {
      bookings: number;
      id: number;
      name: string;
    },
  ];
  unpaid: number;
  unreadMessages: number;
}

export interface IGrowthIndex {
  salesGrowthIndex: number;
  bookingsGrowthIndex: number;
  activeSessionsGrowthIndex: number;
}

export interface IClientsGrowthIndex {
  new: number;
  returning: number;
  inactive: number;
  growthIndex: number;
}
export interface IOnboardEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  hireDate: string;
  organizationId: string;
  role: string;
}

export interface ServiceDynamicsData {
  label: string;
  value: number;
}

export interface IFetchBookingTrendsResponse {
  weeklyData: ServiceDynamicsData[];
  monthlyData: ServiceDynamicsData[];
}

export type AssignEmployeeAction = "ADD" | "REMOVE";

export interface IAssignEmployeeToBookingRequest {
  bookingId: string;
  employeeId: string;
  action: AssignEmployeeAction;
}

export interface IAssignEmployeeToBookingResponse {
  bookingId: string;
  employeeId: string;
  action: string;
  message: string;
}

export interface IAvailableCleaner {
  employeeId: string;
  firstName: string;
  lastName: string;
  pfpUrl: string;
}

export interface IAvailableCleanersResponse {
  bookingId: string;
  startSched: string;
  endSched: string;
  cleaners: IAvailableCleaner[];
  cleanerCount: number;
}
