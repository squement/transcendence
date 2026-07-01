import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'

function Tournament()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<h1>{t('tournament.title')}</h1>
			<p>{t('tournament.placeholder')}</p>
			<Link to="/">{t('common.back')}</Link>
		</div>
	);
}

export default Tournament