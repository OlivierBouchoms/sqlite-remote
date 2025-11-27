export const routes = {
    database: {
        index: () => '/database',
        detail: (databaseId: string): string => `/database/${databaseId}`,
        table: (databaseId: string, table: string, searchParams: URLSearchParams): string =>
            `/database/${databaseId}/table/${table}?${searchParams.toString()}`,
    },
};
