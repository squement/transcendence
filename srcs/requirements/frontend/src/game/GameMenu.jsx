import { useState } from 'react'
import { Link } from 'react-router-dom'
import GamePage from './GamePage.jsx'
import GameRules from './GameRules.jsx'
import { useRoom } from '../room/useRoom.js'
import '../styles/pages.css'
import '../styles/GamePage.css'
import { socket } from '../backend_communication/socket.js'

// GameMenu —> wraps Game component in a full page
function GameMenu()
{
	const { rooms, roomId, roomMsg, onRefresh, onCreate, onJoin, onLeave } = useRoom();
	const [gameMode, setGameMode] = useState(sessionStorage.getItem('gameMode') || null);
	const [settings, setSettings] = useState({
		scoreToWin: 10,
		ballSpeed: 120,
		maxBallSpeed: 240,
		paddleSpeed: 480,
		endlessMode: false,
		set: false
	});

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
					{!settings.set ? (
						<GameRules settings={settings} setSettings={setSettings} />
					) : (
						<div className='game-wrapper'>
						{!roomId ? (
							<div>
								<button className='btn-game' onClick={() => setSettings({...settings, set: false})}>Change Game Rules</button>
								<button className='btn-game' onClick={() => setGameMode(null)}>Game Mode</button>
								<button className='btn-game' onClick={() => onCreate()}>Create</button>
								{rooms && rooms.map(room => (
									<div>
									<button className='btn-game' onClick={() => onJoin(room.id)}>
										{room.id} - {room.players[0]}: ?/?
									</button>
									</div>
								))}
								<button className='btn-game' onClick={() => onRefresh()}>Refresh</button>
							</div>
						) : (
							<div className='game-wrapper'>
								<h3>{roomId}</h3>
								<GamePage gameMode={gameMode} settings={settings} onLeave={onLeave} />
								<p>{roomMsg}</p>
							</div>
						)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default GameMenu;