import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compile } from 'json-schema-to-typescript';
import { DIST_DIR, examples, schemas, versions } from './catalog.mjs';

const TS_OPTIONS = { additionalProperties: false, ignoreMinAndMaxItems: true, bannerComment: '' };

mkdirSync(DIST_DIR, { recursive: true });
const bundledSchemas = schemas();
writeJson('schemas.json', bundledSchemas);
writeJson('examples.json', examples());

const newest = bundledSchemas[versions().at(-1)];
const declarations = [
   await compile(newest.scene, 'SceneDocument', TS_OPTIONS),
   await compile(newest.entry, 'EntryDocument', TS_OPTIONS)
];
writeFileSync(join(DIST_DIR, 'index.d.ts'), declarations.join('\n'));

function writeJson(file, content) {
   writeFileSync(join(DIST_DIR, file), JSON.stringify(content, null, 2) + '\n');
}
