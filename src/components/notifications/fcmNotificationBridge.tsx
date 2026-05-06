"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken, onMessage } from "firebase/messaging";
import {
  Banknote,
  BellRing,
  CalendarPlus,
  PackageX,
  Timer,
  Wallet,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAdmin } from "@/context/adminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  clearAlertItems,
  removeAlertItem,
} from "@/lib/fcmAlertState";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "@/service/notification.service";

type FcmPayloadData = {
  event?: string;
  type?: string;
  payload?: string;
  bookingId?: string;
  orderId?: string;
  customerName?: string;
  orderNumber?: string;
  totalAmount?: string | number;
};

type ParsedFcmPayloadData = FcmPayloadData & {
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
  "paid.downpayment": {
    title: "Downpayment received",
    body: "A booking downpayment has been recorded.",
    rowClassName: "border-emerald-200/80 bg-emerald-50/40",
    iconClassName: "text-emerald-600",
    chipClassName: "border-emerald-200 bg-emerald-100/70 text-emerald-900",
  },
  "paid.fullpayment": {
    title: "Full payment received",
    body: "A booking was paid in full.",
    rowClassName: "border-cyan-200/80 bg-cyan-50/40",
    iconClassName: "text-cyan-600",
    chipClassName: "border-cyan-200 bg-cyan-100/70 text-cyan-900",
  },
};

function isNotificationEvent(
  event: string,
): event is Exclude<NotificationEvent, "unknown"> {
  return event in NOTIFICATION_EVENT_META;
}

function normalizeEventName(event?: string): string {
  const normalized = (event ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_,\-\s]+/g, ".")
    .replace(/,+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");

  const aliasMap: Record<string, string> = {
    "paid.down.payment": "paid.downpayment",
    "paid.full.payment": "paid.fullpayment",
    "payment.downpayment": "paid.downpayment",
    "payment.fullpayment": "paid.fullpayment",
  };

  return aliasMap[normalized] ?? normalized;
}

function parsePayloadData(data?: ParsedFcmPayloadData): ParsedFcmPayloadData {
  if (!data?.payload || typeof data.payload !== "string") {
    return data ?? {};
  }

  try {
    const parsed = JSON.parse(data.payload) as Record<string, unknown>;
    return {
      ...(parsed as ParsedFcmPayloadData),
      ...data,
    };
  } catch {
    return data;
  }
}

function getNotificationBody(
  event: NotificationEvent,
  payload: ParsedFcmPayloadData,
  fallback: string,
): string {
  const customer = payload.customerName?.trim();
  const orderNumber = payload.orderNumber?.trim();
  const bookingId = payload.bookingId?.trim();
  const orderId = payload.orderId?.trim();
  const amount = payload.totalAmount;

  if (event === "booking.created") {
    if (customer) {
      return `${customer} created a new booking${orderNumber ? ` for order ${orderNumber}` : ""}.`;
    }

    return fallback;
  }

  if (event === "booking.ongoing") {
    return bookingId
      ? `Booking ${bookingId} moved to ongoing status.`
      : fallback;
  }

  if (event === "paid.downpayment") {
    const amountSuffix = amount ? ` Amount: ${amount}.` : "";
    if (orderNumber || orderId) {
      return `Downpayment received for order ${orderNumber ?? orderId}.${amountSuffix}`;
    }

    return `Downpayment received.${amountSuffix}`;
  }

  if (event === "paid.fullpayment") {
    const amountSuffix = amount ? ` Amount: ${amount}.` : "";
    if (orderNumber || orderId) {
      return `Full payment received for order ${orderNumber ?? orderId}.${amountSuffix}`;
    }

    return `Full payment received.${amountSuffix}`;
  }

  return fallback;
}

function getNotificationIcon(event: NotificationEvent) {
  const iconClassName =
    event === "unknown"
      ? "text-muted-foreground"
      : NOTIFICATION_EVENT_META[event].iconClassName;

  if (event === "booking.created") {
    return <CalendarPlus className={cn("h-3.5 w-3.5", iconClassName)} />;
  }

  if (event === "booking.ongoing") {
    return <Timer className={cn("h-3.5 w-3.5", iconClassName)} />;
  }

  if (event === "inventory.low") {
    return <PackageX className={cn("h-3.5 w-3.5", iconClassName)} />;
  }

  if (event === "paid.downpayment") {
    return <Wallet className={cn("h-3.5 w-3.5", iconClassName)} />;
  }

  if (event === "paid.fullpayment") {
    return <Banknote className={cn("h-3.5 w-3.5", iconClassName)} />;
  }

  return <BellRing className={cn("h-3.5 w-3.5", iconClassName)} />;
}

const FCM_INSTALLATION_ID_KEY = "fcm.installationId";
const FCM_TOKEN_KEY = "fcm.currentToken";
const FCM_SUBSCRIPTION_KEY = "fcm.subscription.v1";
const FCM_SESSION_SYNC_KEY = "fcm.subscription.sessionSynced.v1";

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
  data?: ParsedFcmPayloadData;
}): NotificationItem {
  const normalizedData = parsePayloadData(payload.data);
  const eventRaw = normalizeEventName(
    normalizedData.event ?? normalizedData.type,
  );
  const event: NotificationEvent = isNotificationEvent(eventRaw)
    ? eventRaw
    : "unknown";

  const meta = event === "unknown" ? null : NOTIFICATION_EVENT_META[event];
  const defaultTitle = payload.title || meta?.title || "New notification";
  const defaultBody = getNotificationBody(
    event,
    normalizedData,
    payload.body || meta?.body || "You received an admin notification.",
  );

  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `evt_${Date.now()}`,
    title: defaultTitle,
    body: defaultBody,
    event,
    createdAt: new Date().toISOString(),
    bookingId: normalizedData.bookingId,
    orderId: normalizedData.orderId,
    customerName: normalizedData.customerName,
    orderNumber: normalizedData.orderNumber,
    totalAmount: normalizedData.totalAmount,
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

    const parsed = JSON.parse(raw) as {
      adminId?: string;
      token?: string;
      syncedAt?: string;
    };
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
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [showOlder, setShowOlder] = useState(false);
  const [enabled, setEnabled] = useState(readAlertState().enabled);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const hasAutoStarted = useRef(false);
  const activeBookingId = useMemo(() => {
    const match = pathname.match(/^\/bookings\/([^/?#]+)/);
    return match?.[1] ?? null;
  }, [pathname]);
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
        const hasSessionSync =
          typeof window !== "undefined" &&
          sessionStorage.getItem(FCM_SESSION_SYNC_KEY) === "true";

        const needsSubscriptionSync =
          !hasSessionSync ||
          existingSubscription?.adminId !== adminId ||
          existingSubscription?.token !== fcmToken;

        if (needsSubscriptionSync) {
          await subscribeToNotifications(jwt, {
            token: fcmToken,
            role: "admin",
            adminId,
            installationId,
            platform: "web",
          });

          localStorage.setItem(
            FCM_SUBSCRIPTION_KEY,
            JSON.stringify({
              adminId,
              token: fcmToken,
              syncedAt: new Date().toISOString(),
            }),
          );

          sessionStorage.setItem(FCM_SESSION_SYNC_KEY, "true");
        }

        localStorage.setItem(FCM_TOKEN_KEY, fcmToken);

        setAlertsConnected(true);
        toast.success("Notifications enabled.");

        const invalidateNotificationQueries = async (
          item: NotificationItem,
        ) => {
          const invalidations: Promise<unknown>[] = [
            queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
            queryClient.invalidateQueries({ queryKey: ["bookingTrends"] }),
          ];

          if (item.event === "booking.created") {
            invalidations.push(
              queryClient.invalidateQueries({ queryKey: ["bookings"] }),
              queryClient.invalidateQueries({ queryKey: ["bookingsToday"] }),
              queryClient.invalidateQueries({ queryKey: ["calendarBookings"] }),
            );
          }

          if (item.bookingId) {
            invalidations.push(
              queryClient.invalidateQueries({
                queryKey: ["booking", item.bookingId],
              }),
              queryClient.invalidateQueries({
                queryKey: ["available-cleaners", item.bookingId],
              }),
              queryClient.invalidateQueries({ queryKey: ["bookings"] }),
              queryClient.invalidateQueries({ queryKey: ["bookingsToday"] }),
              queryClient.invalidateQueries({ queryKey: ["calendarBookings"] }),
            );
          }

          if (item.orderId) {
            invalidations.push(
              queryClient.invalidateQueries({
                queryKey: ["order", item.orderId],
              }),
            );
          }

          await Promise.all(invalidations);
        };

        unsubscribeForeground = onMessage(messaging, (payload) => {
          if (cancelled) {
            return;
          }

          const item = createUiItem({
            title: payload.notification?.title,
            body: payload.notification?.body,
            data: payload.data as FcmPayloadData | undefined,
          });

          pushAlertItem(item);

          if (item.event !== "unknown") {
            void invalidateNotificationQueries(item);
          }

          if (activeBookingId && item.bookingId === activeBookingId) {
            toast.info(item.title);
            return;
          }

          toast.info(item.title);
        });
      } catch (error) {
        console.error("[FCM] Bootstrap failed:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listen, canEnable, adminId, retryTick]);

  const recentItems = items.filter(
    (item) => Date.now() - new Date(item.createdAt).getTime() < 86400000,
  );
  const olderItems = items.filter(
    (item) => Date.now() - new Date(item.createdAt).getTime() >= 86400000,
  );

  if (!isSignedIn) {
    return null;
  }

  if (!renderCard) {
    return null;
  }
  return (
    <Card className="flex flex-col">
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
      <CardContent className="space-y-3 pt-0 flex-1 flex flex-col overflow-hidden min-h-0">
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
                  sessionStorage.removeItem(FCM_SESSION_SYNC_KEY);
                  setAlertsConnected(false);
                  toast.success("Notifications disabled.");
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
                sessionStorage.removeItem(FCM_SESSION_SYNC_KEY);
                setAlertsConnected(false);
                setErrorMessage(null);
                setRetryTick((prev) => prev + 1);
              }}
            >
              Reconnect
            </Button>
          </div>
        ) : null}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="mt-auto w-full">
              View {items.length > 0 ? items.length : ""} Notifications
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-106.25">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Recent Notifications</DialogTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    clearAlertItems();
                    setItems([]);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </DialogHeader>
            <div className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
              {recentItems.length === 0 && olderItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Waiting for notifications.
                </p>
              ) : (
                <>
                  {recentItems.map((item) => (
                    <article
                      key={item.id}
                      className={cn(
                        "relative rounded-md border px-3 py-2",
                        item.event === "unknown"
                          ? "border-border/70 bg-card"
                          : NOTIFICATION_EVENT_META[item.event].rowClassName,
                      )}
                    >
                      <button
                        onClick={() => {
                          removeAlertItem(item.id);
                          setItems((prev) =>
                            prev.filter((i) => i.id !== item.id),
                          );
                        }}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground pr-6">
                        {getNotificationIcon(item.event)}
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-1.5 py-0 text-[10px] font-medium",
                            item.event === "unknown"
                              ? ""
                              : NOTIFICATION_EVENT_META[item.event]
                                  .chipClassName,
                          )}
                        >
                          {item.event}
                        </Badge>
                        {item.orderNumber ? (
                          <span className="border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                            Order {item.orderNumber}
                          </span>
                        ) : null}
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
                  ))}

                  {olderItems.length > 0 && !showOlder && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => setShowOlder(true)}
                    >
                      View {olderItems.length} older notifications
                    </Button>
                  )}

                  {showOlder && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">
                        Older Notifications
                      </h4>
                      {olderItems.map((item) => (
                        <article
                          key={item.id}
                          className={cn(
                            "relative rounded-md border px-3 py-2 opacity-80 hover:opacity-100 transition-opacity",
                            item.event === "unknown"
                              ? "border-border/70 bg-card"
                              : NOTIFICATION_EVENT_META[item.event]
                                  .rowClassName,
                          )}
                        >
                          <button
                            onClick={() => {
                              removeAlertItem(item.id);
                              setItems((prev) =>
                                prev.filter((i) => i.id !== item.id),
                              );
                            }}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground pr-6">
                            {getNotificationIcon(item.event)}
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-1.5 py-0 text-[10px] font-medium",
                                item.event === "unknown"
                                  ? ""
                                  : NOTIFICATION_EVENT_META[item.event]
                                      .chipClassName,
                              )}
                            >
                              {item.event}
                            </Badge>
                            {item.orderNumber ? (
                              <span className="border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                                Order {item.orderNumber}
                              </span>
                            ) : null}
                            <span className="ml-auto">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-semibold leading-snug">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground leading-snug">
                            {item.body}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
