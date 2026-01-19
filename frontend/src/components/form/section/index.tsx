import { Collapsible as RadixCollapsible } from 'radix-ui';
import { ReactNode } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Button } from '@radix-ui/themes';
import styles from './index.module.css';

type Props = {
    children: ReactNode;
    title?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    collapsible?: boolean;
};

export const FormSection = ({ children, title, open = true, onOpenChange, collapsible = false }: Props) => {
    return (
        <RadixCollapsible.Root open={open} onOpenChange={onOpenChange}>
            <div className={styles.header} data-collapsible={collapsible} onClick={() => onOpenChange?.(!open)}>
                {title ? <h3 className={styles.title}>{title}</h3> : <div />}
                {collapsible && (
                    <Button className={styles.trigger} onClick={() => onOpenChange?.(!open)} variant='ghost'>
                        {open ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                )}
            </div>
            <RadixCollapsible.Content className={styles.content}>{children}</RadixCollapsible.Content>
        </RadixCollapsible.Root>
    );
};
