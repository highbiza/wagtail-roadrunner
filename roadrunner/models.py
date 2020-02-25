from collections import OrderedDict
from unidecode import unidecode

from django.db import models
from django.template import Template as DjangoTemplate, Context, RequestContext
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel

from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.contrib.table_block.blocks import TableBlock
from wagtail.core import blocks
from wagtail.core.models import Orderable
from wagtail.images.blocks import ImageChooserBlock
from wagtail.documents.blocks import DocumentChooserBlock
from wagtail.snippets.models import register_snippet

from roadrunner.blocks import MultipleChoiceBlock, ColorPickerBlock
from roadrunner.edit_handlers import RoadRunnerPanel
from roadrunner.fields import RoadRunnerField


@register_snippet
class PreFooterSnippet(models.Model):
    name = models.CharField(verbose_name="Naam", max_length=50)
    content = RoadRunnerField()

    panels = [FieldPanel("name"), RoadRunnerPanel("content")]

    def __str__(self):
        return self.name


@register_snippet
class Template(models.Model):
    name = models.CharField(verbose_name="Naam", max_length=50)
    content = RoadRunnerField()

    panels = [FieldPanel("name"), RoadRunnerPanel("content")]

    def __str__(self):
        return self.name


@register_snippet
class Block(ClusterableModel):
    name = models.CharField(verbose_name="Naam", max_length=50)
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


BLOCK_FIELD_CHOICES = [
    ("char", "Tekst"),
    ("richtext", "Richtext"),
    ("text", "Meerdere regels tekst"),
    ("image", "Afbeelding"),
    ("page", "Pagina"),
    ("document", "Document"),
    ("choice", "Dropdown"),
    ("multiple_choice", "Meerdere keuze dropdown"),
    ("integer", "Nummer"),
    ("date", "Datum"),
    ("boolean", "Checkbox"),
    # ('table', 'Tabel'),
    ("color", "Kleur"),
    ("email", "Email"),
    ("url", "URL"),
]


class BlockField(Orderable):
    block = ParentalKey(Block, on_delete=models.CASCADE, related_name="fields")
    label = models.CharField(
        verbose_name=_("label"),
        max_length=255,
        help_text=_("The label of the form field"),
    )
    block_type = models.CharField(
        verbose_name=_("field type"), max_length=16, choices=BLOCK_FIELD_CHOICES
    )
    required = models.BooleanField(verbose_name=_("required"), default=True)
    choices = models.TextField(
        verbose_name=_("choices"), blank=True, help_text="Bij dropdowns/multi-dropdowns"
    )
    help_text = models.CharField(
        verbose_name=_("help text"), max_length=255, blank=True
    )

    panels = [
        FieldPanel("label"),
        FieldPanel("help_text"),
        FieldPanel("required"),
        FieldPanel("block_type", classname="formbuilder-type"),
        FieldPanel("choices", classname="formbuilder-choices"),
    ]

    def get_choices(self):
        choices = self.choices.split(",")
        return (
            (str(slugify(str(unidecode(choice.strip())))), choice.strip())
            for choice in choices
            if choice
        )

    def get_block(self):
        block_type = self.block_type
        attrs = dict(label=self.label, required=self.required, help_text=self.help_text)
        if block_type == "char":
            block = blocks.CharBlock
        if block_type == "richtext":
            block = blocks.RichTextBlock
        if block_type == "text":
            block = blocks.TextBlock
        if block_type == "page":
            block = blocks.PageChooserBlock
        if block_type == "image":
            block = ImageChooserBlock
        if block_type == "document":
            block = DocumentChooserBlock
        if block_type == "choice":
            block = blocks.ChoiceBlock
            attrs.update(dict(choices=self.get_choices()))
        if block_type == "multiple_choice":
            block = MultipleChoiceBlock
            attrs.update(dict(choices=self.get_choices()))
        if block_type == "integer":
            block = blocks.IntegerBlock
        if block_type == "date":
            block = blocks.DateBlock
        if block_type == "boolean":
            block = blocks.BooleanBlock
        if block_type == "table":
            block = TableBlock
        if block_type == "color":
            block = ColorPickerBlock
        if block_type == "email":
            block = blocks.EmailBlock
        if block_type == "url":
            block = blocks.URLBlock

        return block(**attrs)

    @property
    def clean_name(self):
        return str(slugify(str(unidecode(self.label))))


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
        base_context = self.get_context(value, parent_context=context)
        new_context = {
            key.replace("-", "_"): value
            for key, value in base_context.get("self", {}).items()
        }
        
        if context is not None:
            return template.render(RequestContext(base_context.get("request"), new_context))
        else:            
            return template.render(Context(new_context))
