import type { Server as HTTPServer } from "http";
import type { Socket } from "net";
import type { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";

/**
 * Extend Next.js `res` object to include Socket.IO server instance
 */
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};
