"use client";

import { useNotificationSocket } from "@/hooks/useNotificationSocket";

/**
 * Mounts the notification WebSocket for the current session.
 * Renders nothing — side-effects only.
 */
export default function NotificationSocketProvider() {
  useNotificationSocket();
  return null;
}
