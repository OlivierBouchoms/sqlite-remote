import { PropsWithChildren } from 'react';
import styles from './index.module.css';

export type FormGroupProps = {
    className?: string;
};

export const FormGroup = ({ children, className }: PropsWithChildren<FormGroupProps>) => {
    return <div className={`${styles.formGroup} ${className ?? ''}`}>{children}</div>;
};
