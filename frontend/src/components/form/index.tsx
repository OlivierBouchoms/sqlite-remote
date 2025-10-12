import { FormEventHandler, PropsWithChildren } from 'react';
import styles from './index.module.css';

export type FormProps = {
    onSubmit: FormEventHandler<HTMLFormElement>;
};

export const Form = ({ children, onSubmit }: PropsWithChildren<FormProps>) => {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
        </form>
    );
};
