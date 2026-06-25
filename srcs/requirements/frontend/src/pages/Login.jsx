import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Login page — email + password form
function Login()
{
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');

	// Placeholder —> no backend actaully made
	async function handleSubmit(event)
	{
		event.preventDefault();
		const res = await fetch('/backend/auth/login', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({ identifier, password }),
		});
		if (res.ok) {
			console.log('USER LOGGED IN WOOHOO');
			window.location.href = "/";
		}
		else
			console.log('not logged in :(', await res.json());
	}

	return (
		<div className="page">
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label>Email or Username</label>
				<br />
				<input
					type="text"
					value={identifier}
					onChange={(e) => setIdentifier(e.target.value)}
					required
				/>
				<br /><br />
				<label>Password</label>
				<br />
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<br /><br />
				<button type="submit" className="btn">Login</button>
			</form>
			<p>No account? <Link to="/register">Register</Link></p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Login
