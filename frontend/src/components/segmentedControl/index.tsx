import { SegmentedControl as RadixSegmentedControl } from '@radix-ui/themes';

export type SegmentedControlItem = {
    label: string;
    value: string;
};

export type SegmentedControlProps = {
    items: SegmentedControlItem[];
    defaultValue: string;
    value: string;
    onValueChange: (value: string) => void;
};

export const SegmentedControl = ({ items, defaultValue, value, onValueChange }: SegmentedControlProps) => (
    <RadixSegmentedControl.Root defaultValue={defaultValue} onValueChange={onValueChange} value={value} size='2'>
        {items.map((i) => (
            <RadixSegmentedControl.Item key={i.value} value={i.value}>
                {i.label}
            </RadixSegmentedControl.Item>
        ))}
    </RadixSegmentedControl.Root>
);
