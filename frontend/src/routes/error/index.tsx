import { Link, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';
import { Button } from '@radix-ui/themes';

export default function ErrorPage() {
    const { t } = useTranslation(undefined, { keyPrefix: 'pages.error' });

    const error = useRouteError();

    return (
        <div className={styles.error}>
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>
            <code>
                {/* @ts-expect-error the existence of the statusText and message property is checked */}
                {('statusText' in error && error.statusText) || ('message' in error && error.message)}
            </code>
            <Link to='/'>
                <Button>{t('cta')}</Button>
            </Link>
        </div>
    );
}
