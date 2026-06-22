import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "./api";
import getAny from './backend_communication/Get'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch('/auth/me')
		.then(setUser)
		.catch(() => setUser(null))
		.finally(() => setLoading(false));
	}, []);

	const login = async (username) => {
		try {
		const res = await getAny(`/user/add/${ username }`);
		console.log('getAny result:', res);
		await apiFetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: res.id,
			}),
			// body: JSON.stringify({ username }),
		});
		const profile = await apiFetch('/auth/me');
		setUser(profile);
		} catch (e) {
			console.log('login error:', e.message);
		}
	};

	const logout = async () => {
		await apiFetch('/auth/logout', { method: 'POST' });
		setUser(null);
	};
	
	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used in an AuthProvider');
	return ctx;
};