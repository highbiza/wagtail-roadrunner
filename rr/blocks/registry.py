from itertools import chain
from django.utils.functional import lazy
from django.utils.module_loading import import_string
from django.conf import settings


from rr.blocks.html import (
    HeaderBlock,
    DividerBlock,
    ImageBlock,
    VideoBlock,
    RichText,
    PageTitle,
    HtmlBlock,
    TableMakerBlock,
)
from rr.blocks.bootstrap import (
    PopupBlock,
    AccordionBlock,
    AccordionListBlock,
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
            icon="header",
        ),
    ),
    (
        "pagetitle",
        PageTitle(
            template="streamfields/html/pagetitle.html",
            icon="pagetitle",
        ),
    ),
    (
        "divider",
        DividerBlock(
            template="streamfields/html/divider.html",
            icon="horizontalrule",
        ),
    ),
    (
        "image",
        ImageBlock(
            template="streamfields/html/image_lazy.html",
            icon="image",
        ),
    ),
    (
        "video",
        VideoBlock(
            template="streamfields/html/embed_video.html",
            icon="media",
        ),
    ),
    (
        "richtext",
        RichText(
            template="streamfields/html/richtext.html",
            icon="richtext",
        ),
    ),
    (
        "html",
        HtmlBlock(
            template="streamfields/html/html.html",
            icon="html",
        ),
    ),
    (
        "table",
        TableMakerBlock(),
    ),
    # bootstrap
    (
        "popup",
        PopupBlock(
            template="streamfields/bootstrap/popup.html",
            icon="popup",
        ),
    ),
    (
        "button",
        ButtonBlock(
            template="streamfields/bootstrap/button.html",
            icon="button",
        ),
    ),
    (
        "tabs",
        TabBlock(
            template="streamfields/bootstrap/tabs.html",
            icon="tabs",
        ),
    ),
    (
        "slider",
        SliderBlock(
            template="streamfields/bootstrap/slider.html",
            icon="slider",
        ),
    ),
    # ListBlocks,
    (
        "Accordion",
        AccordionListBlock(
            AccordionBlock(),
            template="streamfields/listblock/accordion.html",
            icon="accordion",
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

    return list(chain(preset_blocks))


registered_blocks = lazy(_registered_blocks, list)
