from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from rr.adapters import (
    ImageChooserBlockAdapter,
    RoadRunnerStructBlockAdapter,
    PreviewListBlockAdapter,
    PreviewFieldBlockAdapter,
    RichTextBlockAdapter,
)
from rr.telepath import register

# register different adapters for some of wagtails builtin classes
register(ImageChooserBlockAdapter(), ImageChooserBlock)
register(RoadRunnerStructBlockAdapter(), blocks.StructBlock)
register(RichTextBlockAdapter(), blocks.RichTextBlock)
register(PreviewFieldBlockAdapter(), blocks.FieldBlock)
register(PreviewListBlockAdapter(), blocks.ListBlock)
