import { useQuery } from '@tanstack/react-query';
import { QueryKey } from './common/QueryKey.ts';
import databaseConfigurationRepository from '../repository/databaseConfigurationRepository.ts';

export const useGetDatabaseConfiguration = (id: string | undefined) => {
    return useQuery({
        queryKey: [QueryKey.DatabaseConfigurations, id],
        queryFn: () => databaseConfigurationRepository.read(id!),
        enabled: !!id,
    });
};
