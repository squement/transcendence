import { useSocket } from './useSocket';

export default function Broadcast() {
  const [messages, users] = useSocket();

  return (
    <div>
      <h2>Messages from server</h2>
	  <p>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
	  </p>
      <ul>
        {users.map((user, id) => <li key={id}>{user}</li>)}
      </ul>
    </div>
  );
}