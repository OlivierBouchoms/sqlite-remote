import styles from './index.module.css';
import { Button } from '@radix-ui/themes';
import { ReactNode } from 'react';
import { SidebarMenuItemType } from '../../../config/sidebar.tsx';

export type SidebarMenuItemProps = {
    label: string;
    type: SidebarMenuItemType;
    icon: ReactNode;
    active: boolean;
    onClick: (type: SidebarMenuItemType) => void;
};

export function SidebarMenuItem({ active, label, icon, onClick, type }: SidebarMenuItemProps) {
    return (
        <Button className={styles.root} onClick={() => onClick(type)} aria-label={label} variant={active ? 'solid' : 'soft'} title={label} size='2'>
            {icon}
        </Button>
    );
}
