from django import template
from django.utils.safestring import mark_safe
from wagtail.admin.rich_text.converters.contentstate import ContentstateConverter
from wagtail.core.rich_text import features as feature_registry
from wagtail.core.templatetags.wagtailcore_tags import richtext

features = feature_registry.get_default_features()
converter = ContentstateConverter(features)
register = template.Library()


style_classes = ["block_classes", "padding", "margin", "border_radius", "border"]


@register.simple_tag
def get_styling(styling, no_style_tag=False):
    if not styling:
        return

    def format_prop(prop, value):
        if prop == "font_size":
            value += "px"
        return "%s: %s;" % (prop.replace("_", "-"), value)

    rule_set = [
        format_prop(prop, val)
        for prop, val in styling.items()
        if (val and not prop in style_classes)
    ]
    attributes = " ".join(rule_set)

    if no_style_tag:
        return mark_safe(attributes)

    return mark_safe('style="%s"' % attributes)


@register.simple_tag
def get_styling_classes(styling):
    if not styling:
        return
    klasses = [
        klass for title, klass in styling.items() if (klass and title in style_classes)
    ]
    return " ".join(klasses)


@register.filter
def convert_to_html(text):
    html = converter.to_database_format(text.source)
    return richtext(html)
