import { useSocket } from './useSocket';

export default function Broadcast() {
  const [messages, users, annoncement] = useSocket();

  return (
    <div>
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