import { Link } from 'react-router-dom'
import Game from '../game/Game.jsx'
import '../styles/pages.css'

// GamePage —> wraps Game component in a full page
function GamePage()
{
	return (
		<div className="page">
			<Link to="/">← Back to menu</Link>
			<Game />
		</div>
	);
}

export default GamePage
