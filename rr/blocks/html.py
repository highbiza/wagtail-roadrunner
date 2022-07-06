from bs4 import BeautifulSoup

from wagtail.core.blocks import StructValue
from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock

from rr.blocks.styling import StylingBlock


class HeaderBlock(blocks.StructBlock):
    HEADER_CHOICES = (
        ("h2", "H2"),
        ("h3", "H3"),
        ("h4", "H4"),
        ("h5", "H5"),
        ("h6", "H6"),
    )
    heading_type = blocks.ChoiceBlock(
        choices=HEADER_CHOICES, label="Header", default="h2"
    )
    text = blocks.CharBlock(
        label="Tekst", help_text="Tekst in de header", max_length=255
    )
    styling = StylingBlock()

    class Meta:
        preview_template = "preview/html/headerblock.html"
        group = "HTML"


class PageTitle(blocks.StructBlock):
    styling = StylingBlock()

    class Meta:
        group = "HTML"


class RichText(blocks.StructBlock):
    block_text = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van het tekstblok", required=False
    )

    styling = StylingBlock()

    class Meta:
        preview = ["block_text"]
        group = "HTML"


class DividerBlock(blocks.StructBlock):
    DIVIDER_CHOICES = (
        ("lg-thin", "Long thin line"),
        ("sm-thick", "Small thick line"),
    )

    divider_type = blocks.ChoiceBlock(
        choices=DIVIDER_CHOICES, label="Divider type", default="lg-thin"
    )
    styling = StylingBlock()

    class Meta:
        preview_template = "preview/html/divider.html"
        group = "HTML"


class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(
        max_length=255,
        label="Alt.",
        help_text="Optioneel, afbeelding alt tekst",
        required=False,
    )
    lazy = blocks.BooleanBlock(label="Lazy", default=False, required=False)
    styling = StylingBlock()

    class Meta:
        preview = ["image", "alt"]
        group = "HTML"


class VideoBlockValue(StructValue):
    def wide_video(self):
        video_soup = BeautifulSoup(str(self.get("video")), "html.parser")
        video_soup.div["class"] = "embed-wrapper"
        video_soup.div.iframe["width"] = "100%"
        del video_soup.div.iframe["height"]
        return video_soup


class VideoBlock(blocks.StructBlock):
    video = EmbedBlock(max_width=1200, max_height=800, label="Video url")
    lazy = blocks.BooleanBlock(label="Lazy", default=False, required=False)
    styling = StylingBlock()

    class Meta:
        preview_template = "preview/html/video.html"
        group = "HTML"
        value_class = VideoBlockValue
