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

/**
 * Connects to the support WebSocket and invalidates the ticket query
 * whenever a new message or ticket update arrives for `ticketId`.
 */
export function useSupportSocket(ticketId: string) {
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
    if (!token || !ticketId) return;

    const url = `${WS_BASE}/api/v1/ws/support?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectDelay.current = MIN_RECONNECT_DELAY;
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, PING_INTERVAL);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const type: string = msg.type ?? "";
        const msgTicketId: string = msg.ticket_id ?? "";

        // Refresh whenever a message/update is for the current ticket
        if (
          (type === "support:new_message" || type === "support:ticket_update") &&
          (!msgTicketId || msgTicketId === ticketId)
        ) {
          queryClient.invalidateQueries({ queryKey: ["ticket", ticketId], exact: true });
        }
      } catch {
        // ignore non-JSON
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
  }, [session?.user?.token, ticketId, clearTimers]);

  useEffect(() => {
    unmounted.current = false;
    if (status === "authenticated" && ticketId) {
      connect();
    }
    return () => {
      unmounted.current = true;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [status, ticketId, connect, clearTimers]);
}
