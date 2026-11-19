// Checks that every language file has the same keys and the same {placeholders}
// as the English one. Run: npm run check:i18n
import { readFileSync, readdirSync } from 'node:fs';

const load = (file) => JSON.parse(readFileSync(`messages/${file}`, 'utf8'));

function flatten(value, prefix = '', out = {}) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === 'object' && child !== null) flatten(child, path, out);
    else out[path] = String(child);
  }
  return out;
}

const placeholders = (text) => [...text.matchAll(/\{(\w+)/g)].map((match) => match[1]).sort().join(',');

const english = flatten(load('en.json'));
let problems = 0;

for (const file of readdirSync('messages').filter((name) => name.endsWith('.json') && name !== 'en.json')) {
  const other = flatten(load(file));
  for (const key of Object.keys(english)) {
    if (!(key in other)) {
      console.error(`${file}: missing "${key}"`);
      problems++;
    } else if (placeholders(english[key]) !== placeholders(other[key])) {
      console.error(`${file}: placeholders differ in "${key}"`);
      problems++;
    }
  }
  for (const key of Object.keys(other)) {
    if (!(key in english)) {
      console.error(`${file}: extra key "${key}"`);
      problems++;
    }
  }
}

if (problems > 0) process.exit(1);
console.log(`Messages are in sync (${Object.keys(english).length} keys).`);
