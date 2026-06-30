import "../../styles/GamePage.css"
import freddyGoat from '../../assets/freddy.png'

function GameHeaderLocal () {

	return (
		<div className="game-header-p2">
			<span className='p-name p2-name'>P2</span>
			<div className="avatar avatar-p2">
				<img src={freddyGoat} alt="Left Player " />
			</div>
		</div>
	)
}

export default GameHeaderLocal;