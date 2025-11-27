export function getRootCssVariable(variable: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
}
