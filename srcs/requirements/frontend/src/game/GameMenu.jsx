import { useState } from 'react'
import { Link } from 'react-router-dom'
import GamePage from './GamePage.jsx'
import { useRoom } from '../room/useRoom.js'
import '../styles/pages.css'
import '../styles/GamePage.css'
import { socket } from '../backend_communication/socket.js'

// GameMenu —> wraps Game component in a full page
function GameMenu()
{
	const { rooms, roomId, roomMsg, onRefresh, onCreate, onJoin, onLeave } = useRoom();
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
					<button className='btn-game' onClick={() => handleMode("solo_bot")}>PPPB Mode</button>
					<button className='btn-game' onClick={() => handleMode("solo_training")}>Training Mode</button>
					<button className='btn-game' onClick={() => handleMode("local")}>Local Mode</button>
					<button className='btn-game' onClick={() => handleMode("online")}>Online Mode</button>
				</div>
			) : (
				<div className='game-wrapper'>
					{!roomId ? (
						<div>
							<button className='btn-game' onClick={() => setGameMode(null)}>Game Mode</button>
							<button className='btn-game' onClick={() => onCreate()}>Create</button>
							{rooms && rooms.map((room, i) => (
								<div key={room.id}>
								<button className='btn-game' onClick={() => onJoin(room.id)}>
									Room #{i + 1} — {room.players.length}/2 players
								</button>
								</div>
							))}
							<button className='btn-game' onClick={() => onRefresh()}>Refresh</button>
						</div>
					) : (
						<div className='game-wrapper'>
							<button className='btn-game btn-leave' onClick={() => onLeave()}>Leave</button>
							<GamePage gameMode={gameMode} onGameOver={() => onLeave()} roomId={roomId} />
							<p>{roomMsg}</p>
						</div>
					)}
				</div>
			)}
		</div>
	</>
	);
}

export default GameMenu;