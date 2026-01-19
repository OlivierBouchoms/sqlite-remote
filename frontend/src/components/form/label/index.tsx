import { useTranslation } from 'react-i18next';
import { Popover } from '../../popover';
import { FaQuestionCircle } from 'react-icons/fa';
import styles from './index.module.css';

type Props = {
    htmlFor: string;
    text: string;
    description?: string;
    required?: boolean;
};

export const FormLabel = ({ htmlFor, text, description, required = false }: Props) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'components.formLabel' });

    return (
        <div className={styles.root}>
            <label className={styles.label} htmlFor={htmlFor}>
                {required ? t('required', { label: text }) : t('optional', { label: text })}
            </label>
            {!!description && <Popover trigger={<FaQuestionCircle />}>{<p className={styles.description}>{description}</p>}</Popover>}
        </div>
    );
};
