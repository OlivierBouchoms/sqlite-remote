export type TemplateData = {
    os: string;
    os_snake_case: string;
    port: number;
    version: string;
    version_snake_case: string;
};

export type Templates = Record<string, TemplateData>;
