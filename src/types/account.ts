export interface IAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clerkId: string;
  role: string;
}

export interface IAdmin {
  id: string;
  account: IAccount;
}
export interface ILoginRequest {
  email: string;
  password: string;
}
export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface IDbRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  clerkId: string;
}
export interface ISignUpAdminRequest {
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  provider: string;
  role: string;
}
export interface ISignUpAdminResponse {
  admin: IAdmin;
}
export interface IResetPasswordRequest {
  code: string;
  newPassword: string;
}
export interface IVerifyEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  clerkUserId: string;
}
export interface IResendVerificationRequest {
  clerkUserId: string;
}
