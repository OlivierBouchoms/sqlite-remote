import { ReactNode } from 'react';
import { Button, Popover as RadixPopover } from '@radix-ui/themes';
import styles from './index.module.css';

type Props = {
    children: ReactNode;
    trigger: ReactNode;
};

export const Popover = ({ children, trigger }: Props) => {
    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger>
                <Button className={styles.trigger} tabIndex={-1} variant='ghost'>
                    {trigger}
                </Button>
            </RadixPopover.Trigger>

            <RadixPopover.Content>{children}</RadixPopover.Content>
        </RadixPopover.Root>
    );
};
