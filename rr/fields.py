from django import forms
from wagtail.core.blocks.base import BlockField as WagtailBlockField
from wagtail.core.fields import StreamField
from wagtail.core.blocks import StreamBlock, StructBlock

from rr.widgets import RoadRunnerBlockWidget
from rr.blocks.template import TemplateBlock
from rr.blocks.styling import StylingBlock
from rr.blocks.main import (
    RoadRunnerBaseBlock,
    FixedWidthRowBlock,
    FullWidthRowBlock,
    RoadRunnerStreamBlock,
)
from rr.blocks.registry import registered_blocks


class BlockField(WagtailBlockField):
    """
    This class has to be called BlockField because it will translate to
    a css class that makes the field rendered full width
    """

    def __init__(self, block=None, **kwargs):
        if "widget" not in kwargs:
            kwargs["widget"] = RoadRunnerBlockWidget(block)
        super().__init__(block, **kwargs)


class RoadRunnerFormField(forms.Field):
    def __init__(self, block=None, **kwargs):  # pylint: disable=W0613
        super().__init__(**kwargs)


class RoadRunnerField(StreamField):
    def deconstruct(self):
        name, path, _, kwargs = super().deconstruct()
        return name, path, [], kwargs

    def __init__(self, block_types=None, **kwargs):
        if block_types is None:
            block_types = registered_blocks()

        roadrunner_block_types = StreamBlock(
            [
                (
                    "fixed_width",
                    StructBlock(
                        [
                            (
                                "row",
                                FixedWidthRowBlock(
                                    RoadRunnerBaseBlock(
                                        [
                                            (
                                                "content",
                                                RoadRunnerStreamBlock(block_types),
                                            )
                                        ]
                                    ),
                                ),
                            ),
                            ("styling", StylingBlock()),
                        ], form_classname="roadrunner"
                    ),
                ),
                (
                    "full_width",
                    StructBlock(
                        [
                            (
                                "row",
                                FullWidthRowBlock(
                                    RoadRunnerBaseBlock(
                                        [
                                            (
                                                "content",
                                                RoadRunnerStreamBlock(block_types),
                                            )
                                        ]
                                    ),
                                ),
                            ),
                            ("styling", StylingBlock()),
                        ], form_classname="roadrunner"
                    ),
                ),
                (
                    "template",
                    TemplateBlock(
                        template="streamfields/template.html",
                        icon="snippet",
                        label="Template",
                    ),
                ),
            ]
        )

        super().__init__(roadrunner_block_types, **kwargs)

    def formfield(self, **kwargs):
        return super().formfield(form_class=BlockField)
