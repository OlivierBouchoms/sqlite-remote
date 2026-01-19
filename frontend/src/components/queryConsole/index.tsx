import { useTranslation } from 'react-i18next';
import { Toolbar, ToolbarItemProps } from '../toolbar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaCopy, FaPlay } from 'react-icons/fa6';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import styles from './index.module.css';
import { sql, SQLite } from '@codemirror/lang-sql';
import { useServerServicePostApiServerQuery } from '../../generated/api/queries';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { QueryConsoleError } from './error';
import { QueryConsoleResults } from './results';
import { useUpdateDatabaseConfiguration } from '../../domain/hooks/useUpdateDatabaseConfiguration.ts';

type Props = {
    open: boolean;
};

export const QueryConsole = ({ open }: Props) => {
    const [commandText, setCommandText] = useState<string>();
    const [selectedConfigId, setSelectedConfigId] = useState<string>('');

    const codeMirrorElement = useRef<ReactCodeMirrorRef | null>();

    const { data: postQueryData, mutateAsync: postQuery, isPending: isPostingQuery, error: postQueryError } = useServerServicePostApiServerQuery();

    const { selectedConfig } = useDatabaseConfiguration();

    const { mutate: updateDatabaseConfiguration } = useUpdateDatabaseConfiguration();

    const { t } = useTranslation(undefined, { keyPrefix: 'components.queryConsole' });

    const getCommandTextToExecute = useCallback(() => {
        const editorView = codeMirrorElement.current?.view;

        if (editorView) {
            const selection = editorView.state.selection.main;
            if (selection.from !== selection.to) {
                return editorView.state.doc.sliceString(selection.from, selection.to);
            }
        }

        return commandText ?? '';
    }, [commandText]);

    const onExecute = useCallback(async () => {
        if (!selectedConfig) return;

        const commandText = getCommandTextToExecute().trim();

        if (commandText.length === 0) {
            return;
        }
        await postQuery({
            requestBody: {
                dbPath: selectedConfig.dbPath,
                host: {
                    hostName: selectedConfig.ssh.hostName,
                    port: selectedConfig.ssh.port,
                    user: selectedConfig.ssh.username,
                    identityFilePath: selectedConfig.ssh.identityFilePath,
                },
                commandText: commandText,
            },
        });
    }, [getCommandTextToExecute, postQuery, selectedConfig]);

    const toolbarItems = useMemo((): ToolbarItemProps[] => {
        return [
            {
                icon: <FaPlay />,
                label: t('toolbar.execute'),
                onClick: onExecute,
                disabled: !commandText?.trim().length || isPostingQuery,
            },
            {
                icon: <FaCopy />,
                label: t('toolbar.copy'),
                onClick: async () => {
                    if (commandText) await navigator.clipboard.writeText(commandText);
                },
            },
        ];
    }, [commandText, isPostingQuery, onExecute, t]);

    useEffect(() => {
        if (selectedConfig && commandText === undefined) setCommandText(selectedConfig.queryConsole.commandText);

        if (selectedConfig && selectedConfig.id !== selectedConfigId) {
            setCommandText(selectedConfig.queryConsole.commandText);
        }

        setSelectedConfigId(selectedConfig?.id ?? '');
    }, [commandText, selectedConfig, selectedConfigId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const editorView = codeMirrorElement.current?.view;

            if (selectedConfig && editorView) {
                updateDatabaseConfiguration({
                    ...selectedConfig,
                    queryConsole: {
                        commandText: editorView.state.doc.toString(),
                    },
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [selectedConfig, updateDatabaseConfiguration]);

    return (
        <div className={styles.root} style={{ display: open ? 'flex' : 'none' }}>
            <Toolbar items={toolbarItems} />
            <div className={styles.editorWrapper}>
                {!!selectedConfig && (
                    <CodeMirror
                        ref={(e) => (codeMirrorElement.current = e)}
                        className={styles.editor}
                        height='100%'
                        lang='sql'
                        extensions={[sql({ upperCaseKeywords: true, dialect: SQLite })]}
                        onChange={setCommandText}
                        value={commandText}
                    />
                )}
            </div>
            <div className={styles.bottomSection}>
                <QueryConsoleResults data={postQueryData} loading={isPostingQuery} emptyStateLabel={t('noResults')} />
                <QueryConsoleError error={postQueryError} />
            </div>
        </div>
    );
};
