import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Profile page 
// we have to implement auth before this
function Profile()
{
	return (
		<div className="page">
			<h1>Profile</h1>
			<p>Available after login is implemented.</p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Profile
