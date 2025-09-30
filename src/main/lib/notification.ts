import { Notification } from 'electron'

export function showNotification(title: string, body: string): void {
  const notification = new Notification({
    title,
    body
  })
  notification.show()
}
