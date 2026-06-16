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

createRoot(document.getElementById('root')).render(
  <StrictMode>
	{/* <Click />
	<DrawBoard />
	<Draw />
    <App /> */}
	<Broadcast />
	<Game />
	<Fetcher />
	<Profile />
	<Message />
  </StrictMode>,
)
