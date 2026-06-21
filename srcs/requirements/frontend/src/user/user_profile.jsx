import { useState, useEffect } from "react"
import Get from '/src/backend_communication/Get'
import Post from '/src/backend_communication/Post'
import { useAuth } from '../AuthContext';

function displayProfile() {
	const [result,	setResult]	= useState(null);
	const [error,	setError]	= useState(null);
	const [loading,	setLoading]	= useState(false);
	const [name,	setName]	= useState('Unknown');
	const { user } = useAuth();

	useEffect(() => {
	setLoading(true);
	setError(null);
	setResult(null);
	setName('Unknown');
	const load = async () => {
		try {
			const data = await Get(`/user/find/${ user.id }`);// default for now
			setResult(data);
			setName(data.username);
		} catch (e) {
			setError(e.message);
			setResult(null);
		} finally {
			setLoading(false);
		}
	};
	load();
	}, []);
  return (
	<div>
		<h1>Profile: {name}</h1>
		<img src={`/backend/user/img`} alt="avatar" 
		style={{ 
			border: "1px solid black",
			aspectRatio: "1 / 1",
			width: "20%",
			borderRadius: "50%",
			objectFit: "cover",
			boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
		}}
		/>
	  {error && <p style={{ color: 'red' }}>Error: {error}</p>}
	  {result !== null && (
		<pre>{typeof result === 'object' ? JSON.stringify(result, null, 2) : result}</pre>
	  )}
	</div>
  )
}

export default displayProfile