from django.conf import settings

from wagtail.core import blocks

from .styling import *
from .html import *
from .bootstrap import *

preset_blocks = [
    # html
    (
        "header",
        HeaderBlock(
            template="streamfields/html/header.html",
            icon="title",
            roadrunner_options={"group": "HTML", "title": "text"},
        ),
    ),
    (
        "divider",
        DividerBlock(
            template="streamfields/html/divider.html",
            icon="horizontalrule",
            roadrunner_options={"group": "HTML"},
        ),
    ),
    (
        "image",
        ImageBlock(
            template="streamfields/html/image.html",
            icon="fa-camera-retro",
            roadrunner_options={"group": "HTML", "title": "alt"},
        ),
    ),
    (
        "video",
        VideoBlock(
            template="streamfields/html/video.html",
            icon="fa-video-camera",
            roadrunner_options={"group": "HTML", "title": "url"},
        ),
    ),
    (
        "text",
        TextBlock(
            template="streamfields/html/text.html",
            icon="fa-align-left",
            roadrunner_options={"group": "HTML", "title": "text"},
        ),
    ),
    (
        "richtext",
        RichText(
            template="streamfields/html/richtext.html",
            icon="fa-align-left",
            roadrunner_options={"group": "HTML", "title": "block_text"},
        ),
    ),
    (
        "html",
        TextBlock(
            template="streamfields/html/html.html",
            icon="fa-html5",
            roadrunner_options={"group": "HTML", "title": "text"},
        ),
    ),
    (
        "script",
        ScriptBlock(
            template="streamfields/html/script.html",
            icon="fa-code",
            roadrunner_options={"group": "HTML", "title": "script"},
        ),
    ),
    # bootstrap
    (
        "button",
        ButtonBlock(
            template="streamfields/bootstrap/button.html",
            icon="fa-hand-pointer-o",
            roadrunner_options={"group": "Bootstrap"},
        ),
    ),
    (
        "breadcrumb",
        BreadcrumbBlock(
            template="streamfields/bootstrap/breadcrumb.html",
            icon="fa-chevron-right",
            roadrunner_options={"group": "Bootstrap"},
        ),
    ),
    (
        "jumbotron",
        JumbotronBlock(
            template="streamfields/bootstrap/jumbotron.html",
            icon="fa-file",
            roadrunner_options={"group": "Bootstrap", "title": "header"},
        ),
    ),
    (
        "thumbnail",
        ThumbnailBlock(
            template="streamfields/bootstrap/thumbnail.html",
            icon="fa-camera",
            roadrunner_options={"group": "Bootstrap", "title": "text"},
        ),
    ),
    (
        "card",
        CardBlock(
            template="streamfields/bootstrap/card.html",
            icon="fa-columns",
            roadrunner_options={"group": "Bootstrap", "title": "header"},
        ),
    ),
    (
        "embed",
        EmbedBlock(
            template="streamfields/bootstrap/embed.html",
            icon="fa-terminal",
            roadrunner_options={"group": "Bootstrap", "title": "url"},
        ),
    ),
    (
        "modal",
        ModalBlock(
            template="streamfields/bootstrap/modal.html",
            icon="fa-window-restore",
            roadrunner_options={"group": "Bootstrap", "title": "text"},
        ),
    ),
    (
        "accordion",
        AccordionBlock(
            template="streamfields/bootstrap/accordion.html",
            icon="fa-bars",
            roadrunner_options={"group": "Bootstrap", "title": "header"},
        ),
    ),
    # ListBlocks,
    (
        "nav_pills",
        blocks.ListBlock(
            TabBlock(),
            template="streamfields/bootstrap/nav_pills.html",
            icon="fa-bars",
            roadrunner_options={"group": "Bootstrap", "title": "tab_header"},
        ),
    ),
    (
        "nav_tabs",
        blocks.ListBlock(
            TabBlock(),
            template="streamfields/bootstrap/nav_tabs.html",
            icon="fa-list",
            roadrunner_options={"group": "Bootstrap", "title": "tab_header"},
        ),
    ),
    (
        "carousel",
        blocks.ListBlock(
            CarouselBlock(),
            template="streamfields/bootstrap/carousel.html",
            icon="fa-picture-o",
            roadrunner_options={"group": "Bootstrap"},
        ),
    ),
]


class GridChoiceBlock(blocks.ChoiceBlock):
    choices = [
        ("12", "12"),
        ("11", "11"),
        ("10", "10"),
        ("9", "9"),
        ("8", "8"),
        ("7", "7"),
        ("6", "6"),
        ("5", "5"),
        ("4", "4"),
        ("3", "3"),
        ("2", "2"),
        ("1", "1"),
    ]


class StreamBlock(blocks.StreamBlock):
    def additional_child_blocks(self):
        from roadrunner.registering import registered_blocks
        from roadrunner.models import Block

        streamfields = Block.get_streamfields()

        for name, block in registered_blocks:
            block.set_name(name)
            streamfields[name] = block

        return streamfields

    def to_python(self, value):
        self.child_blocks.update(self.additional_child_blocks())
        return super().to_python(value)

    def bulk_to_python(self, values):
        self.child_blocks.update(self.additional_child_blocks())
        return super().bulk_to_python(values)


class RoadRunnerBaseBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=50, required=False, classname="grid-title")
    grid = GridChoiceBlock(
        label="Breedte kolom", help_text="De breedte kolommen (*/12)."
    )
    content = StreamBlock(
        getattr(settings, "ROADRUNNER_CONTENT_BLOCKS", preset_blocks), label="Inhoud"
    )
    styling = BaseStylingBlock()

    def __init__(self, roadrunner_blocks, *args, **kwargs):
        super().__init__(*args, **kwargs)
        content_child_blocks = self.child_blocks["content"].child_blocks
        if not content_child_blocks:
            for name, block in roadrunner_blocks:
                block.set_name(name)
                content_child_blocks[name] = block


from .template import *
