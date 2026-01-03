import { ServerQueryResponseDto } from '../../../generated/api/requests';
import styles from './index.module.css';
import { Table, TableColumn } from '../../table';
import { Spinner } from '@radix-ui/themes';
import { Callout } from '../../callout';
import { useCallback } from 'react';

type QueryConsoleResultsProps = {
    data: ServerQueryResponseDto | undefined;
    emptyStateLabel: string;
    loading: boolean;
};

export const QueryConsoleResults = ({ data, emptyStateLabel, loading }: QueryConsoleResultsProps) => {
    const getColumns = useCallback((resultSet: { [key: string]: unknown }[]): TableColumn[] => {
        return Object.keys(resultSet[0]).map((key) => ({
            name: key,
            type: 'TEXT',
            primaryKey: false,
            required: false,
            selector: (row) => row[key],
        }));
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Spinner className={styles.loadingStateSpinner} />
            </div>
        );
    }

    if (!data) return;

    const resultSetsWithData = data.resultSets.filter((rs) => rs.length > 0);

    if (resultSetsWithData.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Callout type='info' title={emptyStateLabel} />
            </div>
        );
    }

    return (
        <div className={styles.results}>
            {resultSetsWithData.map((resultSet, index) => {
                return (
                    <div key={index} className={styles.resultSet}>
                        <Table data={Object.values(resultSet)} columns={getColumns(resultSet)} theme={{ borderRadius: '0' }} />
                    </div>
                );
            })}
        </div>
    );
};
