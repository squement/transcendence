import "../../styles/GamePage.css"
import freddyGoat from '../../assets/freddy.png'

function GameHeaderSoloBot () {

	return (
		<div className="game-header-p2">
			<span className='p-name p2-name'>PPPB</span>
			<div className="avatar avatar-p2">
				<img src={freddyGoat} alt="PPPB " />
			</div>
		</div>
	)
}

export default GameHeaderSoloBot;