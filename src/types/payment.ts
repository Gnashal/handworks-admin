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
