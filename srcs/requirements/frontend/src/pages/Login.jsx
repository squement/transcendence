import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'
import { LogoutButton } from '../LoginPage'
import LoginPage from '../LoginPage'

// Login page — email + password form
function Login()
{
	const { t } = useTranslation();
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
			<h1>{t('login.title')}</h1>
			<form onSubmit={handleSubmit}>
				<label>{t('login.identifier_label')}</label>
				<br />
				<input
					type="text"
					value={identifier}
					onChange={(e) => setIdentifier(e.target.value)}
					required
				/>
				<br /><br />
				<label>{t('login.password_label')}</label>
				<br />
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<br /><br />
				<button type="submit" className="btn">{t('login.submit')}</button>
			</form>
			<p>{t('login.no_account')} <Link to="/register">{t('login.register_link')}</Link></p>
			<Link to="/">{t('common.back')}</Link>
			<LoginPage />
			<LogoutButton />
		</div>
	);
}

export default Login
