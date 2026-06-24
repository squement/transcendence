import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Game from '../game/Game.jsx'
import '../styles/pages.css'

function GamePage() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId');

    const [mode, setMode] = useState(null);

    if (roomId) {
        return (
            <div className="page">
                <Link to="/">← Back to menu</Link>
                <Game roomId={roomId} />
            </div>
        );
    }

    if (!mode) {
        return (
            <div className="page">
                <Link to="/">← Back to menu</Link>
                <h2>Choisir un mode</h2>
                <button className="btn" onClick={() => setMode('solo_bot')}>PPPB Mode</button>
                <button className="btn" onClick={() => setMode('solo_training')}>Training Mode</button>
                <button className="btn" onClick={() => setMode('local')}>Local</button>
                <button className="btn" onClick={() => setMode('online')}>Online</button>
            </div>
        );
    }

    return (
        <div className="page">
            <button className="btn" onClick={() => setMode(null)}>Return</button>
            <Game mode={mode} />
        </div>
    );
}

export default GamePage
