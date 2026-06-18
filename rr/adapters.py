from django import forms
from django.utils.functional import cached_property
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string

from wagtail.admin.staticfiles import versioned_static
from wagtail.blocks.field_block import FieldBlockAdapter
from wagtail.blocks.stream_block import StreamBlockAdapter
from wagtail.blocks.struct_block import StructBlockAdapter
from wagtail.blocks.list_block import ListBlockAdapter


class RoadRunnerStreamBlockAdapter(StreamBlockAdapter):
    js_constructor = "roadrunner.fields.PreviewStreamBlockDefinition"

    # pylint: disable=invalid-overridden-method
    @property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class PageTitleAdapter(StructBlockAdapter):
    js_constructor = "roadrunner.fields.PageTitleDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class RoadRunnerStructBlockAdapter(StructBlockAdapter):
    js_constructor = "wagtail.blocks.StructBlock"

    def js_args(self, block):
        name, values, meta = super().js_args(block)
        if hasattr(block.meta, "preview_template"):
            context = block.get_form_context(
                block.get_default(), prefix="__PREFIX__", errors=None
            )
            meta["previewTemplate"] = mark_safe(
                render_to_string(block.meta.preview_template, context)
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

    def js_args(self, block):
        name, values, meta = super().js_args(block)
        meta["classname"] = "struct-block roadrunnerblock"
        return [name, values, meta]

    # pylint: disable=invalid-overridden-method
    @property
    def media(self):
        return super().media + forms.Media(
            css={"all": [versioned_static("roadrunner/roadrunner.css")]},
        )


class PreviewFieldBlockAdapter(FieldBlockAdapter):
    js_constructor = "roadrunner.fields.PreviewFieldBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
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


class RichTextBlockAdapter(FieldBlockAdapter):
    js_constructor = "roadrunner.fields.RichTextBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class PreviewListBlockAdapter(ListBlockAdapter):
    js_constructor = "roadrunner.fields.PreviewListBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class RoadrunnerRowBlockAdapter(PreviewListBlockAdapter):
    js_constructor = "roadrunner.fields.RoadrunnerRowBlockDefinition"

    @cached_property
    def media(self):
        return super().media + forms.Media(  # pylint: disable=protected-access
            js=[
                versioned_static("wagtailadmin/js/telepath/blocks.js"),
                versioned_static("roadrunner/roadrunner.js"),
            ],
        )


class GridChoiceBlockAdapter(FieldBlockAdapter):
    js_constructor = "roadrunner.fields.GridChoiceBlockDefinition"


class ColorPickerBlockAdapter(FieldBlockAdapter):
    js_constructor = "roadrunner.fields.ColorPickerBlockDefinition"
