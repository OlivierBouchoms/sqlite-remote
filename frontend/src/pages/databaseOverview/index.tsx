import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { Skeleton } from '@radix-ui/themes';
import { DatabaseConnectionStatus } from '../../components/databaseConnectionStatus';
import { Page } from '../../components/page';
import { PageHeader } from '../../components/pageHeader';
import { SidebarMenuItemType } from '../../config/sidebar.tsx';

export type DatabaseOverviewRouteParams = {
    sidebarItem?: SidebarMenuItemType;
};

export const DatabaseOverviewPage = () => {
    const { selectedConfig, isConfigLoading } = useDatabaseConfiguration();

    return (
        <Page>
            <PageHeader title={selectedConfig?.label} loading={isConfigLoading}>
                <Skeleton loading={isConfigLoading}>
                    <DatabaseConnectionStatus />
                </Skeleton>
            </PageHeader>
        </Page>
    );
};
