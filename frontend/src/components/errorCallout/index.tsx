import { useMemo } from 'react';
import { Callout } from '../callout';
import { DatabaseErrorResponseDto } from '../../generated/api/requests';
import { useTranslation } from 'react-i18next';

type ErrorCalloutProps = {
    error: unknown;
};

export const ErrorCallout = ({ error }: ErrorCalloutProps) => {
    const { t } = useTranslation();

    const content = useMemo(() => {
        // @ts-expect-error - check is safe
        if ('body' in error) {
            const details = error.body as DatabaseErrorResponseDto;

            return {
                title: t('components.errorCallout.problemDetails.title', { title: details.title, status: details.status }),
                description: t(`domain.api.databaseOperationError.${details.detail!}`),
            };
        }

        return {
            title:
                // @ts-expect-error - check is safe
                ('statusText' in error && (error.statusText as string)) ||
                // @ts-expect-error - check is safe
                ('message' in error && (error.message as string)) ||
                t('components.errorCallout.fallback.title'),
        };
    }, [error, t]);

    return <Callout type='error' title={content.title} description={content.description} />;
};
