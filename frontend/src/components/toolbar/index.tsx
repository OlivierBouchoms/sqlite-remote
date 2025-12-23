import { ReactNode } from 'react';
import { Button } from '@radix-ui/themes';
import styles from './index.module.css';

export type ToolbarItemProps = {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    disabled?: boolean;
};

export type ToolbarProps = {
    items: ToolbarItemProps[];
};

const ToolbarItem = ({ label, icon, onClick, disabled = false }: ToolbarItemProps) => {
    return (
        <Button size='1' aria-label={label} onClick={onClick} disabled={disabled} title={label} variant='soft'>
            {icon}
        </Button>
    );
};

export const Toolbar = ({ items }: ToolbarProps) => {
    return (
        <div className={styles.root}>
            {items.map((i) => (
                <ToolbarItem {...i} key={i.label} />
            ))}
        </div>
    );
};
