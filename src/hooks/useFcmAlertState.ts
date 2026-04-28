"use client";

import { useEffect, useState } from "react";

import { FCM_ALERTS_UPDATED_EVENT, readAlertState } from "@/lib/fcmAlertState";

export function useFcmAlertState() {
  const [state, setState] = useState(() => readAlertState());

  useEffect(() => {
    const sync = () => {
      setState(readAlertState());
    };

    sync();

    window.addEventListener(FCM_ALERTS_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(FCM_ALERTS_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return state;
}
