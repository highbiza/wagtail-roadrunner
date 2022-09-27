from django.utils.functional import cached_property

from wagtail.core.blocks import ChooserBlock
from wagtail.core.utils import resolve_model_string
from wagtail.core import blocks


class ModelChoiceBlock(ChooserBlock):
    def __init__(self, target_model, required=True, help_text=None, **kwargs):
        self._required = required
        self._help_text = help_text
        self._target_model = target_model
        super().__init__(target_model, **kwargs)

    @cached_property
    def target_model(self):
        return resolve_model_string(self._target_model)

    @cached_property
    def widget(self):
        from wagtail.snippets.widgets import AdminSnippetChooser

        return AdminSnippetChooser(self.target_model)

    def get_queryset(self):
        return self.target_model.objects.all()


class TemplateBlock(blocks.StructBlock):
    template = ModelChoiceBlock(target_model="rr.template")
