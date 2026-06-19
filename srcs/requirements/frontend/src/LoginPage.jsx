import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await login(username);
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