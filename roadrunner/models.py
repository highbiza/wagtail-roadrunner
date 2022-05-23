from collections import OrderedDict
from unidecode import unidecode

from django.db import models
from django.template import Template as DjangoTemplate, Context, RequestContext
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from modelcluster.models import ClusterableModel

from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.core import blocks
from wagtail.snippets.models import register_snippet

from roadrunner.edit_handlers import RoadRunnerPanel
from roadrunner.fields import RoadRunnerField


@register_snippet
class PreFooterSnippet(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    content = RoadRunnerField()

    panels = [FieldPanel("name"), RoadRunnerPanel("content")]

    def __str__(self):
        return self.name


@register_snippet
class Template(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    content = RoadRunnerField()

    panels = [FieldPanel("name"), RoadRunnerPanel("content")]

    def __str__(self):
        return self.name


@register_snippet
class Block(ClusterableModel):
    name = models.CharField(_("Name"), max_length=50)
    html = models.TextField(default="<div></div>")

    panels = [
        FieldPanel("name"),
        FieldPanel("html"),
        InlinePanel("fields", heading="Velden"),
    ]

    def __str__(self):
        return self.name

    def get_name(self):
        return str(slugify(str(unidecode(self.name))))

    def get_block(self):
        return SnippetBlock(
            template=self.html,
            name=self.get_name(),
            label=self.name,
            icon="snippet",
            roadrunner_options=dict(group="Snippets"),
            fields=self.fields.all(),
        )

    @classmethod
    def get_streamfields(cls):
        all_blocks = cls.objects.all()
        streamfields = {block.get_name(): block.get_block() for block in all_blocks}
        return OrderedDict(streamfields)


class SnippetBlock(blocks.StructBlock):
    def __init__(self, template, name, fields, *args, **kwargs):
        self.template = template
        self.name = name
        super().__init__(*args, **kwargs)
        for field in fields:
            name = field.clean_name
            block = field.get_block()
            block.name = name
            self.child_blocks.update({name: block})

    def render(self, value, context=None):
        template = DjangoTemplate(self.template)
        context = self.get_context(value, parent_context=context)
        new_context = {
            key.replace("-", "_"): value
            for key, value in context.get("self", {}).items()
        }

        context.update(new_context)

        if "request" in context:
            return template.render(RequestContext(context.get("request"), context))
        else:
            return template.render(Context(context))
