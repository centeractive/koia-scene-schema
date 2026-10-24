#!/usr/bin/env sh
# generates the pydantic models of the newest major into the file passed as $1 (default: koia_scene_model/v1.py)
set -e
cd "$(dirname "$0")"
datamodel-codegen \
  --input ../../schemas/1.0/scene.schema.json \
  --input-file-type jsonschema \
  --output-model-type pydantic_v2.BaseModel \
  --use-title-as-name \
  --disable-timestamp \
  --target-python-version 3.10 \
  --formatters black isort \
  --output "${1:-koia_scene_model/v1.py}"
