import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DrawBoard from './click_App.jsx'
import { Click, Draw } from './click_App.jsx'
import Fetcher from './backend_communication/Fetcher.jsx'
import Profile from './user/user_profile.jsx'
import Game from './game/Game.jsx'
import Message from './Message.jsx'
import Broadcast from './backend_communication/Socketer'

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!user) return <LoginPage />;

  return (
    <>
      <Broadcast />
      <Game />
      <Fetcher />
      <Profile />
      <Message />
    </>
  );
}