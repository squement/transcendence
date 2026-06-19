import { useSocket } from './useSocket';
import { io } from 'socket.io-client';
import { useUpData } from '../game/game_socket';

export default function Broadcast() {
  const [messages, users, annoncement] = useSocket();
  useUpData();

  function Emit() {
	const socket = io('/', {
		path: '/backend/socket.io',
	});
	console.log('emitting');
	socket.emit('message', {
		type: 'notification',
		payload: {
			title: `User responded`,
			text: `Hi from User`
	}});
  }
  return (
    <div>
		<button onClick={Emit}>
		emit
	  </button>
      <h2>Messages from server</h2>
	  <p>
        {annoncement.map((msg, i) => <li key={i}>{msg}</li>)}
	  </p>
	  <p>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
	  </p>
	   <ul>
		{users.map(user => (
		<li key={user.id}>
			{user.username}: {user.update}
		</li>
		))}
	</ul>
    </div>
  );
}