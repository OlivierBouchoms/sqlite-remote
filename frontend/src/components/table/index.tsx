import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { FaAsterisk, FaKey } from 'react-icons/fa6';
import { Checkbox } from '@radix-ui/themes';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

type TableProps = {
    visible: boolean;
    data: any[];
    columns: TableColumn[];
    onRenderingChange: (rendering: boolean) => void;
};

export type TableCellData = string | number | boolean | null;

export type TableColumnDataType = 'NULL' | 'INTEGER' | 'INT' | 'REAL' | 'TEXT' | 'BLOB' | 'ANY';

export type TableColumn = {
    name: string;
    type: TableColumnDataType;
    displayType?: 'CHECKBOX';
    required: boolean;
    defaultValue?: string | number;
    primaryKey: boolean;
    selector?: (obj: any) => TableCellData;
};

const TEXT_ALIGNMENT: Record<TableColumnDataType, 'left' | 'right'> = {
    NULL: 'left',
    TEXT: 'left',
    INTEGER: 'right',
    INT: 'right',
    REAL: 'right',
    BLOB: 'left',
    ANY: 'left',
};

type ColumnStyle = Pick<CSSProperties, 'width' | 'textAlign' | 'contentVisibility'>;

export const Table = ({ data, columns, onRenderingChange, visible }: TableProps) => {
    const [columnStyles, setColumnStyles] = useState<Map<string, ColumnStyle>>(new Map());

    const { t } = useTranslation(undefined, { keyPrefix: 'components.table' });

    const headerLength = useCallback((column: TableColumn): number => {
        let length = column.name.length;

        if (column.primaryKey) length += 2;

        if (column.required) length += 3;

        return length;
    }, []);

    const renderHeaderContent = useCallback((column: TableColumn): string | ReactNode => {
        return (
            <>
                {column.name}
                {column.primaryKey && <FaKey size='1ch' style={{ marginLeft: '1ch' }} />}
                {column.required && <FaAsterisk size='1ch' style={{ marginLeft: '1ch' }} />}
            </>
        );
    }, []);

    const renderCellContent = useCallback(
        (data: object, rowIndex: number, column: TableColumn): TableCellData | ReactNode => {
            const type: 'CHECKBOX' | TableColumnDataType = column.displayType ?? column.type;

            switch (type) {
                case 'CHECKBOX':
                    return <Checkbox checked={column.selector ? (column.selector(data) as boolean) : false} />;
                case 'BLOB':
                    return t('cell.placeholder.blob');
                default:
                    return column.selector ? column.selector(data) : rowIndex;
            }
        },
        [t]
    );

    useEffect(() => {
        const styles: Map<string, ColumnStyle> = new Map();

        columns.forEach((column) => {
            let maxLength = Math.max(4, headerLength(column));

            if (column.type === 'BLOB') {
                styles.set(column.name, {
                    contentVisibility: data.length > 100 ? 'auto' : 'visible',
                    textAlign: TEXT_ALIGNMENT[column.type],
                    width: maxLength + 'ch',
                });
                return;
            }

            data.forEach((row) => {
                const value = column.selector ? column.selector(row) : row[column.name];
                const str = value != null ? String(value) : '';
                if (str.length > maxLength) {
                    maxLength = str.length;
                }
            });

            styles.set(column.name, {
                contentVisibility: data.length > 100 ? 'auto' : 'visible',
                textAlign: TEXT_ALIGNMENT[column.type],
                width: `${maxLength}ch`,
            });
        });

        setColumnStyles(styles);
    }, [data, columns, headerLength]);

    const isRendering = useMemo(() => {
        for (const column of columns) {
            if (!columnStyles.has(column.name)) return true;
        }

        return false;
    }, [columnStyles, columns]);

    useEffect(() => {
        onRenderingChange(isRendering);
    }, [isRendering, onRenderingChange]);

    if (isRendering) return null;

    return (
        <div className={styles.table} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)`, display: visible ? 'grid' : 'none' }}>
            {columns.map((column, columnIndex) => (
                <div
                    className={styles.headerCell}
                    data-first-column={columnIndex === 0}
                    data-last-column={columnIndex === columns.length - 1}
                    style={{ width: columnStyles.get(column.name)!.width }}
                    key={column.name}
                >
                    {renderHeaderContent(column)}
                </div>
            ))}
            {data.map((row, rowIndex) => {
                return columns.map((column, columnIndex) => {
                    const columnStyle = columnStyles.get(column.name);

                    return (
                        <div
                            className={styles.cell}
                            data-first-column={columnIndex === 0}
                            data-last-column={columnIndex === columns.length - 1}
                            data-last-row={rowIndex === data.length - 1}
                            style={columnStyle}
                            key={column.name}
                        >
                            {renderCellContent(row, rowIndex + 1, column)}
                        </div>
                    );
                });
            })}
        </div>
    );
};
