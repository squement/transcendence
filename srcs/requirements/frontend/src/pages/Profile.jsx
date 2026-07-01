import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'

// Profile page
// we have to implement auth before this
function Profile()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<h1>{t('profile.title')}</h1>
			<p>{t('profile.placeholder')}</p>
			<Link to="/">{t('common.back')}</Link>
		</div>
	);
}

export default Profile
