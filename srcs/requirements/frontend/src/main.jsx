import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DrawBoard from './click_App.jsx'
import { Click, Draw } from './click_App.jsx'
import Fetcher from './backend_communication/Fetcher.jsx'
import Game from './game/Game.jsx'
import Game_solo from './game_solo/Game_solo.jsx'
import Message from './Message.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
	{/* <Click />
	<DrawBoard />
	<Draw />
    <App /> */}
	<Game />
	<Fetcher />
	<Message />
  </StrictMode>,
)
