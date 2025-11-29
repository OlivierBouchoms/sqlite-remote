import { DatabaseOverviewRouteParams } from '../../pages/databaseOverview';
import { DatabaseTableRouteParams } from '../../pages/databaseTable';
import { nameof } from '../../utils/nameof.ts';
import { Nullable } from '../../utils/nullable.ts';

export const routes = {
    database: {
        index: () => '/database',
        detail: (databaseId: string, params: Nullable<DatabaseOverviewRouteParams> | URLSearchParams): string => {
            const template = `/database/${databaseId}`;

            if (params instanceof URLSearchParams) return `${template}?${params.toString()}`;

            const searchParams = new URLSearchParams();

            if (params.sidebarItem) searchParams.set(nameof<DatabaseOverviewRouteParams>('sidebarItem'), params.sidebarItem);

            return `${template}?${searchParams.toString()}`;
        },
        table: (databaseId: string, table: string, params: Nullable<DatabaseTableRouteParams> | URLSearchParams): string => {
            const template = `/database/${databaseId}/table/${table}`;

            if (params instanceof URLSearchParams) return `${template}?${params.toString()}`;

            const searchParams = new URLSearchParams();

            if (params.segment) searchParams.set(nameof<DatabaseTableRouteParams>('segment'), params.segment);
            if (params.sidebarItem) searchParams.set(nameof<DatabaseTableRouteParams>('sidebarItem'), params.sidebarItem);

            return `${template}?${searchParams.toString()}`;
        },
    },
};
