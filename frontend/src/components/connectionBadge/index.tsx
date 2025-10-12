import { Badge, Spinner } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { DatabaseErrorResponseDto } from '../../generated/api/requests';

export type ConnectionBadgeCopy = {
    success: string;
    failure: string;
    connecting: string;
};

export type ConnectionBadgeProps = {
    isConnected: boolean;
    isFetching: boolean;
    error: { body?: DatabaseErrorResponseDto } | null;
    displayRealtimeFeedback?: boolean;
    copy?: ConnectionBadgeCopy;
};

export const ConnectionBadge = ({ isConnected, isFetching, error, displayRealtimeFeedback = true }: ConnectionBadgeProps) => {
    const { t } = useTranslation(undefined, { keyPrefix: 'components.connectionBadge' });
    const showLoadingState = isFetching && displayRealtimeFeedback;

    const badgeNode = useMemo(() => {
        if (!showLoadingState && isConnected) {
            return (
                <Badge color='green' size='3'>
                    <FaCheckCircle />
                    {t('success')}
                </Badge>
            );
        }
        if (!showLoadingState && !!error) {
            return (
                <Badge color='red' variant='outline' size='3'>
                    <FaExclamationCircle />
                    {t('failure')}
                </Badge>
            );
        }
        if (isFetching) {
            return (
                <Badge color='blue' size='3'>
                    <Spinner loading />
                    {t('connecting')}
                </Badge>
            );
        }
        return null;
    }, [showLoadingState, isConnected, error, isFetching, t]);

    if (!badgeNode) return null;

    return <div>{badgeNode}</div>;
};
