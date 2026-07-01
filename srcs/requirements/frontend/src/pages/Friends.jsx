import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/pages.css'

// Friends page —> friend list + online status ?
function Friends()
{
	const { t } = useTranslation();

	return (
		<div className="page">
			<h1>{t('friends.title')}</h1>
			<p>{t('friends.placeholder')}</p>
			<Link to="/">{t('common.back')}</Link>
		</div>
	);
}

export default Friends
