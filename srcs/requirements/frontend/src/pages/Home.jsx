import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Home page — entry point of the app
function Home()
{
	return (
		<div className="page">
			<h1>Transcendence</h1>
			<br />
			<Link to="/game" className="btn">Play</Link>
			<Link to="/login" className="btn">Login</Link>
			<Link to="/register" className="btn">Register</Link>
			<Link to="/profile" className="btn">Profile</Link>
			<Link to="/tournament" className="btn">Tournament</Link>
			<Link to="/friends" className="btn">Friends</Link>
			<Link to="/settings" className="btn">Settings</Link>
		</div>
	);
}

export default Home
