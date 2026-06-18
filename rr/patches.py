import warnings

from wagtail.blocks import BlockGroup

from rr.blocks.styling import StylingBlock
from rr.adapters import RoadRunnerStructBlockAdapter

orig_js_args = RoadRunnerStructBlockAdapter.js_args


def patched_js_args(self, block):
    """
    Backwards compatibility patch, without this existing blocks will have a very busy layout.
    """

    name, values, meta = orig_js_args(self, block)
    form_layout = meta.get("formLayout")
    if (
        form_layout is not None
        and not form_layout.settings
        and "formTemplate" not in meta
    ):
        settings_names = [
            bname
            for bname, bblock in block.child_blocks.items()
            if isinstance(bblock, StylingBlock)
        ]
        if settings_names:
            children = [n for n in block.child_blocks if n not in settings_names]
            meta["formLayout"] = BlockGroup(children=children, settings=settings_names)
            warnings.warn(
                f"{block.__class__.__name__}: StylingBlock fields {settings_names} were "
                f"automatically moved to the settings panel. Set Meta.form_layout explicitly "
                f"to suppress this warning.",
                DeprecationWarning,
                stacklevel=2,
            )
    return [name, values, meta]


RoadRunnerStructBlockAdapter.js_args = patched_js_args
