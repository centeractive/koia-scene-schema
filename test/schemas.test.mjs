import Ajv from 'ajv';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIST_DIR, compareVersions, examples, schemas, versions } from '../scripts/catalog.mjs';

const SCHEMAS = schemas();
const EXAMPLES = examples();

function sceneValidatorOf(version) {
   const ajv = new Ajv({ allErrors: true });
   ajv.addKeyword('x-since');
   return ajv.compile(SCHEMAS[version].scene);
}

function laterMinorsOf(version) {
   const [major] = version.split('.');
   return versions().filter(v => v.split('.')[0] === major && compareVersions(v, version) > 0);
}

/**
 * @returns the paths of all properties declared by the schema, e.g. 'definitions/column/properties/width'
 */
function propertyPathsOf(schema, prefix = '') {
   return ['properties', 'definitions'].flatMap(keyword => Object.entries(schema[keyword] ?? {})
      .flatMap(([name, sub]) => [prefix + keyword + '/' + name, ...propertyPathsOf(sub, prefix + keyword + '/' + name + '/')]));
}

function schemaAt(schema, path) {
   return path.split('/').reduce((s, segment) => s[segment], schema);
}

describe.each(versions())('scene schema %s', version => {

   const validate = sceneValidatorOf(version);

   it.each(Object.entries(EXAMPLES[version].valid))('valid example %s validates', (name, document) => {
      const valid = validate(document);

      expect(validate.errors).toBeNull();
      expect(valid).toBe(true);
   });

   it.each(Object.entries(EXAMPLES[version].invalid))('invalid example %s fails at its expected path', (name, { expectedErrorPath, document }) => {
      const valid = validate(document);

      expect(valid).toBe(false);
      expect(validate.errors.map(e => e.instancePath)).toContain(expectedErrorPath);
   });

   it('valid examples validate against every later minor', () => {
      const laterValidators = laterMinorsOf(version).map(sceneValidatorOf);

      const rejected = laterValidators.flatMap(v => Object.values(EXAMPLES[version].valid).filter(d => !v(d)));

      expect(rejected).toEqual([]);
   });

   it('properties added after the major release carry the x-since annotation', () => {
      const base = SCHEMAS[version.split('.')[0] + '.0'];

      const unannotated = ['scene', 'entry'].flatMap(kind => {
         const basePaths = new Set(propertyPathsOf(base[kind]));
         return propertyPathsOf(SCHEMAS[version][kind])
            .filter(p => !basePaths.has(p) && !schemaAt(SCHEMAS[version][kind], p)['x-since'])
            .map(p => kind + ':' + p);
      });

      expect(unannotated).toEqual([]);
   });
});

describe('bundle', () => {

   it('contains every schema version directory', () => {
      const bundled = JSON.parse(readFileSync(join(DIST_DIR, 'schemas.json'), 'utf8'));

      expect(Object.keys(bundled)).toEqual(versions());
   });

   it('contains every example', () => {
      const bundled = JSON.parse(readFileSync(join(DIST_DIR, 'examples.json'), 'utf8'));

      expect(bundled).toEqual(EXAMPLES);
   });

   it('declares scene and entry document types', () => {
      const declarations = readFileSync(join(DIST_DIR, 'index.d.ts'), 'utf8');

      expect(declarations).toContain('export interface SceneDocument');
      expect(declarations).toContain('export interface EntryDocument');
   });
});
