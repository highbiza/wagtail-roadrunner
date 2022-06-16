from django import forms
from wagtail.core.blocks.base import BlockField as WagtailBlockField
from wagtail.core.fields import StreamField
from wagtail.core.blocks import StreamBlock

from roadrunner.widgets import RoadRunnerBlockWidget
from roadrunner.blocks.template import TemplateBlock
from roadrunner.blocks.main import (
    RoadRunnerBaseBlock,
    FixedWidthRowBlock,
    FullWidthRowBlock,
    RoadRunnerStreamBlock,
)
from roadrunner.blocks.registry import registered_blocks


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
                    FixedWidthRowBlock(
                        RoadRunnerBaseBlock(
                            [("content", RoadRunnerStreamBlock(block_types))]
                        ),
                    ),
                ),
                (
                    "full_width",
                    FullWidthRowBlock(
                        RoadRunnerBaseBlock(
                            [("content", RoadRunnerStreamBlock(block_types))]
                        ),
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

    # def get_panel(self):
    #     from .edit_handlers import RoadRunnerPanel
    #
    #     return RoadRunnerPanel

    # def formfield(self, **kwargs):
    #     """
    #     Override formfield to use a plain forms.Field so that we do no transformation on the value
    #     (as distinct from the usual fallback of forms.CharField, which transforms it into a string).
    #     """
    #     defaults = {"form_class": RoadRunnerFormField}
    #     defaults.update(**kwargs)
    #     return super().formfield(**defaults)
