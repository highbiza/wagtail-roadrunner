import uuid
from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from rr.blocks.styling import StylingBlock, ColorPickerBlock
from rr.search import get_searchable_content_for_fields


class BootstrapColorChoiceBlock(blocks.ChoiceBlock):
    choices = [
        ("primary", "Primary"),
        ("secondary", "Secondary"),
        ("light", "Light"),
        ("dark", "Dark"),
        ("info", "Info"),
        ("success", "Success"),
        ("warning", "Warning"),
        ("danger", "Danger"),
    ]

    def get_searchable_content(self, value):
        return []


class BootstrapTabStylingBlock(blocks.ChoiceBlock):
    choices = [
        ("tabs", "Tabs"),
        ("pills", "Pills"),
        ("pills vertical", "Vertical pills"),
    ]

    def get_searchable_content(self, value):
        return []


class PopupBlock(blocks.StructBlock):
    text = blocks.CharBlock(
        max_length=50, label="Label", help_text="Label of the button", required=False
    )
    button_style = BootstrapColorChoiceBlock(label="Button style", required=False)
    popup_header = blocks.CharBlock(
        max_length=255,
        label="Titel",
        help_text="Header inside the popup",
        required=False,
    )
    popup_content = blocks.RichTextBlock(label="Text", help_text="Body of the popup")
    big_modal = blocks.BooleanBlock(label="Big modal", required=False, default=True)
    open_on_load = blocks.BooleanBlock(
        label="Open wanneer pagina geladen wordt",
        help_text="Hierdoor is de button ook niet meer zichtbaar",
        required=False,
        default=False,
    )
    open_once = blocks.BooleanBlock(
        label="Een keer openen",
        help_text="Nadat de popup wordt gesloten wordt die niet meer getoont",
        required=False,
        default=False,
    )

    styling = StylingBlock()

    class Meta:
        form_template = "formtemplate/popup.html"
        preview_template = "preview/bootstrap/popup.html"
        group = "Bootstrap"


class AccordionBlock(blocks.StructBlock):
    header = blocks.CharBlock(
        max_length=255,
        label="Title",
        help_text="Header of the accordion",
        required=False,
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Body of the accordion", required=False
    )

    class Meta:
        group = "Bootstrap"
        preview_template = "preview/bootstrap/accordion.html"


class AccordionListBlock(blocks.ListBlock):
    def get_context(self, value, parent_context=None):
        ctx = super().get_context(value, parent_context=parent_context)
        ctx["uuid"] = uuid.uuid4()
        return ctx


class ButtonBlock(blocks.StructBlock):
    label = blocks.CharBlock(required=False)
    page_url = blocks.PageChooserBlock(required=False)
    external_url = blocks.CharBlock(
        required=False,
        label="External url",
        help_text="You can also use the mailto: or tel: preset for functional use",
    )
    new_tab = blocks.BooleanBlock(
        required=False, default=False, label="Open in new tab"
    )
    button_style = BootstrapColorChoiceBlock(label="Button style")
    styling = StylingBlock()

    class Meta:
        preview_template = "preview/bootstrap/button.html"
        label = "Button"
        group = "Bootstrap"


class TabChildrenBlock(blocks.StructBlock):
    title = blocks.CharBlock(
        max_length=255, label="Label", help_text="Label of the button", required=False
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Body of the tab", required=False
    )


class TabBlock(blocks.StructBlock):
    tab_style = BootstrapTabStylingBlock(label="Tab style", default="tabs")
    tabs = blocks.ListBlock(TabChildrenBlock(form_classname="nav-link"), form_classname="nav nav-tabs")
    styling = StylingBlock()

    def get_uuid(self):
        return uuid.uuid4()

    class Meta:
        preview_template = "preview/bootstrap/tab.html"
        group = "Bootstrap"


class SliderChildBlock(blocks.StructBlock):
    image = ImageChooserBlock(required=False)
    body = blocks.RichTextBlock(required=False)
    position = blocks.ChoiceBlock(
        choices=[
            ("top-left", "Top left"),
            ("top-right", "Top right"),
            ("bottom-left", "Bottom left"),
            ("bottom-right", "Bottom right"),
            ("middle-left", "Middle left"),
            ("middle", "Middle"),
            ("middle-right", "Middle right"),
        ],
        required=False,
        default="middle-left",
    )
    ribbon_color = ColorPickerBlock(label="Ribbon kleur", required=False)
    ribbon_position = blocks.ChoiceBlock(
        choices=[("left", "Left"), ("right", "Right")], required=False
    )

    def get_searchable_content(self, value):
        return get_searchable_content_for_fields(
            value, self.child_blocks, ["image", "body"]
        )

    class Meta:
        preview_template = "preview/bootstrap/slider.html"
        form_template = "formtemplate/slide.html"


class SliderBlock(blocks.StructBlock):
    slides = blocks.ListBlock(SliderChildBlock())
    styling = StylingBlock()

    class Meta:
        preview = ["slides"]
        group = "Bootstrap"
