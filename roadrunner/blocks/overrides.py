from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from roadrunner.adapters import (
    ImageChooserBlockAdapter,
    RoadRunnerStructBlockAdapter,
    PreviewFieldBlockAdapter,
    RichTextBlockAdapter,
)
from roadrunner.telepath import register

# register different adapters for some of wagtails builtin classes
register(ImageChooserBlockAdapter(), ImageChooserBlock)
register(RoadRunnerStructBlockAdapter(), blocks.StructBlock)
register(RichTextBlockAdapter(), blocks.RichTextBlock)
register(PreviewFieldBlockAdapter(), blocks.FieldBlock)
