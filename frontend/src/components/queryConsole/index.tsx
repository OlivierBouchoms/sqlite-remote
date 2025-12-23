import { useTranslation } from 'react-i18next';
import { Toolbar, ToolbarItemProps } from '../toolbar';
import { useMemo, useState } from 'react';
import { FaCopy, FaPlay } from 'react-icons/fa6';
import CodeMirror from '@uiw/react-codemirror';
import styles from './index.module.css';
import { sql, SQLite } from '@codemirror/lang-sql';

type Props = {
    open: boolean;
};

export const QueryConsole = ({ open }: Props) => {
    const [content, setContent] = useState<string>('');

    const { t } = useTranslation(undefined, { keyPrefix: 'components.queryConsole' });

    const toolbarItems = useMemo((): ToolbarItemProps[] => {
        return [
            {
                icon: <FaPlay />,
                label: t('toolbar.execute'),
                onClick: () => {},
                disabled: false,
            },
            {
                icon: <FaCopy />,
                label: t('toolbar.copy'),
                onClick: async () => {
                    await navigator.clipboard.writeText(content);
                },
                disabled: false,
            },
        ];
    }, [content, t]);

    return (
        <div className={styles.root} style={{ display: open ? 'flex' : 'none' }}>
            <Toolbar items={toolbarItems} />
            <div className={styles.editorWrapper}>
                <CodeMirror
                    className={styles.editor}
                    height='100%'
                    lang='sql'
                    extensions={[sql({ upperCaseKeywords: true, dialect: SQLite })]}
                    onChange={setContent}
                    value={content}
                />
            </div>
        </div>
    );
};
