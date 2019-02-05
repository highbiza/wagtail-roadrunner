# RoadRunner2.0 Bootstrap 4

Je eigen streamfields registreren
```python
from roadrunner import register_block
from wagtail.core import blocks


@register_block
class KoekoekBlock(blocks.StructBlock):
    pass


@register_block(name="koekoek")
class KoekoekBlock(blocks.StructBlock):
    pass


@register_block(template_name="streamfields/koekoek.html", label="Koekoek")
class KoekoekBlock(blocks.StructBlock):
    pass


@register_block(roadrunner_options=dict(group="koekoek"))
class KoekoekBlock(blocks.StructBlock):
    pass

```
