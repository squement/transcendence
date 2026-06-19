import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useUpData() {

	useEffect(() => {
		const socket = io('/', {
		path: '/backend/socket.io',
		});
		socket.on('connect', () => {
			console.log('connected to gamegateway', socket.id);
		});
		socket.on('inputs', (msg) => {
			console.log(msg.payload.text);
			socket.emit('inputs', {
				payload: {
					text: `Here's inputs`
			}});
		});
	}, []);
}