import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { getRootCssVariable } from '../domain/style/helpers.ts';

export type AppLayoutChild = 'nav' | 'sidebar';

export type AppLayoutContextValue = {
    /**
     * Returns the maximum available width for the sidebar in pixels.
     */
    getMaxSidebarWidth: () => number | null;
    /*
     * Registers a child element of the AppLayout.
     */
    registerChild: (child: AppLayoutChild, element: HTMLElement | null) => void;
    /*
     * Registers the layout element.
     */
    registerLayout: (element: HTMLElement | null) => void;
};

const AppLayoutContext = createContext<AppLayoutContextValue | null>(null);

export function AppLayoutContextProvider({ children }: PropsWithChildren) {
    const [layoutElement, setLayoutElement] = useState<HTMLElement | null>(null);

    const [refs, setRefs] = useState<Record<AppLayoutChild, HTMLElement | null>>({ nav: null, sidebar: null });

    const getMaxSidebarWidth = useCallback((): number | null => {
        if (!refs.nav || !layoutElement) return null;

        const minPageWidth = parseInt(getRootCssVariable('--page-min-width'));

        return layoutElement.offsetWidth - refs.nav.offsetWidth - minPageWidth;
    }, [layoutElement, refs.nav]);

    const registerChild = useCallback((child: AppLayoutChild, element: HTMLElement | null) => {
        setRefs((prev) => {
            prev[child] = element;
            return prev;
        });
    }, []);

    const registerLayout = useCallback((element: HTMLElement | null) => {
        setLayoutElement(element);
    }, []);

    return <AppLayoutContext.Provider value={{ getMaxSidebarWidth, registerChild, registerLayout }}>{children}</AppLayoutContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppLayout() {
    const context = useContext(AppLayoutContext);
    if (!context) {
        throw new Error('useAppLayout must be used within a AppLayoutContextProvider');
    }
    return context;
}
