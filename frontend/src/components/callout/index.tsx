import { Callout as RadixCallout } from '@radix-ui/themes';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './index.module.css';

type CalloutProps = {
    type: 'error';
    title: string;
    description: string | null | undefined;
};

const COLORS: Record<CalloutProps['type'], RadixCallout.RootProps['color']> = {
    error: 'red',
};

export const Callout = ({ type, title, description }: CalloutProps) => {
    return (
        <RadixCallout.Root color={COLORS[type]} role='alert'>
            <RadixCallout.Icon>
                <FaInfoCircle />
            </RadixCallout.Icon>
            <RadixCallout.Text>{title}</RadixCallout.Text>
            {!!description && <RadixCallout.Text className={styles.text}>{description}</RadixCallout.Text>}
        </RadixCallout.Root>
    );
};
