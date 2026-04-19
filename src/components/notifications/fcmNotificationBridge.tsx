"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { BellRing, CalendarPlus, PackageX } from "lucide-react";
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
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "@/service/notification.service";

type NotificationEvent = "booking.created" | "inventory.low" | "unknown";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  event: NotificationEvent;
  createdAt: string;
};

type FcmPayloadData = {
  event?: string;
  payload?: string;
};

const FCM_INSTALLATION_ID_KEY = "fcm.installationId";
const FCM_TOKEN_KEY = "fcm.currentToken";

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
  const eventRaw = payload.data?.event ?? "";
  const event: NotificationEvent =
    eventRaw === "booking.created" || eventRaw === "inventory.low"
      ? eventRaw
      : "unknown";

  const defaultTitle =
    event === "booking.created"
      ? "New booking created"
      : event === "inventory.low"
        ? "Inventory is running low"
        : "New notification";

  const defaultBody =
    event === "booking.created"
      ? "A new booking was created and is waiting for review."
      : event === "inventory.low"
        ? "One or more inventory items need restocking."
        : "You received an admin notification.";

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

export default function FcmNotificationBridge() {
  const { isLoaded, isSignedIn, getToken: getClerkToken } = useAuth();
  const { adminId } = useAdmin();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const hasAutoStarted = useRef(false);

  const canEnable = useMemo(
    () => isLoaded && isSignedIn && Boolean(adminId),
    [adminId, isLoaded, isSignedIn],
  );

  useEffect(() => {
    if (!canEnable || hasAutoStarted.current) {
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
          "/firebase-messaging-sw.js",
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

        await subscribeToNotifications(jwt, {
          token: fcmToken,
          role: "admin",
          adminId,
          installationId,
          platform: "web",
        });

        localStorage.setItem(FCM_TOKEN_KEY, fcmToken);

        setEnabled(true);
        toast.success("FCM notifications enabled.");

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
            item.event !== "inventory.low"
          ) {
            return;
          }

          setItems((prev) => [item, ...prev].slice(0, 10));
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
  }, [adminId, canEnable, getClerkToken, retryTick]);

  if (!isSignedIn) {
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

                setEnabled(false);
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
              setEnabled(false);
              setErrorMessage(null);
              setRetryTick((prev) => prev + 1);
            }}
          >
            Reconnect
          </Button>
        </div>

        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Waiting for notifications.
            </p>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-border/70 bg-card px-3 py-2"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {item.event === "booking.created" ? (
                    <CalendarPlus className="h-3.5 w-3.5 text-blue-600" />
                  ) : (
                    <PackageX className="h-3.5 w-3.5 text-amber-600" />
                  )}
                  <span>{item.event}</span>
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
