import { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

let socket: Server;

export function connect(app: Application) {
  const server = createServer(app);
  socket = new Server(server);
  return server;
}

export function io() {
  return socket;
}
