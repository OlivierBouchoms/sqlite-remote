import * as Handlebars from 'handlebars';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { templates } from './templates';

const templatePath = path.join(__dirname, 'ssh_host.handlebars');

const templateContent = Handlebars.compile(fs.readFileSync(templatePath, 'utf-8'));

const hosts: string[] = [];

for (const data of Object.values(templates)) {
    hosts.push(templateContent(data));
}

const outputPath = path.join(__dirname, 'config.gen');

fs.writeFileSync(outputPath, hosts.join('\n'));
