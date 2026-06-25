import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';

export const socket: Socket = io("/", {
  path: "/backend/socket.io",
  autoConnect: false,
});

export function initSocket() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.off();
    };
  }, []);
}