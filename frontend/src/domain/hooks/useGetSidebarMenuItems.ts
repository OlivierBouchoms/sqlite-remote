import { useQuery } from '@tanstack/react-query';
import { QueryKey } from './common/QueryKey.ts';
import { sidebarMenuItems } from '../../config/sidebar.tsx';

type UseGetSidebarMenuItemsOptions = {
    enabled: boolean;
};

export const useGetSidebarMenuItems = ({ enabled }: UseGetSidebarMenuItemsOptions) => {
    return useQuery({
        queryKey: [QueryKey.SidebarMenuItems],
        queryFn: () => [sidebarMenuItems.query_console],
        enabled: enabled,
        initialData: [],
    });
};
