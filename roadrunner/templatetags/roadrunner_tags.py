from django import template
from roadrunner.models import PreFooterSnippet

register = template.Library()

# Pre footer snippets
@register.inclusion_tag('snippets/pre_footer.html', takes_context=True)
def pre_footer(context):
    return {
        'snippets': PreFooterSnippet.objects.all(),
        'request': context.get('request'),
        'page': context.get("page"),
        'self': context.get("self"),
    }
