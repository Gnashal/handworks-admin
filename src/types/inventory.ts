export type ItemType = "RESOURCE" | "EQUIPMENT";

export type ItemStatus = "HIGH" | "LOW" | "DANGER" | "OUT_OF_STOCK";

export type ItemCategory =
  | "GENERAL"
  | "ELECTRONICS"
  | "FURNITURE"
  | "APPLIANCES"
  | "VEHICLES"
  | "OTHER";

export interface IInventoryItem {
  id: string;
  name: string;
  type: ItemType;
  status: ItemStatus;
  category: ItemCategory;
  quantity: number;
  max_quantity: number;
  unit: string;
  is_available: boolean;
  image_url: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export interface ICreateItemRequest {
  name: string;
  type: ItemType;
  category: ItemCategory;
  quantity: number;
  unit: string;
  image_url?: string;
}

export interface IUpdateItemRequest {
  id: string;
  name?: string;
  type?: ItemType;
  status?: ItemStatus;
  category?: ItemCategory;
  quantity?: number;
  max_quantity?: number;
  unit?: string;
  image_url?: string;
}

export interface IInventoryListResponse {
  totalItems: number;
  itemsReturned: number;
  items: IInventoryItem[];
}

export interface IInventoryFilter {
  type?: ItemType;
  status?: ItemStatus;
  category?: ItemCategory;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}
