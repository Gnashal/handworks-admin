import { fetchInventoryItems } from "@/service";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

export function useInventory() {
  const [loading, setLoading] = useState(false);
  const { isLoaded, getToken } = useAuth();

  async function fetchItems(page?: number, limit?: number) {
    if (!isLoaded) {
      setLoading(true);
    }

    const token = await getToken();

    if (!token) {
      toast.error("No active session token found");
      return;
    }

    try {
      const data = fetchInventoryItems(token, page, limit);
      return data;
    } catch (err) {
      toast.error("Failed to fetch inventory items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return { fetchItems, loading };
}
