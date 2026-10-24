# Koia scene schema

The contract for programs that write scenes into CouchDB for [Koia](https://github.com/centeractive/koia), for example
[Retrospective](https://www.retrospective.centeractive.com).

- [`schemas/`](schemas): JSON Schemas (draft-07) of the scene and entry documents, one directory per format version.
  Koia also serves them at `https://www.koia.io/assets/scene-format/<version>/<kind>.schema.json`.
- [`docs/SPEC.md`](docs/SPEC.md): the normative rules (databases, indexes, launch URL, versioning).
- [`examples/`](examples): valid and invalid documents, the contract tests of all packages and of Koia.

## Packages

| Language | Package | Docs |
|---|---|---|
| Java | `com.centeractive.koia:koia-scene-model` (Gson) | [docs/codegen/java.md](docs/codegen/java.md) |
| Python | `koia-scene-model` (pydantic) | [docs/codegen/python.md](docs/codegen/python.md) |
| TypeScript | `@centeractive/koia-scene-schema` | [docs/codegen/typescript.md](docs/codegen/typescript.md) |
| other | generate from the schema | [docs/codegen/other.md](docs/codegen/other.md) |

## Development

```
npm ci && npm run bundle && npm test           # schemas, examples, TypeScript types
cd packages/java && mvn verify                 # Java model
cd packages/python && pip install .[test] && pytest
```

Releases are created by pushing a tag `vX.Y.Z`, see [CHANGELOG.md](CHANGELOG.md).

## License

MIT licensed, see [LICENSE](LICENSE). Copyright (c) 2026 centeractive ag.
