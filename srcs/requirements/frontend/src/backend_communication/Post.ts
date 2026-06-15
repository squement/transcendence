
// Give target class '/user' and body, if body is an array url will get /arr
export const postJson = async (myClass: string, body: object) => {
	const isJson = typeof body === 'object' && body !== null;
	if (!isJson) throw new Error('Body must be a JSON object or array');
	let url = '/backend' + myClass;
	if (Array.isArray(body)) url += '/arr'
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const contentType = res.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) return await res.json();
	return await res.text();
	// await is necessary after this
};

export const postAny = async (myClass:string, body: any) => {
	return await postJson(myClass, body);
};