import { IAddOnRequest, IServicesRequest } from "./booking";

export interface IQuoteAddon {
  id: string;
  quoteId: string;
  serviceType: string;
  serviceDetail: unknown; // json.RawMessage
  addonPrice: number;
  createdAt: string; // ISO datetime
}

export interface IQuote {
  id: string;
  customerId: string;
  mainService: string;
  subtotal: number;
  addonTotal: number;
  totalPrice: number;
  isValid: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  addons: IQuoteAddon[];
}

export interface IFetchAllQuotesResponse {
  totalQuotes: number;
  quotesRequested: number;
  quotes: IQuote[];
}

export interface IQuoteAddonCleaningPrice {
  addon_name: string;
  addon_price: number;
}

export interface IAddonCleaningPrice {
  addonName: string;
  addonPrice: number;
}

export interface IQuoteCleaningPrices {
  mainServicePrice: number;
  addonPrices: IAddonCleaningPrice[];
}

export interface IAddOnBreakdown {
  addonId: string;
  addonName: string;
  price: number;
}

export interface IQuoteResponse {
  quote_id: string;
  mainServiceName: string;
  mainServiceTotal: number;
  addonTotal: number;
  totalPrice: number;
  addons: IAddOnBreakdown[];
}

export interface IQuoteRequest {
  customerId: string;
  service: IServicesRequest;
  addons: IAddOnRequest[];
}

export interface ICustomerRequest {
  customerId: string;
}

export interface IQuotesResponse {
  quotes: IQuoteResponse[];
}
export interface ICreateOrderRequest {
  quoteId: string;
  customerId: string;
  paymentMethod: string;
  subtotal: number;
  addonTotal: number;
  totalAmount: number;
}

export interface ICreateOrderResponse {
  order: IOrder;
}

export interface IOrder {
  id: string;
  order_number: string;
  customer_id: string;
  quote_id: string;
  currency: string;
  subtotal: number;
  addon_total: number;
  total_amount: number;
  downpayment_required: number;
  remaining_balance: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}
export interface IPayment {
  id: string;
  order_id: string;

  type: "DOWNPAYMENT" | "FULLPAYMENT" | "BALANCE" | "REFUND";
  provider: "PAYMONGO" | "CASH" | "MANUAL";
  payment_intent_id: string | null;
  payment_id: string | null;
  payment_method_id: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  failed_reason: string | null;
  raw_response: unknown;
  created_at: string;
  updated_at: string;
  client_key: string;
}
export interface ICustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface ICashFlowEntry {
  order: IOrder;
  payments: IPayment[];
  customer: ICustomerInfo;
}

export interface ICashFlowResponse {
  totalEntries: number;
  entriesRequested: number;
  page: number;
  limit: number;
  entries: ICashFlowEntry[];
}
