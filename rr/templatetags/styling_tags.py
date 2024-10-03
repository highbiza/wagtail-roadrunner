from django import template
from django.utils.safestring import mark_safe
from wagtail.templatetags.wagtailcore_tags import richtext

register = template.Library()
style_classes = ["block_classes", "padding", "margin", "border_radius", "border"]


@register.simple_tag
def get_styling(styling, no_style_tag=False):
    if not styling:
        return

    def format_prop(prop, value):
        if prop == "font_size":
            value = "%spx" % value
        return "%s: %s;" % (prop.replace("_", "-"), value)

    rule_set = [
        format_prop(prop, val)
        for prop, val in styling.items()
        if (val and prop and not prop in style_classes)
    ]
    attributes = " ".join(rule_set)

    if attributes:
        if no_style_tag:
            return mark_safe(attributes)

        return mark_safe('style="%s"' % attributes)

    return ""


@register.simple_tag
def get_styling_classes(styling):
    if not styling:
        return ""
    klasses = [
        klass for title, klass in styling.items() if (klass and title in style_classes)
    ]

    return " ".join(klasses)


# for backwards compatibility
register.filter(name="convert_to_html")(richtext)
