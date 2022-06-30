from django.utils.translation import gettext_lazy as _
from wagtail.core import blocks
from wagtail.core.blocks import ListBlock

from rr.telepath import register
from rr.adapters import (
    RoadrunnerRowBlockAdapter,
    RoadRunnerStreamBlockAdapter,
    RoadRunnerBaseBlockAdapter,
    GridChoiceBlockAdapter,
)
from rr.blocks.styling import BaseStylingBlock


class GridChoiceBlock(blocks.MultipleChoiceBlock):
    choices = [
        ("col-12", _("12 columns")),
        ("col-11", _("11 columns")),
        ("col-10", _("10 columns")),
        ("col-9", _("9 columns")),
        ("col-8", _("8 columns")),
        ("col-7", _("7 columns")),
        ("col-6", _("6 columns")),
        ("col-5", _("5 columns")),
        ("col-4", _("4 columns")),
        ("col-3", _("3 columns")),
        ("col-2", _("2 columns")),
        ("col-1", _("1 columns")),
        ("col-md-12", _("12 columns from tablet size")),
        ("col-md-11", _("11 columns from tablet size")),
        ("col-md-10", _("10 columns from tablet size")),
        ("col-md-9", _("9 columns from tablet size")),
        ("col-md-8", _("8 columns from tablet size")),
        ("col-md-7", _("7 columns from tablet size")),
        ("col-md-6", _("6 columns from tablet size")),
        ("col-md-5", _("5 columns from tablet size")),
        ("col-md-4", _("4 columns from tablet size")),
        ("col-md-3", _("3 columns from tablet size")),
        ("col-md-2", _("2 columns from tablet size")),
        ("col-md-1", _("1 columns from tablet size")),
        ("col-lg-12", _("12 columns from large screen size")),
        ("col-lg-11", _("11 columns from large screen size")),
        ("col-lg-10", _("10 columns from large screen size")),
        ("col-lg-9", _("9 columns from large screen size")),
        ("col-lg-8", _("8 columns from large screen size")),
        ("col-lg-7", _("7 columns from large screen size")),
        ("col-lg-6", _("6 columns from large screen size")),
        ("col-lg-5", _("5 columns from large screen size")),
        ("col-lg-4", _("4 columns from large screen size")),
        ("col-lg-3", _("3 columns from large screen size")),
        ("col-lg-2", _("2 columns from large screen size")),
        ("col-lg-1", _("1 columns from large screen size")),
    ]

    def value_from_form(self, value):
        "we need to store the value as a string"
        return " ".join(value)

    def value_for_form(self, value):
        "We need to make sure that the value is a list"
        if value is None:
            return value
        if isinstance(value, (list, tuple)):
            return value
        return value.split()


class RoadRunnerStreamBlock(blocks.StreamBlock):
    class Meta:
        label = None


class RoadRunnerBaseBlock(blocks.StructBlock):
    grid = GridChoiceBlock(
        label="Breedte kolom", help_text="De breedte kolommen (*/12)."
    )
    content = RoadRunnerStreamBlock()
    styling = BaseStylingBlock()

    class Meta:
        icon = "grip"
        preview = "content"


class RoadrunnerRowBlock(ListBlock):
    class Meta:
        icon = "placeholder"


class FixedWidthRowBlock(RoadrunnerRowBlock):
    class Meta:
        template = "streamfields/bootstrap/container.html"
        icon = "fa-th-large"
        label = "Boxed"


class FullWidthRowBlock(RoadrunnerRowBlock):
    class Meta:
        template = ("streamfields/bootstrap/container_fluid.html",)
        icon = "fa-th"
        label = "Full"


register(RoadRunnerStreamBlockAdapter(), RoadRunnerStreamBlock)
register(RoadRunnerBaseBlockAdapter(), RoadRunnerBaseBlock)
register(RoadrunnerRowBlockAdapter(), RoadrunnerRowBlock)
register(GridChoiceBlockAdapter(), GridChoiceBlock)
