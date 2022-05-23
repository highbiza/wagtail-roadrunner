from django import forms
from django.contrib.contenttypes.models import ContentType
from wagtail.core import blocks


class ModelChoiceBlock(blocks.FieldBlock):
    def __init__(self, model, required=True, help_text=None, **kwargs):
        self._required = required
        self._help_text = help_text
        self._model = model
        super().__init__(**kwargs)

    def get_queryset(self):
        model = self._model
        if isinstance(model, str):
            app_label, model_name = model.split(".")
            model_type = ContentType.objects.get(app_label=app_label, model=model_name)
            model = model_type.model_class()
        return model.objects.all()

    @property
    def field(self):
        queryset = self.get_queryset()
        return forms.ModelChoiceField(
            queryset=queryset,
            required=self._required,
            help_text=self._help_text,
            label=self.label,
        )

    def to_python(self, value):
        queryset = self.get_queryset()
        try:
            value = queryset.get(id=value)
        except queryset.model.DoesNotExist:
            return
        else:
            return value


class TemplateBlock(blocks.StructBlock):
    template = ModelChoiceBlock(model="roadrunner.template")
