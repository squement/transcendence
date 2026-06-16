import { useSocket } from './useSocket';

export default function Broadcast() {
  const messages = useSocket();

  return (
    <div>
      <h2>Messages from server</h2>
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
}