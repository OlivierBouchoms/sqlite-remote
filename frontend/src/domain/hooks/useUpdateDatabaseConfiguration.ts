import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from './common/QueryKey';
import databaseConfigurationRepository from '../repository/databaseConfigurationRepository.ts';
import { DatabaseConfiguration } from '../model/databaseConfiguration.ts';

export type UpdateDatabaseConfigurationArgs = DatabaseConfiguration;

export const useUpdateDatabaseConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation<DatabaseConfiguration, Error, UpdateDatabaseConfigurationArgs>({
        mutationFn: (data: DatabaseConfiguration) => {
            databaseConfigurationRepository.update(data);

            return Promise.resolve(data);
        },
        onSuccess: (newConfig) => {
            queryClient.setQueryData([QueryKey.DatabaseConfigurations], (old: DatabaseConfiguration[] = []) => {
                const index = old.findIndex((c) => c.id === newConfig.id);

                if (index === -1) {
                    return [...old, newConfig];
                }

                const next = old.slice();

                next[index] = newConfig;
                
                return next;
            });
        },
    });
};
