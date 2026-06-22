import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const [messages, setMessages] = useState<string[]>([]);
  const [annoncement, setAnnoncement] = useState<string[]>([]);
  const [users, setUsers] = useState([]);

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
		socket.on('message', (msg) => {
			switch (msg.type) {
				case 'health_check':
				// console.log(msg.payload.text);
				setMessages([msg.payload.text]);
				break;

				case 'notification':
					switch (msg.payload.title) {
						case 'test':
							setAnnoncement([msg.payload.text]);
						break ;
						default:
							console.log(msg.payload.title);
							socket.emit('message', {
								type: 'notification',
								payload: {
									title: `User responded`,
									text: `Hi from User`
							}});
						break ;
					}
				break;
			}
		});
		socket.on('list', (msg) => {
			switch (msg.type) {
				case 'online':
					setUsers(msg.payload.array);
					break ;
			}
		});
		return () => {
			socket.disconnect();
		};
		}, []);
  return [messages, users, annoncement];
}