import styles from './index.module.css';

type Props = {
    htmlFor: string;
    text: string;
};

export const FormLabel = ({ htmlFor, text }: Props) => (
    <label className={styles.label} htmlFor={htmlFor}>
        {text}
    </label>
);
