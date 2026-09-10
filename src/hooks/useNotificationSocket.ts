"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { queryClient } from "@/components/providers/react-query";

const WS_BASE =
  (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(
    /^http/,
    "ws",
  );

const MIN_RECONNECT_DELAY = 1_000;
const MAX_RECONNECT_DELAY = 30_000;
const PING_INTERVAL = 25_000;

export function useNotificationSocket() {
  const { data: session, status } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(MIN_RECONNECT_DELAY);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const unmounted = useRef(false);

  const clearTimers = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (unmounted.current) return;
    const token = session?.user?.token;
    if (!token) return;

    const url = `${WS_BASE}/ws/notifications?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectDelay.current = MIN_RECONNECT_DELAY;
      // heartbeat: send ping every 25s so the server doesn't close the connection
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, PING_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "notification") {
          queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["unreadCount"], exact: false });
          queryClient.invalidateQueries({ queryKey: ["supportUnreadCount"], exact: false });
        }
      } catch {
        // ignore non-JSON (e.g. "pong")
      }
    };

    ws.onclose = () => {
      clearTimers();
      if (unmounted.current) return;
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(
          reconnectDelay.current * 2,
          MAX_RECONNECT_DELAY,
        );
        connect();
      }, reconnectDelay.current);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [session?.user?.token, clearTimers]);

  useEffect(() => {
    unmounted.current = false;
    if (status === "authenticated") {
      connect();
    }
    return () => {
      unmounted.current = true;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [status, connect, clearTimers]);
}
