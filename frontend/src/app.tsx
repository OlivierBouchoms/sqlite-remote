import { useState } from 'react';
import { AppTheme } from './config/theme.ts';
import { AppThemeContextProvider } from './context/appThemeContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import HomePage from './routes/home';
import ErrorPage from './routes/error';
import RootPage from './routes/root.tsx';
import { DatabaseOverviewRoute } from './routes/database';
import { DatabaseTableRoute } from './routes/database/table';
import { OpenAPI } from './generated/api/requests';

OpenAPI.BASE = import.meta.env.VITE_API_URL;
OpenAPI.CREDENTIALS = 'omit';
OpenAPI.HEADERS = {};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 0,
            staleTime: 0,
            /*
              For most queries (involving database schema/data) it is not desired to automatically refetch data.
              This should only be done when the user requests to refresh the data.
              To ensure this is applied properly, we disable data (re)fetching by default.
            */
            enabled: false,
            refetchIntervalInBackground: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            retry: false,
        },
    },
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootPage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/database/:databaseId',
                element: <DatabaseOverviewRoute />,
            },
            {
                path: '/database/:databaseId/table/:tableName',
                element: <DatabaseTableRoute />,
            },
            {
                path: '/database/',
                element: <Navigate to='/' replace />,
            },
            {
                path: '/database/:databaseId/table/',
                element: <Navigate to='/' replace />,
            },
        ],
    },
]);

export function App() {
    const [theme, setTheme] = useState<AppTheme>('light');

    return (
        <QueryClientProvider client={queryClient}>
            <AppThemeContextProvider onThemeChange={setTheme}>
                <Theme accentColor={'blue'} appearance={theme} data-theme={theme}>
                    <RouterProvider router={router} />
                </Theme>
            </AppThemeContextProvider>
        </QueryClientProvider>
    );
}
