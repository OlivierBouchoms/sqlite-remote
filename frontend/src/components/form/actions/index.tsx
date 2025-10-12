import { PropsWithChildren } from 'react';
import styles from './index.module.css';

export const FormActions = ({ children }: PropsWithChildren) => {
    return <div className={styles.actions}>{children}</div>;
};
