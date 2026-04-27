export interface IEmployeeTimesheet {
  id: string;
  employee_id: string;
  work_date: string | Date;
  time_in?: string | Date;
  time_out?: string | Date;
  status: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IEmployeeTimesheetResponse {
  timesheet?: IEmployeeTimesheet | IEmployeeTimesheet[];
  timesheets?: IEmployeeTimesheet[];
  totalTimesheets?: number;
  totalRecords?: number;
  total?: number;
  page?: number;
  limit?: number;
}
