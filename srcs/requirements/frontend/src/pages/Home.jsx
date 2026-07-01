import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'
import LanguageSwitcher from '../i18n/LanguageSwitcher'

// Home page — entry point of the app
function Home()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<LanguageSwitcher />
			<h1>{t('home.title')}</h1>
			<br />
			<Link to="/game" className="btn">{t('home.play')}</Link>
			<Link to="/login" className="btn">{t('home.login')}</Link>
			<Link to="/register" className="btn">{t('home.register')}</Link>
			<Link to="/profile" className="btn">{t('home.profile')}</Link>
			<Link to="/tournament" className="btn">{t('home.tournament')}</Link>
			<Link to="/friends" className="btn">{t('home.friends')}</Link>
			<Link to="/settings" className="btn">{t('home.settings')}</Link>
			<Link to="/fetcher" className="btn">{t('home.dev_tools')}</Link>
		</div>
	);
}

export default Home
