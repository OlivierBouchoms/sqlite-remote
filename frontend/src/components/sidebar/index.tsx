import styles from './index.module.css';
import { useSearchParams } from 'react-router-dom';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { SidebarSection } from './section';
import { SidebarMenuItemTypes } from './item/constants';
import { QueryConsole } from '../queryConsole';
import { SidebarMenuItemType } from '../../config/sidebar.tsx';
import { useGetSidebarMenuItems } from '../../domain/hooks/useGetSidebarMenuItems.ts';
import interact from 'interactjs';
import { useAppLayout } from '../../context/appLayoutContext.tsx';
import { nameof } from '../../utils/nameof.ts';
import { DatabaseOverviewRouteParams } from '../../pages/databaseOverview';

export default function Sidebar() {
    const { registerChildElement, getMaxSidebarWidth } = useAppLayout();

    const rootElement = useRef<HTMLDivElement>();

    const rootElementInitialWidth = useRef<number>();
    const rootElementTargetWidth = useRef<number>();

    const isExpanded = useRef<boolean>(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const { selectedConfig } = useDatabaseConfiguration();

    const { data: menuItems } = useGetSidebarMenuItems({ enabled: !!selectedConfig });

    const sidebarItem = useMemo((): SidebarMenuItemType | null => {
        const param = searchParams.get(nameof<DatabaseOverviewRouteParams>('sidebarItem'));

        return !!param && SidebarMenuItemTypes.includes(param as SidebarMenuItemType) ? (param as SidebarMenuItemType) : null;
    }, [searchParams]);

    const setItem = useCallback(
        (type: SidebarMenuItemType) => {
            setSearchParams((p) => {
                const oldItem = p.get(nameof<DatabaseOverviewRouteParams>('sidebarItem'));

                if (oldItem === type) {
                    p.delete(nameof<DatabaseOverviewRouteParams>('sidebarItem'));
                } else {
                    p.set(nameof<DatabaseOverviewRouteParams>('sidebarItem'), type);
                }
                return p;
            });
        },
        [setSearchParams]
    );

    const updateWidth = useCallback(() => {
        if (!rootElement.current || !rootElementInitialWidth.current || !rootElementTargetWidth.current) return;

        const calculatedWidth = Math.max(rootElementInitialWidth.current, rootElementTargetWidth.current);
        const maxWidth = getMaxSidebarWidth();

        const widthStyleValue = maxWidth !== null ? `${Math.min(calculatedWidth, maxWidth)}px` : `${calculatedWidth}px`;

        rootElement.current.style.minWidth = isExpanded.current ? widthStyleValue : 'min-content';
        rootElement.current.style.width = isExpanded.current ? widthStyleValue : '';
    }, [getMaxSidebarWidth]);

    useEffect(() => {
        if (!rootElement.current) return;

        rootElementInitialWidth.current = rootElement.current.offsetWidth;
        isExpanded.current = !!sidebarItem;

        updateWidth();
    }, [rootElement, menuItems, sidebarItem, updateWidth]);

    useEffect(() => {
        if (!rootElement.current || !sidebarItem) return;

        const interactable = interact(rootElement.current).resizable({
            edges: {
                left: true,
            },
            listeners: {
                move(event) {
                    if (!rootElement.current) return;

                    rootElementTargetWidth.current = event.rect.width;

                    updateWidth();
                },
            },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                }),
            ],
            invert: 'none',
        });

        return () => interactable.unset();
    }, [rootElement, registerChildElement, sidebarItem, updateWidth]);

    return (
        <div
            className={styles.sidebar}
            ref={(e) => {
                rootElement.current = e!;
                registerChildElement('sidebar', e);
            }}
        >
            <section className={styles.menu}>
                <SidebarSection activeItem={sidebarItem} items={menuItems} onItemClick={setItem} />
            </section>
            <div className={styles.content} style={{ display: sidebarItem ? 'block' : 'none' }}>
                <QueryConsole open={sidebarItem === 'query_console'} />
            </div>
        </div>
    );
}
