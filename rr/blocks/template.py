from wagtail.core import blocks
from wagtail.snippets.blocks import SnippetChooserBlock


class TemplateBlock(blocks.StructBlock):
    template = SnippetChooserBlock("rr.Template")
