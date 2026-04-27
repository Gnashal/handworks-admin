"use client";

import { useEffect, useState } from "react";

import {
  FCM_ALERTS_UPDATED_EVENT,
  readBookingUnread,
} from "@/lib/fcmAlertState";

export function useBookingAlertBadge() {
  const [hasBookingAlert, setHasBookingAlert] = useState(false);

  useEffect(() => {
    const sync = () => {
      setHasBookingAlert(readBookingUnread());
    };

    sync();

    window.addEventListener(FCM_ALERTS_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(FCM_ALERTS_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { hasBookingAlert };
}
