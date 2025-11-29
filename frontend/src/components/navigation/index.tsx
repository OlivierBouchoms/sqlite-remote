import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routes } from '../../domain/urls/routes.ts';
import { useDatabaseConfigurations } from '../../domain/hooks/useDatabaseConfigurations.ts';
import { AddDatabaseConfiguration } from '../../features/addDatabaseConfiguration';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { NavigationMenuItemProps } from './item';
import { NavigationSection } from './section';
import { useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { DatabaseConfiguration } from '../../domain/model/databaseConfiguration.ts';
import { DatabaseTable } from '../../domain/types/databaseTable.ts';
import { useTableServiceGetApiTableByNameData, useTableServiceGetApiTableByNameSchema } from '../../generated/api/queries';
import { QueryKey } from '../../domain/hooks/common/QueryKey.ts';
import { useAppLayout } from '../../context/appLayoutContext.tsx';
import { DatabaseTablePageSegment, DatabaseTableRouteParams } from '../../pages/databaseTable';
import { SidebarMenuItemType } from '../../config/sidebar.tsx';
import { nameof } from '../../utils/nameof.ts';
import { DatabaseOverviewRouteParams } from '../../pages/databaseOverview';

export default function NavigationMenu() {
    const { registerChildElement } = useAppLayout();

    const [searchParams, setSearchParams] = useSearchParams();

    const { data: databases, isLoading: isDatabasesLoading } = useDatabaseConfigurations();

    const { selectedConfig, tables, isTablesLoading, selectedTable } = useDatabaseConfiguration();

    const { refetch: refetchTableData } = useTableServiceGetApiTableByNameData(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableData, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const { refetch: refetchTableSchema } = useTableServiceGetApiTableByNameSchema(
        {
            name: selectedTable?.name ?? '',
            sshHost: selectedConfig?.ssh.hostName,
            dbPath: selectedConfig?.dbPath,
        },
        [QueryKey.DatabaseTableSchema, selectedConfig?.ssh.hostName, selectedConfig?.dbPath, selectedTable]
    );

    const { t } = useTranslation();

    const navigate = useNavigate();

    const addDatabaseConfigurationOpen = searchParams.get('addDataSource') === 'true';

    const setAddDatabaseConfigurationOpen = (open: boolean) => {
        setSearchParams((p) => {
            p.set('addDataSource', open ? 'true' : 'false');
            return p;
        });
    };

    const databaseSectionItems = useMemo((): NavigationMenuItemProps<DatabaseConfiguration>[] => {
        if (!databases) return [];

        return databases.map((db) => {
            // preserve the params if we navigate to the same database (e.g. to remove focus from a table)
            const params = selectedConfig?.id == db.id ? searchParams : {};

            return {
                active: !!selectedConfig && db.id === selectedConfig.id,
                id: db.id,
                label: db.label,
                link: routes.database.detail(db.id, params),
                data: db,
            };
        });
    }, [databases, selectedConfig, searchParams]);

    const tableSectionItems = useMemo((): NavigationMenuItemProps<DatabaseTable>[] => {
        if (!tables) return [];

        return tables.map((table) => ({
            active: !!selectedTable && table.name === selectedTable.name,
            id: table.name,
            label: table.name,
            link: routes.database.table(selectedConfig?.id ?? '', table.name, {
                segment: searchParams.get(nameof<DatabaseTableRouteParams>('segment')) as DatabaseTablePageSegment,
                sidebarItem: searchParams.get(nameof<DatabaseOverviewRouteParams>('sidebarItem')) as SidebarMenuItemType,
            }),
            data: table,
        }));
    }, [selectedConfig, selectedTable, tables, searchParams]);

    return (
        <nav className={styles.nav} ref={(e) => registerChildElement('nav', e)}>
            <div className={styles.title}>
                <img alt={t('domain.app.titleLogo')} height='47.5px' width='38px' src='/logo.svg' />
                <h1>{t('domain.app.title')}</h1>
            </div>
            <NavigationSection<DatabaseConfiguration>
                title={t('nav.databases.title')}
                action={{
                    onClick: () => setAddDatabaseConfigurationOpen(true),
                    icon: <FaPlus />,
                }}
                items={databaseSectionItems}
                itemsLoading={isDatabasesLoading}
                skeletonCount={4}
                contextMenu={{
                    items: [
                        {
                            label: t('nav.databases.contextMenu.open'),
                            onClick: (item) => {
                                navigate(routes.database.detail(item.id, {}));
                            },
                            variant: 'default',
                            disabled: (item) => item.id === selectedConfig?.id,
                        },
                    ],
                }}
            />
            <NavigationSection<DatabaseTable>
                title={t('nav.tables.title')}
                items={tableSectionItems}
                itemsLoading={isTablesLoading}
                hidden={!selectedConfig}
                skeletonCount={8}
                contextMenu={{
                    items: [
                        {
                            label: t('nav.tables.contextMenu.open'),
                            onClick: (item) =>
                                !!selectedConfig &&
                                navigate(
                                    routes.database.table(selectedConfig.id, item.name, {
                                        sidebarItem: searchParams.get(nameof<DatabaseTableRouteParams>('sidebarItem')) as SidebarMenuItemType,
                                    })
                                ),
                            variant: 'default',
                            disabled: (item) => item.name === selectedTable?.name,
                        },
                        {
                            label: t('nav.tables.contextMenu.refresh'),
                            onClick: async () => await Promise.all([refetchTableData(), refetchTableSchema()]),
                            variant: 'default',
                            disabled: (item) => item.name !== selectedTable?.name,
                        },
                    ],
                }}
            />

            <AddDatabaseConfiguration open={addDatabaseConfigurationOpen} onOpenChange={setAddDatabaseConfigurationOpen} />
        </nav>
    );
}
