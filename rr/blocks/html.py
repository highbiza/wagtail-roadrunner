from bs4 import BeautifulSoup
from django.utils.translation import gettext, gettext_lazy as _, pgettext_lazy
from django.core.exceptions import ValidationError

from wagtail.blocks import StructValue
from wagtail import blocks
from wagtail.contrib.table_block.blocks import TableBlock, DEFAULT_TABLE_OPTIONS
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock

from rr.telepath import register
from rr.blocks.styling import StylingBlock
from rr.adapters import PageTitleAdapter
from rr.search import get_searchable_content_for_fields

# Why? Because wagtail does not add the language files to the media, so when it's anything other than en-US
# it will throw an error which results in destroyed editor. See https://github.com/wagtail/wagtail/issues/5504#issuecomment-531231091
US_TABLE_OPTIONS = DEFAULT_TABLE_OPTIONS.copy()
US_TABLE_OPTIONS["language"] = "en-US"


class HeaderBlock(blocks.StructBlock):
    HEADER_CHOICES = (
        ("h2", "H2"),
        ("h3", "H3"),
        ("h4", "H4"),
        ("h5", "H5"),
        ("h6", "H6"),
    )
    heading_type = blocks.ChoiceBlock(
        choices=HEADER_CHOICES, label=_("Header type"), default="h2"
    )
    text = blocks.CharBlock(label=_("Text"), max_length=255)
    styling = StylingBlock()

    def get_searchable_content(self, value):
        return get_searchable_content_for_fields(value, self.child_blocks, ["text"])

    class Meta:
        preview_template = "preview/html/headerblock.html"
        group = "HTML"


class PageTitle(blocks.StructBlock):
    styling = StylingBlock()

    class Meta:
        group = "HTML"


register(PageTitleAdapter(), PageTitle)


class RichText(blocks.StructBlock):
    block_text = blocks.RichTextBlock(label=_("Content"), required=False)

    styling = StylingBlock()

    class Meta:
        preview = ["block_text"]
        group = "HTML"


class DividerBlock(blocks.StructBlock):
    DIVIDER_CHOICES = (
        ("lg-thin", _("Long thin line")),
        ("sm-thick", _("Small thick line")),
    )

    divider_type = blocks.ChoiceBlock(
        choices=DIVIDER_CHOICES, label=_("Divider type"), default="lg-thin"
    )
    styling = StylingBlock()

    def get_searchable_content(self, value):
        return []

    class Meta:
        preview_template = "preview/html/divider.html"
        group = "HTML"
        icon = "divider"


class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(
        max_length=255,
        label=_("Alt."),
        help_text=_("Optional, alternative text for image"),
        required=False,
    )
    lazy = blocks.BooleanBlock(
        label=pgettext_lazy("loading", "Lazy"),
        help_text=_(
            "If an image is below the fold on the page, mark it as lazy to speed up page load times."
            "Can't be used with svg images"
        ),
        default=False,
        required=False,
    )
    page_url = blocks.PageChooserBlock(label=_("Page url"), required=False)
    external_url = blocks.CharBlock(label=_("External link"), required=False)
    open_in_new_tab = blocks.BooleanBlock(label=_("Open in a new tab"), required=False)
    styling = StylingBlock()

    def clean(self, value):
        result = super().clean(value)
        if result["lazy"] and result["image"].is_svg():
            raise ValidationError(gettext("Can't use lazy with svg images"))

        return result

    class Meta:
        preview = ["image"]
        form_template = "formtemplate/image.html"
        group = "HTML"


class VideoBlockValue(StructValue):
    def wide_video(self):
        video_soup = BeautifulSoup(str(self.get("video")), "html.parser")
        video_soup.div["class"] = "embed-wrapper"
        video_soup.div.iframe["width"] = "100%"
        del video_soup.div.iframe["height"]
        if self.get("lazy"):
            video_soup.div.iframe["data-src"] = video_soup.div.iframe["src"]
            video_soup.div.iframe["class"] = "lazy"
            del video_soup.div.iframe["src"]
        return video_soup


class VideoBlock(blocks.StructBlock):
    video = EmbedBlock(max_width=1200, max_height=800, label="Video link")
    lazy = blocks.BooleanBlock(
        label=pgettext_lazy("loading", "Lazy"),
        help_text=_(
            "If a video is below the fold on the page, mark it as lazy to speed up page load times"
        ),
        default=False,
        required=False,
    )
    styling = StylingBlock()

    class Meta:
        preview_template = "preview/html/video.html"
        group = "HTML"
        value_class = VideoBlockValue


class HtmlBlock(blocks.StructBlock):
    html = blocks.RawHTMLBlock(required=False)

    class Meta:
        preview_template = "preview/html/html.html"
        group = "HTML"


class TableMakerBlock(blocks.StructBlock):
    table = TableBlock(
        table_options=US_TABLE_OPTIONS,
        help_text=_("Use the right mouse button to modify the table rows/cells"),
    )
    styling = StylingBlock()

    class Meta:
        icon = "table"
        label = _("Table")
        group = "HTML"
        template = "streamfields/html/table.html"
        preview_template = "preview/html/table.html"
