import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Settings page. Update :
// -> username
// -> avatar
// -> theme
// etc
function Settings()
{
	return (
		<div className="page">
			<h1>Settings</h1>
			<p>Account settings, coming very very soon.</p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Settings