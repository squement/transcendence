import { useState } from "react"

function Fetcher() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  //const [postBody, setPostBody] = useState('');  // user types JSON as text
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const doFetch = async () => {
	setLoading(true);
	setError(null);
	setResult(null);
	try {
	  const res = await fetch(url);
	  // Try JSON first, fall back to plain text
	  const contentType = res.headers.get('content-type');
	  if (contentType && contentType.includes('application/json')) {
		setResult(await res.json());
	  } else {
		setResult(await res.text());
	  }
	} catch (e) {
	  setError(e.message);
	} finally {
	  setLoading(false);
	}
  };

  const upFetch = async () => {
	setLoading(true);
	setError(null);
	setResult(null);
	try {
	let upUrl = '/backend/user/update/one';
	let bodyJson = result;
	if (Array.isArray(result)) {
		upUrl = '/backend/user/update'
		bodyJson = result.map(user => ({ ...user, update: user.update + 1 }));
	}
	else bodyJson = { ...result, update: result.update + 1 };
	const res = await fetch(upUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bodyJson),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	setResult(await res.json());
	//setPostBody(result);
	} catch (e) {
		setError(e.message);
	} finally {
		setLoading(false);
	}
};

  return (
	<div>
	  <input
		type="text"
		value={url}
		onChange={e => setUrl(e.target.value)}
		placeholder="Enter a URL, e.g. /backend/user"
		style={{ width: '400px' }}
	  />
	  <button onClick={doFetch} disabled={!url || loading}>
		{loading ? 'Fetching...' : 'Fetch'}
	  </button>
	  <button onClick={upFetch}>
		{loading ? 'Updating...' : 'Update'}
	  </button>

	  {error && <p style={{ color: 'red' }}>Error: {error}</p>}

	  {result !== null && (
		<pre>{typeof result === 'object' ? JSON.stringify(result, null, 2) : result}</pre>
	  )}
	</div>
  );
}

export default Fetcher