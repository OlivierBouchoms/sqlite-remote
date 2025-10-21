export type TemplateData = {
    os_snake_case: string;
    version_snake_case: string;
    port: number;
};

export type Templates = Record<string, TemplateData>;
