import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'

// Settings page. Update :
// -> username
// -> avatar
// -> theme
// etc
function Settings()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<h1>{t('settings.title')}</h1>
			<p>{t('settings.placeholder')}</p>
			<Link to="/">{t('common.back')}</Link>
		</div>
	);
}

export default Settings