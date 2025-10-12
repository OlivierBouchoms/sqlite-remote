import styles from './index.module.css';
import { Link } from 'react-router-dom';
import { Skeleton } from '@radix-ui/themes';

export type NavigationMenuItemProps<TData> = {
    active: boolean;
    id: string;
    label: string;
    link: string;
    data: TData;
};

export const NavigationMenuItemSkeleton = () => {
    return (
        <Skeleton loading>
            <li className={styles.root}>{'|'}</li>
        </Skeleton>
    );
};

export function NavigationMenuItem<TData>({ active, id, label, link, ...other }: NavigationMenuItemProps<TData>) {
    return (
        <Link to={link} key={id} {...other}>
            <li className={styles.root} data-active={active}>
                {label}
            </li>
        </Link>
    );
}
