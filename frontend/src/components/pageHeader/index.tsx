import { Button, Skeleton, Spinner } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import styles from './index.module.css';
import { PropsWithChildren, ReactNode, useCallback } from 'react';

type BasePageHeaderNavigationItem = {
    icon: ReactNode;
    disabled?: boolean;
    alt: string;
};

type PageHeaderNavigationItem =
    | (BasePageHeaderNavigationItem & {
          // links
          url: string;
          onClick?: never;
      })
    | (BasePageHeaderNavigationItem & {
          // buttons
          url?: never;
          onClick: () => void;
      });

type PageHeaderProps = {
    title: string | undefined;
    loading: boolean;
    segmentLoading?: boolean;
    navigation?: PageHeaderNavigationItem[];
};

export const PageHeader = ({ title, loading, segmentLoading, navigation, children }: PropsWithChildren<PageHeaderProps>) => {
    const renderNavigationItem = useCallback((item: PageHeaderNavigationItem) => {
        if (item.url) {
            return (
                <Link to={item.url} key={item.url}>
                    <Button variant='soft' disabled={item.disabled}>
                        {item.icon}
                    </Button>
                </Link>
            );
        }

        return (
            <Button onClick={item.onClick} disabled={item.disabled} key={item.alt} variant='soft'>
                {item.icon}
            </Button>
        );
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.start}>
                {!!navigation && navigation.map((navigationItem) => renderNavigationItem(navigationItem))}
                <Skeleton loading={loading}>
                    <h2 className={styles.title}>{title}</h2>
                </Skeleton>
                {segmentLoading && <Spinner />}
            </div>
            <div className={styles.end}>{children}</div>
        </div>
    );
};
