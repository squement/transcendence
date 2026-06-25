import { useState } from 'react';
import { useAuth } from './AuthContext';

export function LogoutButton() {
	const { logout } = useAuth();
	const [error, setError] = useState(null);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (e) {
			setError(e.message);
		}
	};

	return (
		<div>
			<button onClick={handleLogout}>Se déconnecter</button>
			{error && <p>{error}</p>}
		</div>
	);
}

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await login(username);
	  console.log(res.message);
    } catch (e) {
      setError('Connexion échouée, réessaie !');
    }
  };

  return (
    <div>
      <h1>Bienvenue sur Pong !</h1>
      <input
        type="text"
        placeholder="Ton username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Se connecter</button>
      {error && <p>{error}</p>}
    </div>
  );
}