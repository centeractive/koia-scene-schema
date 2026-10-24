import json
from pathlib import Path

import jsonschema
import pytest

from koia_scene_model import SceneDocument, schema_path

VALID_EXAMPLES = sorted((Path(__file__).parent.parent.parent.parent / "examples" / "1.0" / "valid").glob("*.json"))


@pytest.mark.parametrize("example", VALID_EXAMPLES, ids=lambda p: p.stem)
def test_valid_example_validates_and_parses(example):
    document = json.loads(example.read_text(encoding="utf-8"))
    schema = json.loads(schema_path("1.0", "scene").read_text(encoding="utf-8"))

    jsonschema.Draft7Validator(schema).validate(document)
    scene = SceneDocument.model_validate(document)

    jsonschema.Draft7Validator(schema).validate(scene.model_dump(mode="json", by_alias=True, exclude_none=True))
