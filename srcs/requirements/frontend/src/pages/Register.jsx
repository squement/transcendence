import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

// Register page :
// -> username
// -> email
// -> password
function Register()
{
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Placeholder for the mmoent
	async function handleSubmit(event)
	{
		event.preventDefault();
		const res = await fetch('/backend/auth/register', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({ username, email, password }),
		});
		if (res.ok) {
			console.log('NEW USER IN THE FCKIN DATABASE LETS GOOOOO');
			window.location.href = "/";
		}
		else
			console.log('no new user :(', await res.json());
	}

	return (
		<div className="page">
			<h1>Create account</h1>
			<form onSubmit={handleSubmit}>
				<label>Username</label>
				<br />
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<br /><br />
				<label>Email</label>
				<br />
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
				<button type="submit" className="btn">Register</button>
			</form>
			<p>Already have an account? <Link to="/login">Login</Link></p>
			<Link to="/">← Back</Link>
		</div>
	);
}

export default Register
