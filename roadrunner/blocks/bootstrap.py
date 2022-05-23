import uuid
from wagtail.core import blocks
from wagtail.images.blocks import ImageChooserBlock

from roadrunner.blocks.styling import BaseStylingBlock


class BootstrapColorChoiceBlock(blocks.ChoiceBlock):
    choices = [
        ("primary", "Primary"),
        ("secondary", "Secondary"),
        ("light", "Light"),
        ("dark", "Dark"),
        ("info", "Info"),
        ("success", "Success"),
        ("warning", "Warning"),
        ("danger", "Danger"),
    ]


class ButtonBlock(blocks.StructBlock):
    btn_class = BootstrapColorChoiceBlock(label="Kleur van de knop")
    page = blocks.PageChooserBlock(label="Pagina")
    styling = BaseStylingBlock()

    class Meta:
        group = "Bootstrap"


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

    class Meta:
        group = "Bootstrap"


class BreadcrumbBlock(blocks.StructBlock):
    pair_icon = blocks.CharBlock(
        max_length=5,
        label="Koppelteken",
        help_text="Optioneel. Standaard: /",
        required=False,
    )
    styling = BaseStylingBlock()

    class Meta:
        group = "Bootstrap"


class JumbotronBlock(blocks.StructBlock):
    header = blocks.CharBlock(
        max_length=255, label="Header", help_text="Header van de jumbotron."
    )
    html = blocks.RichTextBlock(
        label="Inhoud", help_text="Inhoud van de tab.", required=False
    )
    styling = BaseStylingBlock()

    class Meta:
        group = "Bootstrap"


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

    class Meta:
        group = "Bootstrap"


class CardBlock(blocks.StructBlock):
    color = BootstrapColorChoiceBlock(
        label="Kleur", help_text="Kleur van card.", required=False
    )
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

    class Meta:
        group = "Bootstrap"


class EmbedBlock(blocks.StructBlock):
    url = blocks.CharBlock(
        max_length=255, label="URL", help_text="Link naar het bestand"
    )
    styling = BaseStylingBlock()

    class Meta:
        group = "Bootstrap"


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

    class Meta:
        group = "Bootstrap"


class CarouselBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    url = blocks.URLBlock(required=False, help_text="Where the user goes on click.")
    caption = blocks.RichTextBlock(
        label="Caption", help_text="Caption van de slide.", required=False
    )
    styling = BaseStylingBlock()

    class Meta:
        group = "Bootstrap"


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

    class Meta:
        group = "Bootstrap"
