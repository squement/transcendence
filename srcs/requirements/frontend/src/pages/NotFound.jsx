import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'

function NotFound()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<h1>{t('errors.not_found_title')}</h1>
			<p>{t('errors.not_found_message')}</p>
			<Link to="/">{t('errors.back_home')}</Link>
		</div>
	);
}

export default NotFound