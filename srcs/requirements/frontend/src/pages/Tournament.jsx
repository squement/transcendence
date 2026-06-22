import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Tournament page
function Tournament()
{
	return (
		<div className="page">
			<h1>Tournament</h1>
			<p>Tournament, coming soon.</p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Tournament
