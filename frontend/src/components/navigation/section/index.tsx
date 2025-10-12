import { MouseEventHandler, PropsWithChildren, ReactNode, useCallback } from 'react';
import { Button } from '@radix-ui/themes';
import { NavigationMenuItem, NavigationMenuItemProps, NavigationMenuItemSkeleton } from '../item';
import styles from './index.module.css';
import { ContextMenu, ContextMenuProps } from '../../contextMenu';

type Props<TData> = {
    title: string;
    action?: {
        icon: ReactNode;
        onClick: MouseEventHandler<HTMLButtonElement>;
    };
    items: NavigationMenuItemProps<TData>[];
    itemsLoading: boolean;
    hidden?: boolean;
    skeletonCount: number;
    contextMenu?: Pick<ContextMenuProps<TData>, 'items'>;
};

export function NavigationSection<TData>({ title, action, items, itemsLoading, hidden = false, skeletonCount, contextMenu }: PropsWithChildren<Props<TData>>) {
    const renderItem = useCallback(
        (item: NavigationMenuItemProps<TData>) => {
            if (contextMenu) {
                return (
                    <ContextMenu<TData> key={item.id} items={contextMenu.items} data={item.data}>
                        <NavigationMenuItem {...item} />
                    </ContextMenu>
                );
            }

            return <NavigationMenuItem key={item.id} {...item} />;
        },
        [contextMenu]
    );

    return (
        <div style={{ display: hidden ? 'none' : 'block' }}>
            <div className={styles.header}>
                <h3>{title}</h3>
                {!!action && (
                    <Button variant='soft' onClick={action.onClick}>
                        {action.icon}
                    </Button>
                )}
            </div>
            <ul className={styles.list}>
                {itemsLoading && Array.from({ length: skeletonCount }).map((_, i) => <NavigationMenuItemSkeleton key={i} />)}
                {!itemsLoading && items.map((item) => renderItem(item))}
            </ul>
        </div>
    );
}
