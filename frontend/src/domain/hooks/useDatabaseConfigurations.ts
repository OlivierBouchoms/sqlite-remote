import { useQuery } from '@tanstack/react-query';
import { QueryKey } from './common/QueryKey.ts';
import databaseConfigurationRepository from '../repository/databaseConfigurationRepository.ts';

export const useDatabaseConfigurations = () => {
    return useQuery({
        queryKey: [QueryKey.DatabaseConfigurations],
        queryFn: () => databaseConfigurationRepository.getAll(),
        select: (data) => data.sort((a, b) => a.label.localeCompare(b.label)),
        enabled: true,
    });
};
