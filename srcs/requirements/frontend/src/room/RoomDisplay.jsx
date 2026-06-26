import { useState, useEffect } from "react"
import { postJson } from '../backend_communication/Post'
import getAny from '../backend_communication/Get'
import { socket } from '../backend_communication/socket'
import { useAuth } from '../AuthContext.jsx';

function RoomDisplay() {
	const [rooms, setRooms] = useState([]);
	const [roomId, setRoomId] = useState(null);
	const { user } = useAuth();

	function onRefresh() {
		console.log('emitting getRoom');
		socket.emit('getRoom');
	}

	function onCreate() {
		socket.emit('createRoom', {
			userId: user.id
		});
	}

	function onJoin(roomId) {
		if (!roomId) return ;
		console.log(`emitting joinRoom: ${roomId}`);
		socket.emit('joinRoom', {
			userId: user.id,
			roomId: roomId
		});
	}

	function onLeave() {
		console.log(`emitting leaveRoom`);
		socket.emit('leaveRoom', {
			userId: user.id
		});
	}

	// socket ALL active rooms
	useEffect(() => {
		if (!socket.connected) socket.connect();
		console.log('waiting on rooms');
		socket.on('list', (msg) => {
			switch (msg.type) {
				case 'rooms':
					setRooms(msg.payload.array);
					console.log('got rooms: ', msg.payload.array);
					break ;
			}
		});
		setInterval(() => {
		}, 1000 * 60 * 5);
		onRefresh();
	}, []);
	// Grab Id, status, host, amount of users
	// show 10 rooms at the time
  return (
	<div>
		<button onClick={() => onCreate()}>Create</button>
		<button onClick={() => onRefresh()}>Refresh</button>
		<button onClick={() => onLeave()}>Leave</button>
		{rooms && rooms.map(room => (
			<div>
			<button onClick={() => onJoin(room.id)}>
				{room.id} - {room.players[0]}: ?/?
			</button>
			</div>
		))}
	</div>
  );
}

/*function Fetcher() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  //const [postBody, setPostBody] = useState('');  // user types JSON as text
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const doFetch = async () => {
	setLoading(true);
	setError(null);
	setResult(null);
	try {
		setResult(await getAny(url));
	} catch (e) {
	  setError(e.message);
	  setResult(null);
	} finally {
	  setLoading(false);
	}
  };

  const upFetch = async () => {
	setLoading(true);
	setError(null);
	setResult(null);
	try {
		if (!result || result.statusCode) throw new Error('No valid data to update');
		let bodyJson = result;
		setResult(await postJson(url, bodyJson));
	} catch (e) {
		setError(e.message);
		setResult(null);
	} finally {
		setLoading(false);
	}
};

  return (
	<div>
	<Game />
	<LoginPage />
	<LogoutButton />
	  <input
		type="text"
		value={url}
		onChange={e => setUrl(e.target.value)}
		placeholder="Enter a URL, e.g. /user"
		style={{ width: '400px' }}
	  />
	  <button onClick={doFetch} disabled={!url || loading}>
		{loading ? 'Fetching...' : 'Fetch'}
	  </button>
	  <button onClick={upFetch} disabled={!url || loading}>
		{loading ? 'Posting...' : 'Post'}
	  </button>

	  {error && <p style={{ color: 'red' }}>Error: {error}</p>}

	  {result !== null && (
		<pre>{typeof result === 'object' ? JSON.stringify(result, null, 2) : result}</pre>
	  )}
	</div>
  );
}*/

export default RoomDisplay