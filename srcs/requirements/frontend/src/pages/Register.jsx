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
	function handleSubmit(event)
	{
		event.preventDefault();
		console.log('Register attempted with:', username, email);
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
