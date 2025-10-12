import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AppTheme } from '../config/theme.ts';

type Props = {
    onThemeChange: (theme: AppTheme) => void;
};

export type AppThemeContextValue = {
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeContextProvider({ children, onThemeChange }: PropsWithChildren<Props>) {
    const [theme, setTheme] = useState<AppTheme>((localStorage.getItem('theme') as AppTheme) ?? 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        onThemeChange(theme);
    }, [onThemeChange, theme]);

    return <AppThemeContext.Provider value={{ theme, setTheme }}>{children}</AppThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppTheme() {
    const context = useContext(AppThemeContext);
    if (!context) {
        throw new Error('useAppThemeContext must be used within a AppThemeContextProvider');
    }
    return context;
}
