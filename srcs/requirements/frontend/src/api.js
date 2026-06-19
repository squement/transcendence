const API = 'http://localhost:3000';

export async function apiFetch(path, options = {}) {
	const res = await fetch(`${API}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}