import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC_DIR = join(import.meta.dir, '../src');
const LOCALES_DIR = join(import.meta.dir, '../i18n/locales');
const LOCALES = ['fr', 'en'];

function walk(dir: string, filelist: string[] = []): string[] {
  for (const file of readdirSync(dir)) {
    const filepath = join(dir, file);
    if (statSync(filepath).isDirectory()) {
      walk(filepath, filelist);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

function extractKeysFromFile(file: string): string[] {
  const content = readFileSync(file, 'utf8');
  const regex = /(?:i18n\.t|t)\(\s*['"`]([^'"`]+)['"`]/g;
  const keys: string[] = [];
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: <>
  while ((match = regex.exec(content))) {
    keys.push(match[1] as string);
  }
  return keys;
}

function getAllUsedKeys(): string[] {
  const files = walk(SRC_DIR);
  const allKeys = new Set<string>();
  files.forEach((file) => {
    extractKeysFromFile(file).forEach((key) => {
        allKeys.add(key);
    });
  });
  return Array.from(allKeys);
}

function getLocaleKeys(locale: string): string[] {
  const file = join(LOCALES_DIR, `${locale}.json`);
  if (!existsSync(file)) return [];
  const data = JSON.parse(readFileSync(file, 'utf8'));
  // biome-ignore lint/suspicious/noExplicitAny: <>
  function flatten(obj: any, prefix = ''): Record<string, string> {
    return Object.entries(obj).reduce(
      (acc, [k, v]) => {
        const newKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object' && v !== null) {
          // biome-ignore lint/performance/noAccumulatingSpread: <>
          Object.assign(acc, flatten(v, newKey));
        } else {
          acc[newKey] = v as string;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }
  return Object.keys(flatten(data));
}

function main() {
  const usedKeys = getAllUsedKeys();
  LOCALES.forEach((locale) => {
    const localeKeys = getLocaleKeys(locale);
    const missing = usedKeys.filter((key) => !localeKeys.includes(key));
    if (missing.length) {
      console.log(`\nClés manquantes dans ${locale}.json :`);
      missing.forEach((key) => {
        console.log(`"${key}": "",`);
      });
    } else {
      console.log(`\nAucune clé manquante dans ${locale}.json !`);
    }
  });
}

main();
