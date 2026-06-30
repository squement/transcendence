import "../styles/GamePage.css"

function GameRules ({ settings, setSettings }) {

	return (
		<div className="game-wrapper">
			<p className="settings-label">Ball Speed</p>
			<div className="settings-group">
				<label>
					<input 
						type="radio" 
						name="ballSpeed" 
						value="very slow" 
						checked={settings.ballSpeed === 60}
						onChange={() => setSettings({...settings, ballSpeed: 60})}
					/>
					Very Slow
				</label>
				<label>
					<input 
						type="radio" 
						name="ballSpeed" 
						value="slow" 
						checked={settings.ballSpeed === 90}
						onChange={() => setSettings({...settings, ballSpeed: 90})}
					/>
					Slow
				</label>
				<label>
					<input 
						type="radio" 
						name="ballSpeed" 
						value="default"
						checked={settings.ballSpeed === 120}
						onChange={() => setSettings({...settings, ballSpeed: 120})}
					/>
					Default
				</label>
				<label>
					<input 
						type="radio" 
						name="ballSpeed" 
						value="fast"
						checked={settings.ballSpeed === 150}
						onChange={() => setSettings({...settings, ballSpeed: 150})}
					/>
					Fast
				</label>
				<label>
					<input 
						type="radio" 
						name="ballSpeed" 
						value="very fast"
						checked={settings.ballSpeed === 180}
						onChange={() => setSettings({...settings, ballSpeed: 180})}
					/>
					Very Fast
				</label>
			</div>

			<p className="settings-label">Paddle Speed</p>
			<div className="settings-group">
				<label>
					<input 
						type="radio" 
						name="paddleSpeed" 
						value="slow" 
						checked={settings.paddleSpeed === 80}
						onChange={() => setSettings({...settings, paddleSpeed: 80})}
					/>
					Snail
				</label>
				<label>
					<input 
						type="radio" 
						name="paddleSpeed" 
						value="slow" 
						checked={settings.paddleSpeed === 240}
						onChange={() => setSettings({...settings, paddleSpeed: 240})}
					/>
					Slow
				</label>
				<label>
					<input 
						type="radio" 
						name="paddleSpeed" 
						value="slow" 
						checked={settings.paddleSpeed === 480}
						onChange={() => setSettings({...settings, paddleSpeed: 480})}
					/>
					Default
				</label>
				<label>
					<input 
						type="radio" 
						name="paddleSpeed" 
						value="slow" 
						checked={settings.paddleSpeed === 720}
						onChange={() => setSettings({...settings, paddleSpeed: 720})}
					/>
					Fast
				</label>
			</div>

			<div className="settings-group">
				<label className="toggle-label">
					<input 
						type="checkbox" 
						checked={settings.endlessMode || false}
						onChange={(e) => setSettings({...settings, endlessMode: e.target.checked})}
					/>
					Endless Mode: <span className={`toggle-value ${settings.endlessMode ? 'toggle-yes' : 'toggle-no'}`}>{settings.endlessMode ? "Yes" : "No"}</span>
				</label>
			</div>
			{!settings.endlessMode ? (
				<div className="settings-group">
					<label>
						Score to win :
						<input 
							type="number" 
							min="1" 
							max="100" 
							value={settings.scoreToWin}
							onChange={(e) => setSettings({...settings, scoreToWin: Number(e.target.value)})}
						/>
					</label>
				</div>
			) : (
				null
			)}
			<button className='btn-game' onClick={() => setSettings({...settings, set: true})}>Validate</button>
		</div>
	);
}

export default GameRules;