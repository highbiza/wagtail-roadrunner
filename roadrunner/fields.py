from django import forms
from wagtail.core.blocks.base import BlockField as WagtailBlockField
from wagtail.core.fields import StreamField

from roadrunner.widgets import RoadRunnerBlockWidget
from roadrunner.blocks.template import TemplateBlock
from roadrunner.blocks.main import (
    RoadRunnerBaseBlock,
    FixedWidthRowBlock,
    FullWidthRowBlock,
)


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
    def __init__(self, block_types=None, grid=True, **kwargs):
        if grid:
            base_block = RoadRunnerBaseBlock(block_types)
            block_types = [
                (
                    "fixed_width",
                    FixedWidthRowBlock(
                        base_block,
                    ),
                ),
                (
                    "full_width",
                    FullWidthRowBlock(
                        base_block,
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

        super().__init__(block_types, **kwargs)

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
