from django import template
from django.utils.functional import cached_property
from django.utils.safestring import mark_safe
from wagtail.admin.rich_text.converters.contentstate import ContentstateConverter
from wagtail.core.rich_text import features as feature_registry
from wagtail.core.templatetags.wagtailcore_tags import richtext

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


class ContentstateConverterBuilder:
    # This defers calling get_default_features until Django is started up.
    # prevents _frozen_importlib._DeadlockError: deadlock detected by _ModuleLock

    @cached_property
    def converter(self):
        features = feature_registry.get_default_features()
        converter = ContentstateConverter(features)
        return converter


converter_builder = ContentstateConverterBuilder()


@register.filter
def convert_to_html(text):
    # Shouldn't this be something like https://docs.wagtail.io/en/v2.7/advanced_topics/customisation/rich_text_internals.html#FeatureRegistry.register_converter_rule
    html = converter_builder.converter.to_database_format(text.source)
    return richtext(html)
