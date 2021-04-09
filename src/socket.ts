import socketio from "socket.io";

let io: socketio.Server;

export function connect(server) {
  io = new socketio.Server(server);

  io.on("connection", (socket) => {
    socket.on("", () => {
      //
    });
  });

  return io;
}

export function socket() {
  return io;
}
