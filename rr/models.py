from django.db import models
from django.utils.translation import gettext_lazy as _

from wagtail.admin.panels import FieldPanel

from rr.fields import RoadRunnerField


class Template(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    content = RoadRunnerField(null=True, blank=True, use_json_field=True)

    panels = [FieldPanel("name"), FieldPanel("content")]

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["name"]
