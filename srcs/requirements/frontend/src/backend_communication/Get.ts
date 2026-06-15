// Give target class '/user' and body, if body is an array url will get /arr
export const getAny = async (myClass: string) => {
	let url = '/backend' + myClass;
  	const res = await fetch(url);
  	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const contentType = res.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) return await res.json();
	return await res.text();
	// await is necessary after this
};