// lib/useSocket.ts
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function useSocket() {
  const ref = useRef<Socket | null>(null);

  useEffect(() => {
    // dynamic import to prevent SSR errors
    (async () => {
      if (!socket) {
        const { io } = await import("socket.io-client");
        socket = io(window.location.origin, {
          path: "/api/socket_io",
        });
      }
      ref.current = socket;
    })();

    return () => {
      // don't disconnect here because other components may use same socket
      // if you want to disconnect on unmount: socket?.disconnect();
    };
  }, []);

  return ref;
}
