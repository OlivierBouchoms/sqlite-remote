import { PropsWithChildren } from 'react';
import styles from './index.module.css';

export const PageContent = ({ children }: PropsWithChildren) => <div className={styles.pageContent} children={children} />;
