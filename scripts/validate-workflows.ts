import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { parseDocument } from 'yaml';

const workflowDirectory = path.join('.github', 'workflows');
const workflowFiles = (await readdir(workflowDirectory)).filter((file) => /\.ya?ml$/i.test(file));

if (workflowFiles.length === 0) {
  throw new Error('No GitHub Actions workflows were found.');
}

for (const file of workflowFiles) {
  const source = await readFile(path.join(workflowDirectory, file), 'utf8');
  const document = parseDocument(source);
  if (document.errors.length > 0) {
    throw new Error(
      `${file} is invalid YAML:\n${document.errors.map((error) => error.message).join('\n')}`,
    );
  }
  const workflow = document.toJS() as Record<string, unknown>;
  if (!workflow.name || !workflow.on || !workflow.jobs) {
    throw new Error(`${file} must define name, on, and jobs.`);
  }
  console.log(`${file}: PASS`);
}
