export interface ISubscribeNotificationRequest {
  token: string;
  role: string;
  adminId?: string;
  installationId?: string;
  platform?: string;
}

export interface ISubscribeNotificationResponse {
  ok: boolean;
  topics: string[];
}

export interface IUnsubscribeNotificationRequest {
  token: string;
  role: string;
  employeeId?: string;
  adminId?: string;
  customerId?: string;
}

export interface IUnsubscribeNotificationResponse {
  ok: boolean;
}
