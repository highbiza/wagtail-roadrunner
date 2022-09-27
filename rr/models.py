from django.db import models
from django.utils.translation import ugettext_lazy as _

from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel
from wagtail.snippets.models import register_snippet

from rr.fields import RoadRunnerField


@register_snippet
class Template(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    content = RoadRunnerField(null=True, blank=True)

    panels = [FieldPanel("name"), StreamFieldPanel("content")]

    def __str__(self):
        return self.name
