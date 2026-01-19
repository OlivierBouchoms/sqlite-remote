import { Button, Dialog, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form } from '../../components/form';
import { FormGroup } from '../../components/form/group';
import { FormActions } from '../../components/form/actions';
import { useCreateDatabaseConfiguration } from '../../domain/hooks/useCreateDatabaseConfiguration.ts';
import { useEffect, useState } from 'react';
import { DatabaseConnectionTest } from '../../components/databaseConnectionTest';
import { FormLabel } from '../../components/form/label';
import { Callout } from '../../components/callout';
import { FormSection } from '../../components/form/section';
import { sshConfigurationConstants } from '../../domain/constants/sshConfiguration.ts';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type FormValues = {
    label: string;
    dbPath: string;
    hostName: string;
    port?: number;
    username?: string;
    identityFilePath?: string;
};

export const AddDatabaseConfiguration = ({ open, onOpenChange }: Props) => {
    const [advancedSectionOpen, setAdvancedSectionOpen] = useState<boolean>(false);

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
                username: values.username,
                port: values.port ? parseInt(values.port as unknown as string) : undefined,
                identityFilePath: values.identityFilePath,
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
                    <FormSection>
                        <FormGroup>
                            <FormLabel htmlFor='label' text={t('form.label.label')} required />
                            <TextField.Root
                                autoFocus
                                placeholder={t('form.label.placeholder')}
                                required
                                type='text'
                                {...register('label', {
                                    required: true,
                                })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor='hostName' text={t('form.remoteHost.label')} description={t('form.remoteHost.description')} required />
                            <TextField.Root
                                placeholder={t('form.remoteHost.placeholder')}
                                type='text'
                                {...register('hostName', {
                                    required: true,
                                })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor='dbPath' text={t('form.dbPath.label')} description={t('form.dbPath.description')} required />
                            <TextField.Root
                                placeholder={t('form.dbPath.placeholder')}
                                type='text'
                                {...register('dbPath', {
                                    required: true,
                                })}
                            />
                        </FormGroup>
                    </FormSection>
                    <FormSection title={t('dialog.advancedSection.title')} open={advancedSectionOpen} onOpenChange={setAdvancedSectionOpen} collapsible>
                        <Callout type='info' variant='surface' title={t('dialog.advancedSection.description')} />
                        <FormGroup>
                            <FormLabel htmlFor='port' text={t('form.port.label')} description={t('form.port.description')} />
                            <TextField.Root
                                placeholder={t('form.port.placeholder')}
                                type='text'
                                {...register('port', {
                                    required: false,
                                    min: sshConfigurationConstants.port.min,
                                    max: sshConfigurationConstants.port.max,
                                })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor='username' text={t('form.username.label')} description={t('form.username.description')} />
                            <TextField.Root
                                placeholder={t('form.username.placeholder')}
                                type='text'
                                {...register('username', {
                                    required: false,
                                })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel
                                htmlFor='identityFilePath'
                                text={t('form.identityFilePath.label')}
                                description={t('form.identityFilePath.description')}
                            />
                            <TextField.Root
                                placeholder={t('form.identityFilePath.placeholder')}
                                type='text'
                                {...register('identityFilePath', {
                                    required: false,
                                })}
                            />
                        </FormGroup>
                    </FormSection>
                    <FormSection title={t('dialog.connectionTestSection.title')}>
                        <FormGroup>
                            <DatabaseConnectionTest
                                form={{
                                    fieldNames: {
                                        hostName: 'hostName',
                                        dbPath: 'dbPath',
                                        port: 'port',
                                        user: 'username',
                                        identityFilePath: 'identityFilePath',
                                    },
                                    isValid: isValid,
                                    watch: watch,
                                }}
                            />
                        </FormGroup>
                    </FormSection>
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
