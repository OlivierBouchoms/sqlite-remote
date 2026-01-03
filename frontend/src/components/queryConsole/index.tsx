import { useTranslation } from 'react-i18next';
import { Toolbar, ToolbarItemProps } from '../toolbar';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FaCopy, FaPlay } from 'react-icons/fa6';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import styles from './index.module.css';
import { sql, SQLite } from '@codemirror/lang-sql';
import { useServerServicePostApiServerQuery } from '../../generated/api/queries';
import { useDatabaseConfiguration } from '../../context/databaseConfigurationContext.tsx';
import { QueryConsoleError } from './error';
import { QueryConsoleResults } from './results';

type Props = {
    open: boolean;
};

export const QueryConsole = ({ open }: Props) => {
    const [content, setContent] = useState<string>('');

    const codeMirrorElement = useRef<ReactCodeMirrorRef | null>();

    const { data: postQueryData, mutateAsync: postQuery, isPending: isPostingQuery, error: postQueryError } = useServerServicePostApiServerQuery();

    const { selectedConfig } = useDatabaseConfiguration();

    const { t } = useTranslation(undefined, { keyPrefix: 'components.queryConsole' });

    const getCommandTextToExecute = useCallback(() => {
        const editorView = codeMirrorElement.current?.view;

        if (editorView) {
            const selection = editorView.state.selection.main;
            if (selection.from !== selection.to) {
                return editorView.state.doc.sliceString(selection.from, selection.to);
            }
        }

        return content;
    }, [content]);

    const onExecute = useCallback(async () => {
        if (!selectedConfig) return;

        const commandText = getCommandTextToExecute().trim();

        if (commandText.length === 0) {
            return;
        }
        await postQuery({ requestBody: { dbPath: selectedConfig.dbPath, sshHost: selectedConfig.ssh.hostName, commandText: commandText } });
    }, [getCommandTextToExecute, postQuery, selectedConfig]);

    const toolbarItems = useMemo((): ToolbarItemProps[] => {
        return [
            {
                icon: <FaPlay />,
                label: t('toolbar.execute'),
                onClick: onExecute,
                disabled: !content.trim().length || isPostingQuery,
            },
            {
                icon: <FaCopy />,
                label: t('toolbar.copy'),
                onClick: async () => {
                    await navigator.clipboard.writeText(content);
                },
            },
        ];
    }, [content, isPostingQuery, postQuery, selectedConfig, t]);

    return (
        <div className={styles.root} style={{ display: open ? 'flex' : 'none' }}>
            <Toolbar items={toolbarItems} />
            <div className={styles.editorWrapper}>
                <CodeMirror
                    ref={(e) => (codeMirrorElement.current = e)}
                    className={styles.editor}
                    height='100%'
                    lang='sql'
                    extensions={[sql({ upperCaseKeywords: true, dialect: SQLite })]}
                    onChange={setContent}
                    value={content}
                />
            </div>
            <div className={styles.bottomSection}>
                <QueryConsoleResults data={postQueryData} loading={isPostingQuery} emptyStateLabel={t('noResults')} />
                <QueryConsoleError error={postQueryError} />
            </div>
        </div>
    );
};
