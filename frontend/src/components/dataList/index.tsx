import styles from './index.module.css';

export type DataListItem = {
    label: string;
    value: string | number;
};

export type DataListProps = {
    items: DataListItem[];
};

const DataListItem = ({ item }: { item: DataListItem }) => {
    return (
        <>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.value}>{item.value}</div>
        </>
    );
};

export const DataList = ({ items }: DataListProps) => {
    return (
        <div className={styles.root}>
            {items.map((item, index) => (
                <DataListItem key={index} item={item} />
            ))}
        </div>
    );
};
