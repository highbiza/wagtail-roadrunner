import uuid

from django import template

register = template.Library()


@register.simple_tag(takes_context=False)
def get_unique_id():
    return uuid.uuid4()
