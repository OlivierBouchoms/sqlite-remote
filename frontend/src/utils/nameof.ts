// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function nameof<T>(key: keyof T, _?: T): keyof T {
    return key;
}
