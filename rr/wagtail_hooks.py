from importlib.metadata import version

from django.urls import path, reverse
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from django.views.i18n import JavaScriptCatalog
from wagtail import hooks
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Template
from . import patches  # pylint: disable=unused-import

# https://docs.djangoproject.com/en/6.0/topics/i18n/translation/#internationalization-in-javascript-code
# Wagtail also moved to this way for translating from within JS.
# Cache for 24h based on key (hash).
roadrunner_js_catalog_view = cache_page(
    86400, key_prefix=f"rr-jsi18n-{version('wagtail-roadrunner')}"
)(JavaScriptCatalog.as_view(packages=["rr"]))


@hooks.register("register_admin_urls")
def roadrunner_jsi18n_url():
    return [
        path(
            "jsi18n/roadrunner/",
            roadrunner_js_catalog_view,
            name="roadrunner_javascript_catalog",
        )
    ]


@hooks.register("insert_global_admin_js")
def roadrunner_jsi18n_script():
    return mark_safe(
        f'<script src="{reverse("roadrunner_javascript_catalog")}"></script>'
    )


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
