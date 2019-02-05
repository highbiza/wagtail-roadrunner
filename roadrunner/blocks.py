import uuid

from django import forms
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.forms import ChoiceField

from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock


class MultipleChoiceField(ChoiceField):
    pass


class MultipleChoiceBlock(blocks.ChoiceBlock):
    many = True

    def __init__(self, *args ,**kwargs):
        super().__init__(*args ,**kwargs)
        choices = self._constructor_kwargs.get('choices')
        help_text = self._constructor_kwargs.get('help_text')
        required = self._constructor_kwargs.get('required')
        label = self._constructor_kwargs.get('label')

        self.field = MultipleChoiceField(
            choices=choices,
            help_text=help_text,
            required=required,
            label=label,
        )

    def to_python(self, value):
        if isinstance(value, str):
            return value
        return " ".join(value)


class BootstrapColorChoiceBlock(blocks.ChoiceBlock):
    choices = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('danger', 'Danger'),
    ]


class ColorPickerBlock(blocks.CharBlock):
    pass


BACKGROUND_CHOICES = [
    ('bg-primary', 'Primary achtergrond'),
    ('bg-secondary', 'Secondary achtergrond'),
    ('bg-light', 'Light achtergrond'),
    ('bg-dark', 'Dark achtergrond'),
    ('bg-info', 'Info achtergrond'),
    ('bg-success', 'Success achtergrond'),
    ('bg-warning', 'Warning achtergrond'),
    ('bg-danger', 'Danger achtergrond'),
]

DEFAULT_CHOICES = [
    ('%s-1', 'Overal 1x %s'),
    ('%s-2', 'Overal 2x %s'),
    ('%s-3', 'Overal 3x %s'),
    ('%s-4', 'Overal 4x %s'),
    ('%s-5', 'Overal 5x %s'),

    ('%sx-1', 'Links/rechts 1x %s'),
    ('%sx-2', 'Links/rechts 2x %s'),
    ('%sx-3', 'Links/rechts 3x %s'),
    ('%sx-4', 'Links/rechts 4x %s'),
    ('%sx-5', 'Links/rechts 5x %s'),

    ('%sl-1', 'Links 1x %s'),
    ('%sl-2', 'Links 2x %s'),
    ('%sl-3', 'Links 3x %s'),
    ('%sl-4', 'Links 4x %s'),
    ('%sl-5', 'Links 5x %s'),

    ('%sr-1', 'Rechts 1x %s'),
    ('%sr-2', 'Rechts 2x %s'),
    ('%sr-3', 'Rechts 3x %s'),
    ('%sr-4', 'Rechts 4x %s'),
    ('%sr-5', 'Rechts 5x %s'),

    ('%sy-1', 'Boven/onder 1x %s'),
    ('%sy-2', 'Boven/onder 2x %s'),
    ('%sy-3', 'Boven/onder 3x %s'),
    ('%sy-4', 'Boven/onder 4x %s'),
    ('%sy-5', 'Boven/onder 5x %s'),

    ('%st-1', 'Boven 1x %s'),
    ('%st-2', 'Boven 2x %s'),
    ('%st-3', 'Boven 3x %s'),
    ('%st-4', 'Boven 4x %s'),
    ('%st-5', 'Boven 5x %s'),

    ('%sb-1', 'Onder 1x %s'),
    ('%sb-2', 'Onder 2x %s'),
    ('%sb-3', 'Onder 3x %s'),
    ('%sb-4', 'Onder 4x %s'),
    ('%sb-5', 'Onder 5x %s'),
]


def get_choices(type):
    return [
        (key % type[0], value % type) for key, value in DEFAULT_CHOICES
    ]


class BaseStylingBlock(blocks.StructBlock):
    margin = blocks.ChoiceBlock(
        label="Margin",
        required=False,
        choices=get_choices("margin"),
    )
    padding = blocks.ChoiceBlock(
        label="Padding",
        required=False,
        choices=get_choices("padding"),
    )
    border = blocks.ChoiceBlock(
        label="Border",
        required=False,
        choices=[
            ('border border-primary', 'Primary rand'),
            ('border border-secondary', 'Secondary rand'),
            ('border border-light', 'Light rand'),
            ('border border-dark', 'Dark rand'),
            ('border border-info', 'Info rand'),
            ('border border-success', 'Success rand'),
            ('border border-warning', 'Warning rand'),
            ('border border-danger', 'Danger rand'),
        ],
    )
    border_radius = blocks.ChoiceBlock(
        label="Border radius",
        required=False,
        choices=[
            ('rounded', 'Rond'),
            ('rounded-top', 'Boven rond'),
            ('rounded-bottom', 'Onder rond'),
            ('rounded-left', 'Links rond'),
            ('rounded-right', 'Rechts rond'),
            ('rounded-circle', 'Cirkel'),
            ('rounded-pill', 'Pill'),
        ]
    )
    background_color = ColorPickerBlock(
        label="Achtergrond kleur",
        max_length=255,
        required=False
    )
    color = ColorPickerBlock(label="Font kleur", max_length=255, required=False)
    font_size = blocks.IntegerBlock(label="Font grootte", required=False)
    text_align = blocks.ChoiceBlock(
        choices=[("left", "Links"), ("right", "Rechts"), ("center", "Midden")],
        label="Uitlijning van tekst",
        required=False,
    )
    block_classes = blocks.CharBlock(
        label='CSS classes',
        max_length=255,
        required=False,
    )

    class Meta:
        label = "Styling"


# HTML

class HeaderBlock(blocks.StructBlock):
    HEADER_CHOICES = (
        ("h1", "H1"),
        ("h2", "H2"),
        ("h3", "H3"),
        ("h4", "H4"),
        ("h5", "H5"),
        ("h6", "H6"),
    )
    heading_type = blocks.ChoiceBlock(
        choices=HEADER_CHOICES, label="Header", default="h1"
    )
    text = blocks.CharBlock(
        label="Tekst", help_text="Tekst in de header", max_length=255
    )
    styling = BaseStylingBlock()


class RichText(blocks.StructBlock):
    block_text = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van het tekstblok", required=False
    )

    styling = BaseStylingBlock()


class TextBlock(blocks.StructBlock):
    text = blocks.TextBlock(label="Tekst")
    styling = BaseStylingBlock()


class ScriptBlock(blocks.StructBlock):
    script = blocks.TextBlock(label="Script", required=False)
    src = blocks.CharBlock(required=False)


class DividerBlock(blocks.StructBlock):
    border_top_width = blocks.CharBlock(
        max_length=255, label="Hoogte", help_text="CSS Syntax (bv. 5px)"
    )
    width = blocks.CharBlock(
        max_length=255, label="Breedte", help_text="CSS Syntax (bv. 100% of 100px)"
    )
    styling = BaseStylingBlock()


class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(
        max_length=255,
        label="Alt.",
        help_text="Optioneel, afbeelding alt tekst",
        required=False,
    )
    styling = BaseStylingBlock()


class VideoBlock(blocks.StructBlock):
    url = blocks.CharBlock(
        label="URL", help_text="Het adres van een site, de domeinnaam.", max_length=255
    )
    styling = BaseStylingBlock()


# Bootstrap

class ButtonBlock(blocks.StructBlock):
    btn_class = BootstrapColorChoiceBlock(label="Kleur van de knop")
    page = blocks.PageChooserBlock(label="Pagina")
    styling = BaseStylingBlock()


class TabBlock(blocks.StructBlock):
    tab_header = blocks.CharBlock(
        max_length=50, label="Tekst", help_text="Header van de tab."
    )
    badge = blocks.CharBlock(
        max_length=50,
        label="Badge",
        help_text="Tekst in een badge van de tabheader.",
        required=False,
    )
    tab_content = blocks.RichTextBlock(label="Inhoud", help_text="Inhoud van de tab.")
    styling = BaseStylingBlock()


class BreadcrumbBlock(blocks.StructBlock):
    pair_icon = blocks.CharBlock(
        max_length=5,
        label="Koppelteken",
        help_text="Optioneel. Standaard: /",
        required=False,
    )
    styling = BaseStylingBlock()


class JumbotronBlock(blocks.StructBlock):
    header = blocks.CharBlock(
        max_length=255, label="Header", help_text="Header van de jumbotron."
    )
    html = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van de tab.", required=False
    )
    styling = BaseStylingBlock()


class ThumbnailBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    caption = blocks.RichTextBlock(
        label="Caption", help_text="Caption van de thumbnail.", required=False
    )
    text = blocks.CharBlock(
        max_length=50, label="Tekst", help_text="Tekst op de knop.", required=False
    )
    attributes = blocks.CharBlock(
        max_length=255,
        label="Attributen",
        help_text='Attributen van de knop (zoals href="https://uwkm.nl/").',
        required=False,
    )
    button_class = BootstrapColorChoiceBlock(
        label="Kleur", help_text="Kleur van de knop.", required=False
    )
    styling = BaseStylingBlock()


class CardBlock(blocks.StructBlock):
    color = BootstrapColorChoiceBlock(label="Kleur", help_text="Kleur van card.", required=False)
    header = blocks.CharBlock(
        max_length=255, label="Header", help_text="Header van card", required=False
    )
    card_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van card", required=False
    )
    footer = blocks.CharBlock(
        max_length=255, label="Footer", help_text="Footer van card", required=False
    )
    styling = BaseStylingBlock()


class EmbedBlock(blocks.StructBlock):
    url = blocks.CharBlock(
        max_length=255, label="URL", help_text="Link naar het bestand"
    )
    styling = BaseStylingBlock()


class ModalBlock(blocks.StructBlock):
    text = blocks.CharBlock(
        max_length=50, label="Tekst", help_text='Tekst op de knop. Zoals "Open modal"'
    )
    button_class = BootstrapColorChoiceBlock()
    modal_header = blocks.CharBlock(
        max_length=255, label="Header", help_text="Header in de modal.", required=False
    )
    modal_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van de modal"
    )
    modal_footer = blocks.CharBlock(
        max_length=255, label="Footer", help_text="Footer in de modal.", required=False
    )
    styling = BaseStylingBlock()


class CarouselBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    caption = blocks.RichTextBlock(
        label="Caption", help_text="Caption van de slide.", required=False
    )
    styling = BaseStylingBlock()


class AccordionBlock(blocks.StructBlock):
    panel_color = BootstrapColorChoiceBlock(
        label="Kleur", help_text="Kleur van accordion.", required=False
    )
    header = blocks.CharBlock(
        max_length=255, label="Header", help_text="Header van accordion", required=False
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van accordion", required=False
    )
    footer = blocks.CharBlock(
        max_length=255, label="Footer", help_text="Footer van accordion", required=False
    )
    styling = BaseStylingBlock()

    def get_uuid(self):
        return uuid.uuid4()


class GridChoiceBlock(blocks.ChoiceBlock):
    choices = [
        ("12", "12"),
        ("11", "11"),
        ("10", "10"),
        ("9", "9"),
        ("8", "8"),
        ("7", "7"),
        ("6", "6"),
        ("5", "5"),
        ("4", "4"),
        ("3", "3"),
        ("2", "2"),
        ("1", "1"),
    ]


preset_blocks = [
    # html
    (
        "header",
        HeaderBlock(
            template="streamfields/html/header.html",
            icon="title",
            roadrunner_options={
                "group": "HTML",
                "title": "text",
            }
        ),
    ),
    (
        "divider",
        DividerBlock(
            template="streamfields/html/divider.html",
            icon="horizontalrule",
            roadrunner_options={
                "group": "HTML",
            }
        ),
    ),
    (
        "image",
        ImageBlock(
            template="streamfields/html/image.html",
            icon="fa-camera-retro",
            roadrunner_options={
                "group": "HTML",
                "title": "alt",
            }
        ),
    ),
    (
        "video",
        VideoBlock(
            template="streamfields/html/video.html",
            icon="fa-video-camera",
            roadrunner_options={
                "group": "HTML",
                "title": "url",
            }
        ),
    ),
    (
        "text",
        TextBlock(
            template="streamfields/html/text.html",
            icon="fa-align-left",
            roadrunner_options={
                "group": "HTML",
                "title": "text",
            }
        ),
    ),
    (
        "richtext",
        RichText(
            template="streamfields/html/richtext.html",
            icon="fa-align-left",
            roadrunner_options={
                "group": "HTML",
                "title": "block_text",
            }
        ),
    ),
    (
        "html",
        TextBlock(
            template="streamfields/html/html.html",
            icon="fa-html5",
            roadrunner_options={
                "group": "HTML",
                "title": "text",
            }
        ),
    ),
    (
        "script",
        ScriptBlock(
            template="streamfields/html/script.html",
            icon="fa-code",
            roadrunner_options={
                "group": "HTML",
                "title": "script",
            }
        ),
    ),
    # bootstrap
    (
        "button",
        ButtonBlock(
            template="streamfields/bootstrap/button.html",
            icon="fa-hand-pointer-o",
            roadrunner_options={
                "group": "Bootstrap",
            }
        )
    ),
    (
        "breadcrumb",
        BreadcrumbBlock(
            template="streamfields/bootstrap/breadcrumb.html",
            icon="fa-chevron-right",
            roadrunner_options={
                "group": "Bootstrap",
            }
        ),
    ),
    (
        "jumbotron",
        JumbotronBlock(
            template="streamfields/bootstrap/jumbotron.html",
            icon="fa-file",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "header",
            }
        ),
    ),
    (
        "thumbnail",
        ThumbnailBlock(
            template="streamfields/bootstrap/thumbnail.html",
            icon="fa-camera",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "text",
            }
        ),
    ),
    (
        "card",
        CardBlock(
            template="streamfields/bootstrap/card.html",
            icon="fa-columns",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "header",
            }
        ),
    ),
    (
        "embed",
        EmbedBlock(
            template="streamfields/bootstrap/embed.html",
            icon="fa-terminal",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "url",
            }
        ),
    ),
    (
        "modal",
        ModalBlock(
            template="streamfields/bootstrap/modal.html",
            icon="fa-window-restore",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "text",
            }
        ),
    ),
    (
        "accordion",
        AccordionBlock(
            template="streamfields/bootstrap/accordion.html",
            icon="fa-bars",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "header",
            }
        ),
    ),
    # ListBlocks,
    (
        "nav_pills",
        blocks.ListBlock(
            TabBlock(),
            template="streamfields/bootstrap/nav_pills.html",
            icon="fa-bars",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "tab_header",
            }
        ),
    ),
    (
        "nav_tabs",
        blocks.ListBlock(
            TabBlock(),
            template="streamfields/bootstrap/nav_tabs.html",
            icon="fa-list",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "tab_header",
            }
        ),
    ),
    (
        "carousel",
        blocks.ListBlock(
            CarouselBlock(),
            template="streamfields/bootstrap/carousel.html",
            icon="fa-picture-o",
            roadrunner_options={
                "group": "Bootstrap",
                "title": "caption",
            }
        ),
    ),
]


class StreamBlock(blocks.StreamBlock):

    def additional_child_blocks(self):
        from roadrunner import registered_blocks
        from roadrunner.models import Block

        streamfields = Block.get_streamfields()

        for name, block in registered_blocks:
            block.set_name(name)
            streamfields[name] = block

        return streamfields


    def to_python(self, value):
        child_blocks = self.child_blocks
        child_blocks.update(self.additional_child_blocks())
        return blocks.StreamValue(self, [
            child_data for child_data in value
            if child_data['type'] in child_blocks
        ], is_lazy=True)


class RoadRunnerBaseBlock(blocks.StructBlock):
    title = blocks.CharBlock(max_length=50, required=False, classname="grid-title")
    grid = GridChoiceBlock(
        label="Breedte kolom", help_text="De breedte kolommen (*/12)."
    )
    content = StreamBlock(
        getattr(settings, 'ROADRUNNER_CONTENT_BLOCKS', preset_blocks),
        label="Inhoud",
    )
    styling = BaseStylingBlock()

    def __init__(self, roadrunner_blocks, *args, **kwargs):
        super().__init__(*args, **kwargs)
        content_child_blocks = self.child_blocks["content"].child_blocks
        if not content_child_blocks:
            for name, block in roadrunner_blocks:
                block.set_name(name)
                content_child_blocks[name] = block


class ModelChoiceBlock(blocks.FieldBlock):

    def __init__(self, model, required=True, help_text=None, **kwargs):
        self._required = required
        self._help_text = help_text
        self._model = model
        super().__init__(**kwargs)

    def get_queryset(self):
        model = self._model
        if isinstance(model, str):
            app_label, model_name = model.split('.')
            model_type = ContentType.objects.get(
                app_label=app_label,
                model=model_name
            )
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
        except:
            return
        else:
            return value


class TemplateBlock(blocks.StructBlock):
    template = ModelChoiceBlock(model='roadrunner.template')

