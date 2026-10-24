import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const SCHEMAS_DIR = join(ROOT, 'schemas');
export const EXAMPLES_DIR = join(ROOT, 'examples');
export const DIST_DIR = join(ROOT, 'dist');

/**
 * @returns the schema versions (e.g. '1.0') in ascending order
 */
export function versions() {
   return readdirSync(SCHEMAS_DIR).sort(compareVersions);
}

export function compareVersions(v1, v2) {
   const [major1, minor1] = v1.split('.').map(Number);
   const [major2, minor2] = v2.split('.').map(Number);
   return major1 - major2 || minor1 - minor2;
}

/**
 * @returns { [version]: { scene, entry } }
 */
export function schemas() {
   return Object.fromEntries(versions().map(v => [v, {
      scene: readJson(join(SCHEMAS_DIR, v, 'scene.schema.json')),
      entry: readJson(join(SCHEMAS_DIR, v, 'entry.schema.json'))
   }]));
}

/**
 * @returns { [version]: { valid: { [name]: document }, invalid: { [name]: { expectedErrorPath, document } } } }
 */
export function examples() {
   return Object.fromEntries(versions().map(v => [v, {
      valid: jsonFilesOf(join(EXAMPLES_DIR, v, 'valid')),
      invalid: jsonFilesOf(join(EXAMPLES_DIR, v, 'invalid'))
   }]));
}

function jsonFilesOf(dir) {
   return Object.fromEntries(readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .map(f => [basename(f, '.json'), readJson(join(dir, f))]));
}

function readJson(file) {
   return JSON.parse(readFileSync(file, 'utf8'));
}
