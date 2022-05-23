from django import forms
from django.utils.functional import cached_property

from wagtail.admin.staticfiles import versioned_static
from wagtail.core.blocks.field_block import FieldBlockAdapter
from wagtail.core.blocks.stream_block import StreamBlockAdapter
from wagtail.core.blocks.struct_block import StructBlockAdapter
from wagtail.core.blocks.list_block import ListBlockAdapter


class RoadRunnerStreamBlockAdapter(StreamBlockAdapter):
    js_constructor = "roadrunner.fields.PreviewStreamBlockDefinition"

    @property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class RoadRunnerStructBlockAdapter(StructBlockAdapter):
    js_constructor = "roadrunner.fields.StylingBlockDefinition"

    def js_args(self, block):
        name, values, meta = super().js_args(block)
        if hasattr(block.meta, "preview_template"):
            context = self.get_form_context(
                self.get_default(), prefix="__PREFIX__", errors=None
            )
            meta["previewTemplate"] = mark_safe(
                render_to_string(self.meta.preview_template, context)
            )

        if hasattr(block.meta, "preview"):
            meta["preview"] = block.meta.preview

        return [name, values, meta]

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class RoadRunnerBaseBlockAdapter(RoadRunnerStructBlockAdapter):
    js_constructor = "roadrunner.fields.RoadRunnerBaseBlockDefinition"

    @property
    def media(self):
        return super().media + forms.Media(
            css={"all": [versioned_static("roadrunner/roadrunner.css")]},
        )


class ImageChooserBlockAdapter(FieldBlockAdapter):
    js_constructor = "roadrunner.fields.ImageChooserBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class RoadrunnerRowBlockAdapter(ListBlockAdapter):
    js_constructor = "roadrunner.fields.RoadrunnerRowBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(  # pylint: disable=protected-access
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )
