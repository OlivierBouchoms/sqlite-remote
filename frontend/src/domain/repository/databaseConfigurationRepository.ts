import { DatabaseConfiguration } from '../model/databaseConfiguration.ts';

export class DatabaseConfigurationRepository {
    public read(id: string): DatabaseConfiguration | null {
        const data = localStorage.getItem(this.getKey(id));

        return data ? (JSON.parse(data) as DatabaseConfiguration) : null;
    }

    public getAll(): DatabaseConfiguration[] {
        const items: DatabaseConfiguration[] = [];

        const keys = Object.keys(localStorage);

        for (const key of keys) {
            if (key.startsWith('database-config-')) {
                try {
                    items.push(JSON.parse(localStorage.getItem(key)!) as DatabaseConfiguration);
                } catch (e) {
                    console.warn(`Failed to parse database configuration from localStorage (key: ${key})`, e);
                }
            }
        }

        return items;
    }

    public add(config: DatabaseConfiguration) {
        localStorage.setItem(this.getKey(config.id), JSON.stringify(config));
    }

    private getKey(id: string) {
        return 'database-config-' + id;
    }
}

export default new DatabaseConfigurationRepository();
