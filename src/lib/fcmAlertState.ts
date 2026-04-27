export type NotificationEvent =
  | "booking.created"
  | "booking.ongoing"
  | "inventory.low"
  | "unknown";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  event: NotificationEvent;
  createdAt: string;
};

type PersistedAlertState = {
  enabled: boolean;
  items: NotificationItem[];
};

const ALERT_STATE_KEY = "fcm.alertState.v1";
const BOOKING_UNREAD_KEY = "fcm.bookingUnread.v1";
export const FCM_ALERTS_UPDATED_EVENT = "fcm-alerts-updated";

const defaultState: PersistedAlertState = {
  enabled: false,
  items: [],
};

function dispatchAlertsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(FCM_ALERTS_UPDATED_EVENT));
}

export function readAlertState(): PersistedAlertState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = localStorage.getItem(ALERT_STATE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as PersistedAlertState;
    return {
      enabled: Boolean(parsed.enabled),
      items: Array.isArray(parsed.items) ? parsed.items.slice(0, 10) : [],
    };
  } catch {
    return defaultState;
  }
}

export function writeAlertState(next: PersistedAlertState) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ALERT_STATE_KEY, JSON.stringify(next));
  dispatchAlertsUpdated();
}

export function setAlertsConnected(connected: boolean) {
  const state = readAlertState();
  writeAlertState({
    ...state,
    enabled: connected,
  });
}

export function pushAlertItem(item: NotificationItem) {
  const state = readAlertState();
  writeAlertState({
    enabled: state.enabled,
    items: [item, ...state.items].slice(0, 10),
  });

  if (item.event === "booking.created" || item.event === "booking.ongoing") {
    setBookingUnread(true);
  }
}

export function clearAlertItems() {
  const state = readAlertState();
  writeAlertState({
    enabled: state.enabled,
    items: [],
  });
}

export function readBookingUnread(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(BOOKING_UNREAD_KEY) === "true";
}

export function setBookingUnread(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(BOOKING_UNREAD_KEY, value ? "true" : "false");
  dispatchAlertsUpdated();
}
