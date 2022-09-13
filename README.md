wagtail-roadrunner
------------------

Wagtail-roadrunner is a new type of page editor for wagtail. With the
wagtail-roadrunner interface, blocks can be laid out in a grid instead of in
a single horizontal sequence. The grid in wagtail-roadrunner is the bootstrap grid,
so it has 12 segments per row. Columns can be specified with widths from 1-12 segments.

Columns are laid out horizontally in rows, and blocks can be added to each column
which will be placed in the column below each other.

Wagtail-roadrunner is not a full custom user interface for wagtail, it is just a
new type of streamfield type, which has it's own rendering using telepath.

So the grid interface can be mixed on pages with the standard interface.

To make the editing interface as uncluttered as possible, wagtail-roadrunner does
not display the full block form when opening a page. Instead a preview of the
content is displayed and the editing interface is opened when cliking on a block.

This make it easier to find the content you want to change, while offering a
large editing window with the block forms. Columns would simply become too
narrow to fit the full form interface.

Wagtail-roadrunner offers a couple of ways for you to define previews for your
blocks, which are documented below.

Installation
------------

To install the latest version from pypi

```
pip install wagtail-roadrunner
```

Now add the roadrunner app to your ``INSTALLED_APPS`` setting in your django settings:

```
INSTALLED_APPS = [
    # all kinds of apps
    # And now ad the roadrunner app like this:
    "rr", 
]
```

Usage
-----

wagtail-roadrunner comes with a new streamfield type, ``RoadRunnerField`` which
can be used in a wagtail page like this:

```
from wagtail.admin.edit_handlers import StreamFieldPanel
from wagtail.core.models import Page
from wagtail.wagtailsearch import index

from rr.fields import RoadRunnerField

class GridPage(Page):
    content = RoadRunnerField(null=True, blank=True)

    content_panels = Page.content_panels + [StreamFieldPanel("content")]

    search_fields = Page.search_fields + [
        index.SearchField("content", partial_match=True),
    ]

```

This will create a page with only one field, with the default blocks that ship
with wagtail-roadrunner. There are 2 ways to change the blocks offered to the user.

The first one is to just specify the blocks like in a StreamField:

```
from wagtail.admin.edit_handlers import StreamFieldPanel
from wagtail.core.models import Page
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

# your own code
from .myblocks import GalleryBlock


class GalleryPage(Page):
    gallery = RoadRunnerField(
        [
            ("paragraph", blocks.RichTextBlock()),
            ("heading", blocks.CharBlock()),
            ("image", ImageChooserBlock()),
            ("gallery", GalleryBlock()),
        ]
    )

    content_panels = Page.content_panels + [StreamFieldPanel("gallery")]
```

In this example, only 4 type of blocks will be available, but still laid out in
a grid.

It is also possible to change the default block set that is used by RoadRunnerField.
This way of registering blocks with wagtail-roadrunner makes reusing your blocks
easy. Making reuase easy, makes it worthwhile to spend some extra effort on your
blocks to make them as user freindly as possible.

To register blocks with wagtail-roadrunner you should define your own
``ROADRUNNER_REGISTRY_FUNCTION``.
This function is passed the default blocks that come with wagtail-roadrunner, so
if you want you can drop some functionality you don't need. Here is an example:

```
# a file named myproject/registry.py
from .myblocks import GalleryBlock, TetrisBlock


def register_custom_blocks(initial_blocks):
    initial_blocks  # or maybe filter the initial block to remove some?
    + [
        ("gallery", GalleryBlock()),
        ("tetris", TetrisBlock()),
    ]
```

You then have to register this function with wagtail-roadrunner as django setting
like this:

```
ROADRUNNER_REGISTRY_FUNCTION = "myproject.registry.register_custom_blocks"
```

Making previews
---------------

