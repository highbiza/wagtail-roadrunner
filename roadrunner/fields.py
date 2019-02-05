from django import forms

from wagtail.core.blocks import ListBlock
from wagtail.core.fields import StreamField

from .blocks import RoadRunnerBaseBlock, TemplateBlock


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
                    ListBlock(
                        base_block,
                        template="streamfields/bootstrap/container.html",
                        icon="fa-th-large",
                        label="Boxed",
                    ),
                ),
                (
                    "full_width",
                    ListBlock(
                        base_block,
                        template="streamfields/bootstrap/container_fluid.html",
                        icon="fa-th",
                        label="Full",
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

    def get_panel(self):
        from .edit_handlers import RoadRunnerPanel

        return RoadRunnerPanel

    def formfield(self, **kwargs):
        """
        Override formfield to use a plain forms.Field so that we do no transformation on the value
        (as distinct from the usual fallback of forms.CharField, which transforms it into a string).
        """
        defaults = {"form_class": RoadRunnerFormField}
        defaults.update(**kwargs)
        return super().formfield(**defaults)
