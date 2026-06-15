import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DrawBoard from './click_App.jsx'
import { Click, Draw } from './click_App.jsx'
import Fetcher from './be_test/Fetcher.jsx'
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
