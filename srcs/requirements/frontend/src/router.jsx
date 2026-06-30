import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import GameMenu from './game/GameMenu.jsx'
import Profile from './pages/Profile.jsx'
import Tournament from './pages/Tournament.jsx'
import Friends from './pages/Friends.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import FetcherPage from './pages/FetcherPage.jsx'

// App router — maps URL paths to page components
function Router()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/game" element={<GameMenu />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/tournament" element={<Tournament />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/fetcher" element={<FetcherPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default Router
