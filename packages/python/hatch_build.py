from pathlib import Path

from hatchling.builders.hooks.plugin.interface import BuildHookInterface

SCHEMAS = Path(__file__).parent.parent.parent / "schemas"


class SchemasBuildHook(BuildHookInterface):
    """
    includes the repository schemas when building from the source tree, a build from the sdist finds them inside the package
    """

    def initialize(self, version, build_data):
        if SCHEMAS.is_dir():
            build_data["force_include"][str(SCHEMAS)] = "koia_scene_model/schemas"
