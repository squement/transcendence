import { useState } from "react"
import { postJson } from './Post'
import getAny from './Get'

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
		setResult(await getAny(url));
	} catch (e) {
	  setError(e.message);
	  setResult(null);
	} finally {
	  setLoading(false);
	}
  };

  const upFetch = async () => {
	setLoading(true);
	setError(null);
	setResult(null);
	try {
		if (!result || result.statusCode) throw new Error('No valid data to update');
		let bodyJson = result;
		if (Array.isArray(result)) bodyJson = result.map(user => ({ ...user, update: user.update + 1 }));
		else bodyJson = { ...result, update: result.update + 1 };
		setResult(await postJson('/user', bodyJson));
	} catch (e) {
		setError(e.message);
		setResult(null);
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
		placeholder="Enter a URL, e.g. /user"
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