import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		const socket = io('/', {
		path: '/backend/socket.io',
		});
		socket.on('connect', () => {
		console.log('Connected!', socket.id);
		});
		socket.on('disconnect', () => {
		console.log('Disconnected');
		});
		socket.on('message', (data: string) => {
		console.log('Received:', data);
		setMessages([data]);
		});
		return () => {
			socket.disconnect();
		};
		}, []);
  return messages;
}