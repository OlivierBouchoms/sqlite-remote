import { PropsWithChildren } from 'react';
import styles from './index.module.css';

export const Page = ({ children }: PropsWithChildren) => {
    return <div className={styles.page}>{children}</div>;
};
