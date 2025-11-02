import * as Handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { templates } from './templates';

const templatePath = path.join(__dirname, 'README.md.handlebars');

const templateContent = Handlebars.compile(fs.readFileSync(templatePath, 'utf-8'));

for (const [key, data] of Object.entries(templates)) {
    const readmePath = path.join(__dirname, '..', '..', '..', 'mock-server', key, 'README.md');

    fs.writeFileSync(readmePath, templateContent(data));
}
