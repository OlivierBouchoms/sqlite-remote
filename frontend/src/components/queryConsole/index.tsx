import { useTranslation } from 'react-i18next';

type Props = {
    open: boolean;
};

export const QueryConsole = ({ open }: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'components.queryConsole' });

    return <div style={{ display: open ? 'block' : 'none', height: '200vh', padding: 'var(--space-2)' }}>{t('label')}</div>;
};
