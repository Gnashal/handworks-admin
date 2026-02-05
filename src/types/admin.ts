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
