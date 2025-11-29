import { ReactNode } from 'react';
import { FaRegFileLines } from 'react-icons/fa6';

export type SidebarMenuItemType = 'query_console';

export type SidebarMenuItemConfig = {
    labelTranslationKey: string;
    icon: ReactNode;
    type: SidebarMenuItemType;
};

export const sidebarMenuItems: Record<SidebarMenuItemType, SidebarMenuItemConfig> = {
    query_console: {
        labelTranslationKey: 'components.queryConsole.label',
        icon: <FaRegFileLines />,
        type: 'query_console',
    },
};
