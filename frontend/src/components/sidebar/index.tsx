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
import { clamp } from '../../domain/math/math.ts';
import { getRootCssVariable } from '../../domain/style/helpers.ts';

type UpdateWidthParams = {
    targetWidth: number;
    sidebarExpanded: boolean;
};

export default function Sidebar() {
    const { registerChildElement, getMaxSidebarWidth } = useAppLayout();

    const rootElement = useRef<HTMLDivElement>();

    const rootElementTargetWidth = useRef<number>(parseInt(getRootCssVariable('--sidebar-initial-width')));
    const rootElementMinWidth = useRef<number>(parseInt(getRootCssVariable('--sidebar-min-width')));

    const [searchParams, setSearchParams] = useSearchParams();

    const { selectedConfig } = useDatabaseConfiguration();

    const { data: menuItems } = useGetSidebarMenuItems({ enabled: !!selectedConfig });

    const sidebarItem = useMemo((): SidebarMenuItemType | null => {
        const param = searchParams.get(nameof<DatabaseOverviewRouteParams>('sidebarItem'));

        return !!param && SidebarMenuItemTypes.includes(param as SidebarMenuItemType) ? (param as SidebarMenuItemType) : null;
    }, [searchParams]);

    const sidebarExpanded = !!sidebarItem;

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

    const updateWidth = useCallback(
        ({ targetWidth, sidebarExpanded }: UpdateWidthParams) => {
            if (!rootElement.current) return;

            const maxWidth = getMaxSidebarWidth();
            const width = maxWidth !== null ? clamp(targetWidth, rootElementMinWidth.current, maxWidth) : Math.max(rootElementMinWidth.current, targetWidth);

            const widthStyleValue = `${width}px`;

            rootElement.current.style.minWidth = sidebarExpanded ? widthStyleValue : 'min-content';
            rootElement.current.style.width = sidebarExpanded ? widthStyleValue : 'min-content';
        },
        [getMaxSidebarWidth]
    );

    useEffect(() => {
        updateWidth({
            targetWidth: rootElementTargetWidth.current,
            sidebarExpanded: sidebarExpanded,
        });
    }, [updateWidth, sidebarExpanded]);

    useEffect(() => {
        if (!rootElement.current || !sidebarExpanded) return; // sidebar can't be resized if it is collapsed

        const interactable = interact(rootElement.current).resizable({
            edges: {
                left: true,
            },
            listeners: {
                move(event) {
                    if (!rootElement.current) return;

                    rootElementTargetWidth.current = event.rect.width;

                    updateWidth({
                        targetWidth: event.rect.width,
                        sidebarExpanded: true, // resizing is only possible when sidebar is expanded
                    });
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
    }, [rootElement, registerChildElement, sidebarExpanded, updateWidth]);

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
            <div className={styles.content} style={{ display: sidebarExpanded ? 'block' : 'none' }}>
                <QueryConsole open={sidebarItem === 'query_console'} />
            </div>
        </div>
    );
}
