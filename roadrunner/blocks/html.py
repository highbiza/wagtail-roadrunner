from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from roadrunner.blocks.styling import BaseStylingBlock


class HeaderBlock(blocks.StructBlock):
    HEADER_CHOICES = (
        ("h1", "H1"),
        ("h2", "H2"),
        ("h3", "H3"),
        ("h4", "H4"),
        ("h5", "H5"),
        ("h6", "H6"),
    )
    heading_type = blocks.ChoiceBlock(
        choices=HEADER_CHOICES, label="Header", default="h1"
    )
    text = blocks.CharBlock(
        label="Tekst", help_text="Tekst in de header", max_length=255
    )
    styling = BaseStylingBlock()


class RichText(blocks.StructBlock):
    block_text = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van het tekstblok", required=False
    )

    styling = BaseStylingBlock()


class TextBlock(blocks.StructBlock):
    text = blocks.TextBlock(label="Tekst")
    styling = BaseStylingBlock()


class ScriptBlock(blocks.StructBlock):
    script = blocks.TextBlock(label="Script", required=False)
    src = blocks.CharBlock(required=False)


class DividerBlock(blocks.StructBlock):
    border_top_width = blocks.CharBlock(
        max_length=255, label="Hoogte", help_text="CSS Syntax (bv. 5px)"
    )
    width = blocks.CharBlock(
        max_length=255, label="Breedte", help_text="CSS Syntax (bv. 100% of 100px)"
    )
    styling = BaseStylingBlock()


class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(
        max_length=255,
        label="Alt.",
        help_text="Optioneel, afbeelding alt tekst",
        required=False,
    )
    styling = BaseStylingBlock()


class VideoBlock(blocks.StructBlock):
    url = blocks.CharBlock(
        label="URL", help_text="Het adres van een site, de domeinnaam.", max_length=255
    )
    styling = BaseStylingBlock()
