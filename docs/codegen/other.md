# Other languages

Generate the model from the schema, e.g. with [quicktype](https://quicktype.io):

```
npx quicktype --src-lang schema --lang csharp --out Scene.cs https://www.koia.io/assets/scene-format/1.0/scene.schema.json
```

- Generate closed types, so that no unknown properties are written.
- Only generate from the scene schema. Entries are maps from column name to string, number or boolean.
- Validate the documents you write against the schema in your tests, and follow [SPEC.md](../SPEC.md).
