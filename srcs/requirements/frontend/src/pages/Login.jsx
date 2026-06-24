import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'
import { LogoutButton } from '../LoginPage'
import LoginPage from '../LoginPage'

// Login page — email + password form
function Login()
{
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Placeholder —> no backend actaully made
	function handleSubmit(event)
	{
		event.preventDefault();
		console.log('Login attempted with:', email);
	}

	return (
		<div className="page">
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
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
				<button type="submit" className="btn">Login</button>
			</form>
			<p>No account? <Link to="/register">Register</Link></p>
			<Link to="/">← Back</Link>
			<LoginPage />
			<LogoutButton />
		</div>
	);
}

export default Login
