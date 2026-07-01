import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { apiFetch } from '../api'
import '../styles/pages.css'
import '../styles/Profile.css'

// Avatar SVG par défaut si rien
const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='35' r='22' fill='%23aaa'/><ellipse cx='50' cy='85' rx='35' ry='25' fill='%23aaa'/></svg>`

// Profile page
// we have to implement auth before this
function Profile() {
	const { t } = useTranslation()
	const fileInputRef = useRef(null)

	const [profile,  setProfile]  = useState(null)
	const [loading,  setLoading]  = useState(true)
	const [error,    setError]    = useState(null)
	const [feedback, setFeedback] = useState(null) // msg success / error
	const [editing,  setEditing]  = useState(false)
	const [form,     setForm]     = useState({ username: '', email: '', password: '' })

	// infos user connected form DB
	useEffect(() => {
		apiFetch('/dbUser/myUser')
			.then(data => {
				setProfile(data)
				setForm({ username: data.username, email: '', password: '' })
			})
			.catch(e => setError(e.message))
			.finally(() => setLoading(false))
	}, [])

	// if update or upload avatar
	const refreshProfile = () =>
		apiFetch('/dbUser/myUser').then(data => {
			setProfile(data)
			setForm(f => ({ ...f, username: data.username }))
		})

	// sennd tobackend (PATCH /dbUser/myUser)
	const handleSave = async () => {
		setFeedback(null)
		const body = {}
		if (form.username && form.username !== profile.username) body.username = form.username
		if (form.email)    body.email    = form.email
		if (form.password) body.password = form.password
		if (!Object.keys(body).length) { setEditing(false); return }

		try {
			await apiFetch('/dbUser/myUser', { method: 'PATCH', body: JSON.stringify(body) })
			await refreshProfile()
			setEditing(false)
			setFeedback({ type: 'success', msg: t('profile.update_success') })
		} catch (e) {
			setFeedback({ type: 'error', msg: t('profile.update_error') })
		}
	}

	// upload avatar multipart
	const handleAvatarUpload = async (e) => {
		const file = e.target.files[0]
		if (!file) return
		const formData = new FormData()
		formData.append('avatar', file)
		try {
			const res = await fetch('/backend/dbUser/myUser/avatar', {
				method: 'POST',
				credentials: 'include',
				body: formData,
			})
			if (!res.ok) throw new Error('Upload failed')
			await refreshProfile()
			setFeedback({ type: 'success', msg: t('profile.update_success') })
		} catch {
			setFeedback({ type: 'error', msg: t('profile.update_error') })
		}
	}

	const winRate = profile && profile.gamesPlayed > 0
		? Math.round((profile.gamesWon / profile.gamesPlayed) * 100)
		: 0

	if (loading) return <div className="page"><p>{t('common.loading')}</p></div>
	if (error)   return <div className="page"><p className="profile-error">{error}</p><Link to="/">{t('common.back')}</Link></div>
	if (!profile) return null

	return (
		<div className="page">
			<Link to="/" className="profile-back">{t('common.back')}</Link>

			<h1>{t('profile.title')}</h1>

			{/* Avatar — clic → open file selector */}
			<div className="profile-avatar-wrapper" onClick={() => fileInputRef.current.click()} title={t('profile.upload_avatar')}>
				<img
					className="profile-avatar-img"
					src={profile.avatarPath ? `/backend${profile.avatarPath}` : DEFAULT_AVATAR}
					alt="avatar"
				/>
				<span className="profile-avatar-overlay">{t('profile.upload_avatar')}</span>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleAvatarUpload}
					style={{ display: 'none' }}
				/>
			</div>

			{/* Feedback success / error */}
			{feedback && (
				<p className={`profile-feedback profile-feedback--${feedback.type}`}>{feedback.msg}</p>
			)}

			{/* Stats */}
			<div className="profile-stats">
				<h2>{t('profile.stats')}</h2>
				<table className="profile-table">
					<tbody>
						<tr><td>{t('profile.username')}</td><td><strong>{profile.username}</strong></td></tr>
						<tr><td>{t('profile.email')}</td><td>{profile.email}</td></tr>
						<tr><td>{t('profile.games_played')}</td><td>{profile.gamesPlayed}</td></tr>
						<tr><td>{t('profile.games_won')}</td><td>{profile.gamesWon}</td></tr>
						<tr><td>{t('profile.win_rate')}</td><td>{winRate}%</td></tr>
						<tr><td>{t('profile.joined')}</td><td>{new Date(profile.createdAt).toLocaleDateString()}</td></tr>
					</tbody>
				</table>
			</div>

			{/* Editing form*/}
			{editing ? (
				<div className="profile-edit">
					<input
						value={form.username}
						onChange={e => setForm({ ...form, username: e.target.value })}
						placeholder={t('profile.new_username')}
					/>
					<input
						type="email"
						value={form.email}
						onChange={e => setForm({ ...form, email: e.target.value })}
						placeholder={t('profile.new_email')}
					/>
					<input
						type="password"
						value={form.password}
						onChange={e => setForm({ ...form, password: e.target.value })}
						placeholder={t('profile.new_password')}
					/>
					<div className="profile-edit-actions">
						<button className="btn-profile btn-save"   onClick={handleSave}>{t('profile.save')}</button>
						<button className="btn-profile btn-cancel" onClick={() => setEditing(false)}>{t('profile.cancel')}</button>
					</div>
				</div>
			) : (
				<button className="btn-profile btn-edit" onClick={() => { setEditing(true); setFeedback(null) }}>
					{t('profile.edit')}
				</button>
			)}
		</div>
	)
}

export default Profile