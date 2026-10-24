# Python

```
pip install koia-scene-model
```

```python
from koia_scene_model import SceneColumn, SceneConfig, SceneDocument, schema_path

scene = SceneDocument(schemaVersion='1.0', creationTime=1767225600000, name='Logs', shortDescription='', database='data_1',
                      columns=[SceneColumn(name='Data', dataType='Text', width=400)], config=SceneConfig(records=[], views=[]))
document = scene.model_dump(mode='json', by_alias=True, exclude_none=True)
```

- The models are pydantic v2 classes, and Python 3.10 or later is required.
- `schema_path('1.0', 'scene')` returns the packaged schema, e.g. for validating with `jsonschema`.
- To generate the models yourself, run [`packages/python/generate.sh`](../../packages/python/generate.sh) with
  `datamodel-code-generator` installed.
