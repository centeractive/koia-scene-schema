# TypeScript / JavaScript

```
npm install @centeractive/koia-scene-schema
```

```ts
import type { SceneDocument, EntryDocument } from '@centeractive/koia-scene-schema';
import schemas from '@centeractive/koia-scene-schema/schemas.json';
import Ajv from 'ajv';

const validate = new Ajv({ allErrors: true }).compile(schemas['1.0'].scene);
```

- `SceneDocument` and `EntryDocument` are the types of the newest major version.
- `schemas.json` holds every published version, `{ "<version>": { "scene": …, "entry": … } }`.
- `examples.json` holds the valid and invalid examples, for contract tests.
- The individual files are available at `@centeractive/koia-scene-schema/schemas/<version>/<kind>.schema.json`.
