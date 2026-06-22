import { Link } from 'react-router-dom'
import Fetcher from '../backend_communication/Fetcher.jsx'
import Message from '../Message.jsx'
import '../styles/pages.css'

// FetcherPage —> dev tool :
//  testing backend GET/POST requests
function FetcherPage()
{
	return (
		<div className="page">
			<h1>Dev Tools</h1>
			<Message />
			<Fetcher />
			<br />
			<Link to="/">← Back</Link>
		</div>
	);
}

export default FetcherPage
