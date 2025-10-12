import { ContextMenu as RadixContextMenu } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

export type ContextMenuItem<TData> = {
    label: string;
    onClick: (item: TData) => void;
    variant: 'default' | 'warning';
    shortcut?: string;
    visible?: (item: TData) => boolean;
    disabled?: (item: TData) => boolean;
};

export type ContextMenuProps<TData> = {
    data: TData;
    items: ContextMenuItem<TData>[];
};

const CONTEXT_MENU_ITEM_COLORS: Record<ContextMenuItem<any>['variant'], RadixContextMenu.ContentProps['color']> = {
    default: undefined,
    warning: 'red',
};

export function ContextMenu<TData>({ items, data, children }: PropsWithChildren<ContextMenuProps<TData>>) {
    return (
        <RadixContextMenu.Root>
            <RadixContextMenu.Trigger>{children}</RadixContextMenu.Trigger>
            <RadixContextMenu.Content>
                {items
                    .filter((item) => !item.visible || item.visible(data))
                    .map((item) => (
                        <RadixContextMenu.Item
                            color={CONTEXT_MENU_ITEM_COLORS[item.variant]}
                            disabled={!item.disabled || item.disabled(data)}
                            key={item.label}
                            onClick={() => item.onClick(data)}
                            shortcut={item.shortcut}
                        >
                            {item.label}
                        </RadixContextMenu.Item>
                    ))}
            </RadixContextMenu.Content>
        </RadixContextMenu.Root>
    );
}
