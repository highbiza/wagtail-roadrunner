from wagtail.core import blocks

from rr.telepath import register
from rr.adapters import ColorPickerBlockAdapter


DEFAULT_CHOICES = [
    ("%s-1", "Overal 1x %s"),
    ("%s-2", "Overal 2x %s"),
    ("%s-3", "Overal 3x %s"),
    ("%s-4", "Overal 4x %s"),
    ("%s-5", "Overal 5x %s"),
    ("%sx-1", "Links/rechts 1x %s"),
    ("%sx-2", "Links/rechts 2x %s"),
    ("%sx-3", "Links/rechts 3x %s"),
    ("%sx-4", "Links/rechts 4x %s"),
    ("%sx-5", "Links/rechts 5x %s"),
    ("%sl-1", "Links 1x %s"),
    ("%sl-2", "Links 2x %s"),
    ("%sl-3", "Links 3x %s"),
    ("%sl-4", "Links 4x %s"),
    ("%sl-5", "Links 5x %s"),
    ("%sr-1", "Rechts 1x %s"),
    ("%sr-2", "Rechts 2x %s"),
    ("%sr-3", "Rechts 3x %s"),
    ("%sr-4", "Rechts 4x %s"),
    ("%sr-5", "Rechts 5x %s"),
    ("%sy-1", "Boven/onder 1x %s"),
    ("%sy-2", "Boven/onder 2x %s"),
    ("%sy-3", "Boven/onder 3x %s"),
    ("%sy-4", "Boven/onder 4x %s"),
    ("%sy-5", "Boven/onder 5x %s"),
    ("%st-1", "Boven 1x %s"),
    ("%st-2", "Boven 2x %s"),
    ("%st-3", "Boven 3x %s"),
    ("%st-4", "Boven 4x %s"),
    ("%st-5", "Boven 5x %s"),
    ("%sb-1", "Onder 1x %s"),
    ("%sb-2", "Onder 2x %s"),
    ("%sb-3", "Onder 3x %s"),
    ("%sb-4", "Onder 4x %s"),
    ("%sb-5", "Onder 5x %s"),
]


def get_choices(t):
    return [(key % t[0], value % t) for key, value in DEFAULT_CHOICES]


class ColorPickerBlock(blocks.CharBlock):
    pass


register(ColorPickerBlockAdapter(), ColorPickerBlock)


class StylingBlock(blocks.StructBlock):
    margin = blocks.ChoiceBlock(
        label="Margin", required=False, choices=get_choices("margin")
    )
    padding = blocks.ChoiceBlock(
        label="Padding", required=False, choices=get_choices("padding")
    )
    border = blocks.ChoiceBlock(
        label="Border",
        required=False,
        choices=[
            ("border border-primary", "Primary rand"),
            ("border border-secondary", "Secondary rand"),
            ("border border-light", "Light rand"),
            ("border border-dark", "Dark rand"),
            ("border border-info", "Info rand"),
            ("border border-success", "Success rand"),
            ("border border-warning", "Warning rand"),
            ("border border-danger", "Danger rand"),
        ],
    )
    border_radius = blocks.ChoiceBlock(
        label="Border radius",
        required=False,
        choices=[
            ("rounded", "Rond"),
            ("rounded-top", "Boven rond"),
            ("rounded-bottom", "Onder rond"),
            ("rounded-left", "Links rond"),
            ("rounded-right", "Rechts rond"),
            ("rounded-circle", "Cirkel"),
            ("rounded-pill", "Pill"),
        ],
    )
    background_color = ColorPickerBlock(
        label="Achtergrond kleur", max_length=255, required=False
    )
    color = ColorPickerBlock(label="Font kleur", max_length=255, required=False)
    font_size = blocks.IntegerBlock(label="Font grootte", required=False)
    text_align = blocks.ChoiceBlock(
        choices=[("left", "Links"), ("right", "Rechts"), ("center", "Midden")],
        label="Uitlijning van tekst",
        required=False,
    )
    block_classes = blocks.CharBlock(
        label="CSS classes", max_length=255, required=False
    )

    class Meta:
        label = "Styling"
