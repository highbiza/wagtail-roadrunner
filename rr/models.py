from django.db import models
from django.utils.translation import gettext_lazy as _

from wagtail.admin.panels import FieldPanel
from wagtail.snippets.models import register_snippet

from rr.fields import RoadRunnerField


@register_snippet
class Template(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    content = RoadRunnerField(null=True, blank=True, use_json_field=True)

    panels = [FieldPanel("name"), FieldPanel("content")]

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]
