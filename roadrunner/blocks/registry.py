from itertools import chain
from django.utils.translation import gettext_lazy as _
from django.utils.functional import lazy
from django.utils.module_loading import import_string
from django.conf import settings
from wagtail.core import blocks
from roadrunner.registering import get_registered_blocks as legacy_registered_blocks
from roadrunner.blocks.html import (
    HeaderBlock,
    DividerBlock,
    ImageBlock,
    VideoBlock,
    TextBlock,
    RichText,
    ScriptBlock,
)
from roadrunner.blocks.bootstrap import (
    ButtonBlock,
    BreadcrumbBlock,
    JumbotronBlock,
    ThumbnailBlock,
    CardBlock,
    EmbedBlock,
    ModalBlock,
    AccordionBlock,
    TabBlock,
    CarouselBlock,
)

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
            group="HTML",
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
            group="HTML",
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
            group="Bootstrap",
        ),
    ),
    (
        "nav_tabs",
        blocks.ListBlock(
            TabBlock(),
            template="streamfields/bootstrap/nav_tabs.html",
            icon="fa-list",
            roadrunner_options={"group": "Bootstrap", "title": "tab_header"},
            group="Bootstrap",
        ),
    ),
    (
        "carousel",
        blocks.ListBlock(
            CarouselBlock(),
            template="streamfields/bootstrap/carousel.html",
            icon="fa-picture-o",
            roadrunner_options={"group": "Bootstrap"},
            group="Bootstrap",
            label=_("Carousel"),
        ),
    ),
]


def _registered_blocks():
    roadrunner_registry_function_setting = getattr(
        settings, "ROADRUNNER_REGISTRY_FUNCTION", None
    )
    if roadrunner_registry_function_setting is not None:
        return import_string(roadrunner_registry_function_setting)(preset_blocks)

    print(preset_blocks, legacy_registered_blocks())
    return list(chain(preset_blocks, legacy_registered_blocks()))


registered_blocks = lazy(_registered_blocks, list)
