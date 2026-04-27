"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { BellRing, CalendarPlus, PackageX, Timer } from "lucide-react";
import { toast } from "sonner";

import { useAdmin } from "@/context/adminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  firebaseVapidKey,
  getMessagingIfSupported,
} from "@/lib/firebaseClient";
import {
  FCM_ALERTS_UPDATED_EVENT,
  type NotificationEvent,
  type NotificationItem,
  pushAlertItem,
  readAlertState,
  setAlertsConnected,
} from "@/lib/fcmAlertState";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "@/service/notification.service";

type FcmPayloadData = {
  event?: string;
  payload?: string;
};

const NOTIFICATION_EVENT_META: Record<
  Exclude<NotificationEvent, "unknown">,
  {
    title: string;
    body: string;
    rowClassName: string;
    iconClassName: string;
    chipClassName: string;
  }
> = {
  "booking.created": {
    title: "New booking created",
    body: "A new booking was created and is waiting for review.",
    rowClassName: "border-blue-200/80 bg-blue-50/40",
    iconClassName: "text-blue-600",
    chipClassName: "border-blue-200 bg-blue-100/70 text-blue-900",
  },
  "booking.ongoing": {
    title: "Booking in progress",
    body: "A booking moved to ongoing status.",
    rowClassName: "border-violet-200/80 bg-violet-50/40",
    iconClassName: "text-violet-600",
    chipClassName: "border-violet-200 bg-violet-100/70 text-violet-900",
  },
  "inventory.low": {
    title: "Inventory is running low",
    body: "One or more inventory items need restocking.",
    rowClassName: "border-amber-200/80 bg-amber-50/40",
    iconClassName: "text-amber-600",
    chipClassName: "border-amber-200 bg-amber-100/70 text-amber-900",
  },
};

function isNotificationEvent(
  event: string,
): event is Exclude<NotificationEvent, "unknown"> {
  return event in NOTIFICATION_EVENT_META;
}

const FCM_INSTALLATION_ID_KEY = "fcm.installationId";
const FCM_TOKEN_KEY = "fcm.currentToken";
const FCM_SUBSCRIPTION_KEY = "fcm.subscription.v1";

const SW_FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID ?? "",
};

function getServiceWorkerScriptUrl(): string {
  const params = new URLSearchParams();

  Object.entries(SW_FIREBASE_CONFIG).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query
    ? `/firebase-messaging-sw.js?${query}`
    : "/firebase-messaging-sw.js";
}

function getInstallationId(): string {
  const existing = localStorage.getItem(FCM_INSTALLATION_ID_KEY);
  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `inst_${Date.now()}`;

  localStorage.setItem(FCM_INSTALLATION_ID_KEY, id);
  return id;
}

function createUiItem(payload: {
  title?: string;
  body?: string;
  data?: FcmPayloadData;
}): NotificationItem {
  const eventRaw = (payload.data?.event ?? "").replace(",", ".");
  const event: NotificationEvent = isNotificationEvent(eventRaw)
    ? eventRaw
    : "unknown";

  const meta = event === "unknown" ? null : NOTIFICATION_EVENT_META[event];
  const defaultTitle = meta?.title ?? "New notification";
  const defaultBody = meta?.body ?? "You received an admin notification.";

  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `evt_${Date.now()}`,
    title: defaultTitle,
    body: payload.body || defaultBody,
    event,
    createdAt: new Date().toISOString(),
  };
}

type FcmNotificationBridgeProps = {
  renderCard?: boolean;
  listen?: boolean;
};

function readStoredSubscription() {
  try {
    const raw = localStorage.getItem(FCM_SUBSCRIPTION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as { adminId?: string; token?: string };
    if (!parsed.adminId || !parsed.token) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function FcmNotificationBridge({
  renderCard = true,
  listen = true,
}: FcmNotificationBridgeProps) {
  const { isLoaded, isSignedIn, getToken: getClerkToken } = useAuth();
  const { adminId } = useAdmin();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [enabled, setEnabled] = useState(readAlertState().enabled);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const hasAutoStarted = useRef(false);

  const canEnable = useMemo(
    () => isLoaded && isSignedIn && Boolean(adminId),
    [adminId, isLoaded, isSignedIn],
  );

  useEffect(() => {
    const syncFromStorage = () => {
      const state = readAlertState();
      setEnabled(state.enabled);
      setItems(state.items);
    };

    syncFromStorage();

    window.addEventListener(FCM_ALERTS_UPDATED_EVENT, syncFromStorage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener(FCM_ALERTS_UPDATED_EVENT, syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  useEffect(() => {
    if (!listen || !canEnable || hasAutoStarted.current) {
      return;
    }

    hasAutoStarted.current = true;

    let unsubscribeForeground: (() => void) | null = null;
    let cancelled = false;

    const bootstrap = async () => {
      try {
        setIsConnecting(true);
        setErrorMessage(null);

        if (typeof Notification === "undefined") {
          const message = "This browser does not support notifications.";
          setErrorMessage(message);
          toast.error(message);
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          const message = "Browser notification permission was not granted.";
          setErrorMessage(message);
          toast.warning(message);
          return;
        }

        const messaging = await getMessagingIfSupported();
        if (!messaging) {
          const message =
            "Firebase messaging is not supported in this browser.";
          setErrorMessage(message);
          toast.error(message);
          return;
        }

        const registration = await navigator.serviceWorker.register(
          getServiceWorkerScriptUrl(),
        );

        const fcmToken = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: firebaseVapidKey || undefined,
        });

        if (!fcmToken) {
          const message = "FCM token could not be generated.";
          setErrorMessage(message);
          toast.error(message);
          return;
        }

        const jwt = await getClerkToken();
        if (!jwt || !adminId) {
          const message =
            "Missing admin identity for notification subscription.";
          setErrorMessage(message);
          toast.error(message);
          return;
        }

        const installationId = getInstallationId();

        const existingSubscription = readStoredSubscription();
        const needsSubscription =
          existingSubscription?.adminId !== adminId ||
          existingSubscription?.token !== fcmToken;

        if (needsSubscription) {
          await subscribeToNotifications(jwt, {
            token: fcmToken,
            role: "admin",
            adminId,
            installationId,
            platform: "web",
          });

          localStorage.setItem(
            FCM_SUBSCRIPTION_KEY,
            JSON.stringify({ adminId, token: fcmToken }),
          );
        }

        localStorage.setItem(FCM_TOKEN_KEY, fcmToken);

        setAlertsConnected(true);

        if (!enabled) {
          toast.success("Notifications enabled.");
        }

        unsubscribeForeground = onMessage(messaging, (payload) => {
          if (cancelled) {
            return;
          }

          const item = createUiItem({
            title: payload.notification?.title,
            body: payload.notification?.body,
            data: payload.data as FcmPayloadData | undefined,
          });

          if (
            item.event !== "booking.created" &&
            item.event !== "booking.ongoing" &&
            item.event !== "inventory.low"
          ) {
            return;
          }

          pushAlertItem(item);
          toast.info(item.title, {
            description: item.body,
          });
        });
      } catch (error) {
        console.error("Failed to bootstrap FCM", error);
        const message = "Failed to initialize FCM notifications.";
        setErrorMessage(message);
        toast.error(message);
      } finally {
        setIsConnecting(false);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;

      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
    };
  }, [adminId, canEnable, enabled, getClerkToken, listen, retryTick]);

  if (!isSignedIn) {
    return null;
  }

  if (!renderCard) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="h-4 w-4 text-blue-600" />
            Live Alerts
          </CardTitle>
          <Badge
            variant={enabled ? "tertiary" : "outline"}
            className={cn(enabled ? "bg-green-600" : "")}
          >
            {isConnecting ? "Connecting" : enabled ? "Connected" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}

        {listen ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!canEnable || !enabled || isConnecting}
              onClick={async () => {
                try {
                  setIsConnecting(true);
                  const jwt = await getClerkToken();
                  const fcmToken = localStorage.getItem(FCM_TOKEN_KEY);
                  if (!jwt || !fcmToken || !adminId) {
                    return;
                  }

                  await unsubscribeFromNotifications(jwt, {
                    token: fcmToken,
                    role: "admin",
                    adminId,
                  });

                  localStorage.removeItem(FCM_SUBSCRIPTION_KEY);
                  setAlertsConnected(false);
                  toast.success("FCM notifications disabled.");
                } catch (error) {
                  console.error("Failed to unsubscribe from FCM", error);
                  toast.error("Failed to disable FCM notifications.");
                } finally {
                  setIsConnecting(false);
                }
              }}
            >
              Disable
            </Button>

            <Button
              size="sm"
              disabled={!canEnable || isConnecting}
              onClick={() => {
                hasAutoStarted.current = false;
                setAlertsConnected(false);
                setErrorMessage(null);
                setRetryTick((prev) => prev + 1);
              }}
            >
              Reconnect
            </Button>
          </div>
        ) : null}

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Waiting for notifications.
            </p>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  item.event === "unknown"
                    ? "border-border/70 bg-card"
                    : NOTIFICATION_EVENT_META[item.event].rowClassName,
                )}
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {item.event === "booking.created" ? (
                    <CalendarPlus
                      className={cn(
                        "h-3.5 w-3.5",
                        NOTIFICATION_EVENT_META["booking.created"]
                          .iconClassName,
                      )}
                    />
                  ) : item.event === "booking.ongoing" ? (
                    <Timer
                      className={cn(
                        "h-3.5 w-3.5",
                        NOTIFICATION_EVENT_META["booking.ongoing"]
                          .iconClassName,
                      )}
                    />
                  ) : (
                    <PackageX
                      className={cn(
                        "h-3.5 w-3.5",
                        NOTIFICATION_EVENT_META["inventory.low"].iconClassName,
                      )}
                    />
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-md px-1.5 py-0 text-[10px] font-medium",
                      item.event === "unknown"
                        ? ""
                        : NOTIFICATION_EVENT_META[item.event].chipClassName,
                    )}
                  >
                    {item.event}
                  </Badge>
                  <span className="ml-auto">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-snug">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">
                  {item.body}
                </p>
              </article>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
