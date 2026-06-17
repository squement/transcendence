import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Friends page —> friend list + online status ?
function Friends()
{
	return (
		<div className="page">
			<h1>Friends</h1>
			<p>Friend list — coming soon.</p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Friends
