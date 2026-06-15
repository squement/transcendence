import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DrawBoard from './click_App.jsx'
import { Click, Draw } from './click_App.jsx'
import Game from './game/Game.jsx'
import Message from './Message.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
	{/* <Click />
	<DrawBoard />
	<Draw />
    <App /> */}
	<Game />
	<Message />
  </StrictMode>,
)
