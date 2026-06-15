import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DrawBoard from './click_App.jsx'
import { Click, Draw, Fetcher } from './click_App.jsx'
import Game from './Game.jsx'
import Message from './Message.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<Fetcher />
	<DrawBoard />
	<Draw />
    <App />
	<Game />
	<Message />
  </StrictMode>,
)
