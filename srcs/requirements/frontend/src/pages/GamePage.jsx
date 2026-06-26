import { useState } from 'react'
import { Link } from 'react-router-dom'
import Game from '../game/Game.jsx'
import { useRoom } from '../room/useRoom.js'
import '../styles/pages.css'
import { socket } from '../backend_communication/socket.js'

// GamePage —> wraps Game component in a full page
function GamePage()
{
	const { rooms, roomId, onRefresh, onCreate, onJoin, onLeave } = useRoom();
	const [gameMode, setGameMode] = useState(sessionStorage.getItem('gameMode') || null);

	const handleMode = (mode) => {
		sessionStorage.setItem('gameMode', mode);
		setGameMode(mode);
	};

	if (!gameMode){
		console.log('mode selection');
	}
	else {
		if (!roomId) {
			console.log('room selection, gameMode:', gameMode);
		}
		else {
			console.log('game launched i think, gameMode:', gameMode);
		}
	}

	return (
	<>
		<div className="page">
			<Link to="/">← Back to menu</Link>
			{!gameMode ? (
				<div>
					<button onClick={() => handleMode("solo_bot")}>PPPB Mode</button>
					<button onClick={() => handleMode("solo_training")}>Training Mode</button>
					<button onClick={() => handleMode("local")}>Local Mode</button>
					<button onClick={() => handleMode("online")}>Online Mode</button>
				</div>
			) : (
				<div>
					{!roomId ? (
						<div>
							<button onClick={() => onCreate()}>Create</button>
							{rooms && rooms.map(room => (
								<div>
								<button onClick={() => onJoin(room.id)}>
									{room.id} - {room.players[0]}: ?/?
								</button>
								</div>
							))}
							<button onClick={() => onRefresh()}>Refresh</button>
						</div>
					) : (
						<div>
							<button onClick={() => onLeave()}>Leave</button>
							<div>
								<Game gameMode={gameMode} onGameOver={() => setGameMode(null)} />
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	</>
	);
}

export default GamePage;