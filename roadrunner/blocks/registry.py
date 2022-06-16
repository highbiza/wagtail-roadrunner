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
    RichText,
    PageTitle,
)
from roadrunner.blocks.bootstrap import (
    PopupBlock,
    AccordionBlock,
    ButtonBlock,
    TabBlock,
    SliderBlock,
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
        "pagetitle",
        PageTitle(
            template="streamfields/html/pagetitle.html",
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
            template="streamfields/html/image_lazy.html",
            icon="image",
            roadrunner_options={"group": "HTML", "title": "alt"},
        ),
    ),
    (
        "video",
        VideoBlock(
            template="streamfields/html/embed_video.html",
            icon="media",
            roadrunner_options={"group": "HTML", "title": "url"},
        ),
    ),
    (
        "richtext",
        RichText(
            template="streamfields/html/richtext.html",
            icon="richtext",
            roadrunner_options={"group": "HTML", "title": "block_text"},
        ),
    ),
    # bootstrap
    (
        "popup",
        PopupBlock(
            template="streamfields/bootstrap/popup.html",
            icon="form",
            roadrunner_options={"group": "Bootstrap", "title": "text"},
        ),
    ),
    (
        "button",
        ButtonBlock(
            template="streamfields/bootstrap/button.html",
            icon="form",
            roadrunner_options={"group": "Bootstrap", "title": "label"},
        ),
    ),
    (
        "tabs",
        TabBlock(
            template="streamfields/bootstrap/tabs.html",
            icon="form",
            roadrunner_options={"group": "Bootstrap"},
        ),
    ),
    (
        "slider",
        SliderBlock(
            template="streamfields/bootstrap/slider.html",
            icon="form",
            roadrunner_options={"group": "Bootstrap"},
        ),
    ),
    # ListBlocks,
    (
        "Accordion",
        blocks.ListBlock(
            AccordionBlock(),
            template="streamfields/listblock/accordion.html",
            icon="plus-inverse",
            roadrunner_options={"group": "Bootstrap", "title": "header"},
            group="Bootstrap",
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
