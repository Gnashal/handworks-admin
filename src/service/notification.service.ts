import { fetchWithAuth } from "@/service/index";
import {
  ISubscribeNotificationRequest,
  ISubscribeNotificationResponse,
} from "@/types/notification";

const subscribeToNotifications = async (
  token: string,
  body: ISubscribeNotificationRequest,
): Promise<ISubscribeNotificationResponse> => {
  const url = `/api/notification/subscribe`;
  return await fetchWithAuth<ISubscribeNotificationResponse>(url, token, {
    method: "POST",
    data: body,
  });
};

const unsubscribeFromNotifications = async (
  token: string,
  body: ISubscribeNotificationRequest,
): Promise<ISubscribeNotificationResponse> => {
  const url = `/api/notification/unsubscribe`;
  return await fetchWithAuth<ISubscribeNotificationResponse>(url, token, {
    method: "POST",
    data: body,
  });
};

export { subscribeToNotifications, unsubscribeFromNotifications };
