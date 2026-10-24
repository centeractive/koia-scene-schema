# koia-scene-model

Pydantic models generated from the [Koia scene JSON Schema](https://github.com/centeractive/koia-scene-schema), plus the packaged schemas.

```python
from koia_scene_model import SceneDocument, SceneColumn, schema_path

scene = SceneDocument(creationTime=1767225600000, name='Logs', shortDescription='', database='data_1',
                      columns=[SceneColumn(name='Data', dataType='Text')], schemaVersion='1.0')
print(scene.model_dump_json(by_alias=True, exclude_none=True))
```

See [SPEC.md](https://github.com/centeractive/koia-scene-schema/blob/main/docs/SPEC.md) for the rules beyond the schema.
