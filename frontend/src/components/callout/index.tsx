import { Callout as RadixCallout } from '@radix-ui/themes';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './index.module.css';

type CalloutProps = {
    type: 'info' | 'error';
    variant?: RadixCallout.RootProps['variant'];
    title: string;
    description?: string | null | undefined;
};

const COLORS: Record<CalloutProps['type'], RadixCallout.RootProps['color']> = {
    error: 'red',
    info: 'blue',
};

const ROLES: Record<CalloutProps['type'], RadixCallout.RootProps['role']> = {
    error: 'alert',
    info: 'status',
};

export const Callout = ({ type, variant, title, description }: CalloutProps) => {
    return (
        <RadixCallout.Root color={COLORS[type]} variant={variant} role={ROLES[type]}>
            <RadixCallout.Icon>
                <FaInfoCircle />
            </RadixCallout.Icon>
            <RadixCallout.Text>{title}</RadixCallout.Text>
            {!!description && <RadixCallout.Text className={styles.text}>{description}</RadixCallout.Text>}
        </RadixCallout.Root>
    );
};
