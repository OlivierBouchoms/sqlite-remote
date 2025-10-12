import { Button, Dialog, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form } from '../../components/form';
import { FormGroup } from '../../components/form/group';
import { FormActions } from '../../components/form/actions';
import { useCreateDatabaseConfiguration } from '../../domain/hooks/useCreateDatabaseConfiguration.ts';
import { useEffect } from 'react';
import { DatabaseConnectionTest } from '../../components/databaseConnectionTest';
import { FormLabel } from '../../components/form/label';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type FormValues = {
    label: string;
    dbPath: string;
    hostName: string;
};

export const AddDatabaseConfiguration = ({ open, onOpenChange }: Props) => {
    const {
        handleSubmit,
        register,
        formState: { isValid, isSubmitting },
        reset,
        watch,
    } = useForm<FormValues>({
        defaultValues: {},
        mode: 'all',
        reValidateMode: 'onBlur',
    });

    const { mutateAsync: createDatabaseConfiguration } = useCreateDatabaseConfiguration();

    const onSubmit = async (values: FormValues) =>
        await createDatabaseConfiguration({
            label: values.label,
            ssh: {
                hostName: values.hostName,
            },
            dbPath: values.dbPath,
        }).then(() => onOpenChange(false));

    const { t } = useTranslation(undefined, { keyPrefix: 'features.addDatabaseConfiguration' });

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content>
                <Dialog.Title>{t('dialog.title')}</Dialog.Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormLabel htmlFor='label' text={t('form.label.label')} />
                        <TextField.Root
                            autoFocus
                            placeholder={t('form.label.placeholder')}
                            type='text'
                            {...register('label', {
                                required: true,
                            })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor='hostName' text={t('form.remoteHost.label')} />
                        <TextField.Root
                            placeholder={t('form.remoteHost.placeholder')}
                            type='text'
                            {...register('hostName', {
                                required: true,
                            })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor='dbPath' text={t('form.dbPath.label')} />
                        <TextField.Root
                            placeholder={t('form.dbPath.placeholder')}
                            type='text'
                            {...register('dbPath', {
                                required: true,
                            })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <DatabaseConnectionTest form={{ fieldNames: { hostName: 'hostName', dbPath: 'dbPath' }, isValid: isValid, watch: watch }} />
                    </FormGroup>

                    <FormActions>
                        <Button variant='outline' onClick={() => onOpenChange(false)} type='button'>
                            {t('form.actions.cancel')}
                        </Button>
                        <Button disabled={!isValid || isSubmitting} loading={isSubmitting} type='submit'>
                            {t('form.actions.submit')}
                        </Button>
                    </FormActions>
                </Form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
