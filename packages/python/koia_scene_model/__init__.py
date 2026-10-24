from importlib.resources import files

from .v1 import ContextInfo, SceneColumn, SceneConfig, SceneDocument

__all__ = ["ContextInfo", "SceneColumn", "SceneConfig", "SceneDocument", "schema_path"]


def schema_path(version: str, kind: str):
    """
    :param version: scene format version, e.g. '1.0'
    :param kind: 'scene' or 'entry'
    :returns: the packaged JSON Schema file
    """
    return files(__package__) / "schemas" / version / f"{kind}.schema.json"
