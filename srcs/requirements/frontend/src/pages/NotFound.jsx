import { Link } from 'react-router-dom'
import '../styles/pages.css'

// 404 catching all unknown routes
function NotFound()
{
	return (
		<div className="page">
			<h1>404</h1>
			<p>Page not found.</p>
			<Link to="/">← Back to home</Link>
		</div>
	);
}

export default NotFound
