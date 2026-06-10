from django.utils.translation import gettext_lazy as _
from wagtail import hooks
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Template


@register_snippet
class RoadrunnerTemplateSnippetViewSet(SnippetViewSet):
    model = Template
    icon = "doc-full-inverse"
    menu_label = _("RoadRunner Templates")
    menu_name = "rr-template"
    add_to_settings_menu = True


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
