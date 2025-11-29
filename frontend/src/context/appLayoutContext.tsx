import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { getRootCssVariable } from '../domain/style/helpers.ts';

export type AppLayoutChildElement = 'nav' | 'sidebar';

export type AppLayoutContextValue = {
    /**
     * Returns the maximum available width for the sidebar in pixels.
     */
    getMaxSidebarWidth: () => number | null;
    /*
     * Registers a child element of the AppLayout.
     */
    registerChildElement: (child: AppLayoutChildElement, element: HTMLElement | null) => void;
    /*
     * Registers the main layout element.
     */
    registerLayoutElement: (element: HTMLElement | null) => void;
};

const AppLayoutContext = createContext<AppLayoutContextValue | null>(null);

export function AppLayoutContextProvider({ children }: PropsWithChildren) {
    const [layoutElement, setLayoutElement] = useState<HTMLElement | null>(null);

    const [childElements, setChildElements] = useState<Record<AppLayoutChildElement, HTMLElement | null>>({ nav: null, sidebar: null });

    const getMaxSidebarWidth = useCallback((): number | null => {
        if (!childElements.nav || !layoutElement) return null;

        const minPageWidth = parseInt(getRootCssVariable('--page-min-width'));

        return layoutElement.offsetWidth - childElements.nav.offsetWidth - minPageWidth;
    }, [layoutElement, childElements.nav]);

    const registerChildElement = useCallback((child: AppLayoutChildElement, element: HTMLElement | null) => {
        setChildElements((prev) => {
            prev[child] = element;
            return prev;
        });
    }, []);

    const registerLayoutElement = useCallback((element: HTMLElement | null) => {
        setLayoutElement(element);
    }, []);

    return <AppLayoutContext.Provider value={{ getMaxSidebarWidth, registerChildElement, registerLayoutElement }}>{children}</AppLayoutContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppLayout() {
    const context = useContext(AppLayoutContext);
    if (!context) {
        throw new Error('useAppLayout must be used within a AppLayoutContextProvider');
    }
    return context;
}
