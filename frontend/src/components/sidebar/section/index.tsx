import { PropsWithChildren } from 'react';
import styles from './index.module.css';
import { SidebarMenuItem } from '../item';
import { SidebarMenuItemConfig, SidebarMenuItemType } from '../../../config/sidebar.tsx';
import { useTranslation } from 'react-i18next';

type Props = {
    items: SidebarMenuItemConfig[];
    activeItem: SidebarMenuItemType | null;
    onItemClick: (type: SidebarMenuItemType) => void;
};

export function SidebarSection({ items, activeItem, onItemClick }: PropsWithChildren<Props>) {
    const { t } = useTranslation();

    return (
        <div style={{ display: 'block' }}>
            <ul className={styles.list}>
                {items.map((item) => (
                    <li key={item.type}>
                        <SidebarMenuItem
                            label={t(item.labelTranslationKey)}
                            type={item.type}
                            icon={item.icon}
                            active={item.type === activeItem}
                            onClick={onItemClick}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
