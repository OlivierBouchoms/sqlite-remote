import styles from './index.module.css';
import { ErrorCallout } from '../../errorCallout';

type QueryConsoleErrorProps = {
    error: unknown; // can be DatabaseErrorResponseDto or other error types
};

export const QueryConsoleError = ({ error }: QueryConsoleErrorProps) => {
    if (!error) return null;

    return (
        <div className={styles.error}>
            <ErrorCallout error={error} />
        </div>
    );
};
