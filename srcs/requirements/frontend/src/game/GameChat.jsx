import { useState, useEffect, useRef } from 'react'
import { socket } from '../backend_communication/socket'
import { useAuth } from '../AuthContext.jsx'
import '../styles/GamePage.css'

function GameChat({ roomId }) {
	const { user } = useAuth();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const bottomRef = useRef(null);

	useEffect(() => {
		const handler = (msg) => {
			if (msg.roomId !== roomId) return;
			setMessages(prev => [...prev, msg].slice(-5));
		};
		socket.on('chatMessage', handler);
		return () => { socket.off('chatMessage', handler); };
	}, [roomId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		const message = input.trim();
		if (!message || !user?.id) return;
		socket.emit('chatMessage', { userId: user.id, message });
		setInput('');
	};

	const handleKey = (e) => {
		if (e.key === 'Enter') handleSend();
	};

	return (
		<div className="game-chat">
			<div className="chat-messages">
				{messages.map((msg, i) => (
					<p key={`${msg.timestamp}-${i}`}><strong>{msg.userId}</strong>: {msg.message}</p>
				))}
				<div ref={bottomRef} />
			</div>
			<div className="chat-input">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKey}
					placeholder="Message..."
					maxLength={200}
				/>
				<button onClick={handleSend} disabled={!input.trim()}>Send</button>
			</div>
		</div>
	);
}

export default GameChat;
