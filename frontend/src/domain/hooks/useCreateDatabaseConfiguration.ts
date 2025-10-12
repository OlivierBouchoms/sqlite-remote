import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from './common/QueryKey';
import databaseConfigurationRepository from '../repository/databaseConfigurationRepository.ts';
import { DatabaseConfiguration } from '../model/databaseConfiguration.ts';

export type CreateDatabaseConfigurationArgs = Omit<DatabaseConfiguration, 'id'>;

export const useCreateDatabaseConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation<DatabaseConfiguration, Error, CreateDatabaseConfigurationArgs>({
        mutationFn: (data: CreateDatabaseConfigurationArgs) => {
            const entity: DatabaseConfiguration = {
                ...data,
                id: crypto.randomUUID(),
            };

            databaseConfigurationRepository.add(entity);

            return Promise.resolve(entity);
        },
        onSuccess: (newConfig) => {
            queryClient.setQueryData([QueryKey.DatabaseConfigurations], (old: any[] = []) => [...old, newConfig]);
        },
    });
};
