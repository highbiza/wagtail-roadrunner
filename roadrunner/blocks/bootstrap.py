import uuid
from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from roadrunner.blocks.styling import BaseStylingBlock


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

class BootstrapTabStylingBlock(blocks.ChoiceBlock):
    choices = [
        ("tabs", "Tabs"),
        ("pills", "Pills"),
        ("pills vertical", "Vertical pills"),
    ]

class PopupBlock(blocks.StructBlock):
    text = blocks.CharBlock(
        max_length=50, label="Label", help_text="Label of the button"
    )
    button_style = BootstrapColorChoiceBlock(label="Button style")
    popup_header = blocks.CharBlock(
        max_length=255, label="Titel", help_text="Header inside the popup", required=False
    )
    popup_content = blocks.RichTextBlock(
        label="Text", help_text="Body of the popup"
    )
    big_modal = blocks.BooleanBlock(label="Big modal", required=False, default=True)
    styling = BaseStylingBlock()

    class Meta:
        form_template = "formtemplate/popup.html"
        preview_template = "preview/bootstrap/popup.html"
        group = "Bootstrap"


class AccordionBlock(blocks.StructBlock):
    header = blocks.CharBlock(
        max_length=255, label="Title", help_text="Header of the accordion", required=False
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Body of the accordion", required=False
    )

    def get_uuid(self):
        return uuid.uuid4()

    class Meta:
        group = "Bootstrap"
        preview_template = "preview/bootstrap/accordion.html"

class ButtonBlock(blocks.StructBlock):
    label = blocks.CharBlock(required=False)
    page_url = blocks.PageChooserBlock(required=False)
    external_url = blocks.CharBlock(required=False, label="External url", help_text="You can also use the mailto: or tel: preset for functional use")
    new_tab = blocks.BooleanBlock(required=False, default=False, label="Open in new tab")
    button_style = BootstrapColorChoiceBlock(label="Button style")
    styling = BaseStylingBlock()

    class Meta:
        preview_template = "preview/bootstrap/button.html"
        label = "Button"
        group = "Bootstrap"

class TabChildrenBlock(blocks.StructBlock):
    title = blocks.CharBlock(
        max_length=255, label="Lable", help_text="Lable of the button", required=False
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Body of the tab", required=False
    )

class TabBlock(blocks.StructBlock):
    tab_style = BootstrapTabStylingBlock(label="Tab style", default="tabs")
    tabs = blocks.ListBlock(TabChildrenBlock(), template="streamfields/bootstrap/tabchild.html")
    styling = BaseStylingBlock()

    def get_uuid(self):
        return uuid.uuid4()

    class Meta:
        preview_template = "preview/bootstrap/tab.html"
        group = "Bootstrap"
