import { Link } from 'react-router-dom'
import Fetcher from '../backend_communication/Fetcher.jsx'
import Socketer from '../backend_communication/Socketer.jsx'
import Message from '../Message.jsx'
import RoomDisplay from '../room/RoomDisplay.jsx'
import Game from '../game/Game'
import '../styles/pages.css'

// FetcherPage —> dev tool :
//  testing backend GET/POST requests
function FetcherPage()
{
	return (
		<div className="page">
			<h1>Dev Tools</h1>
			<RoomDisplay />
			<Game />
			<Fetcher />
			<Socketer />
			<br />
			<Link to="/">← Back</Link>
		</div>
	);
}

export default FetcherPage
