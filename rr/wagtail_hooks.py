from django.utils.translation import gettext_lazy as _
from wagtail import hooks


@hooks.register("register_icons")
def register_roadrunner_icons(icons):
    icons.extend(
        [
            "roadrunner/icons/laptop.svg",
            "roadrunner/icons/mobile.svg",
            "roadrunner/icons/palette.svg",
            "roadrunner/icons/tablet.svg",
            "roadrunner/icons/tv.svg",
            "roadrunner/icons/layout.svg",
            "roadrunner/icons/accordion.svg",
            "roadrunner/icons/button.svg",
            "roadrunner/icons/popup.svg",
            "roadrunner/icons/product.svg",
            "roadrunner/icons/richtext.svg",
            "roadrunner/icons/slider.svg",
            "roadrunner/icons/tabs.svg",
            "roadrunner/icons/ggmaps.svg",
            "roadrunner/icons/highlight.svg",
            "roadrunner/icons/pagetitle.svg",
            "roadrunner/icons/header.svg",
            "roadrunner/icons/divider.svg",
            "roadrunner/icons/html.svg",
        ]
    )
    return icons
