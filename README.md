wagtail-roadrunner
==================

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
============

To install the latest version from pypi

```
pip install wagtail-roadrunner
```

Now add the roadrunner app to your ``INSTALLED_APPS`` setting in your django settings:

```python
INSTALLED_APPS = [
    # all kinds of apps
    # And now ad the roadrunner app like this:
    "rr", 
    # Add table block if you plan on using our table block.
    "wagtail.contrib.table_block",
]
```

Usage
=====

wagtail-roadrunner comes with a new streamfield type, ``RoadRunnerField`` which
can be used in a wagtail page like this:

```python
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

```python
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

```python
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

```python
ROADRUNNER_REGISTRY_FUNCTION = "myproject.registry.register_custom_blocks"
```

Making previews
===============

We don't want to display the full block form in the page editor, just a small
preview that is enough for a user to be able to recognise the content. There are
3 ways to define a preview for your block, from simple to advanced these are:

1. Use the ``meta.preview`` property, that lists the fields you want to show.
2. Define ``meta.preview_template``.
3. Add a ``renderPreview`` method to your telepath Block definition in javascript.

The preview property
--------------------

Using the ``meta.preview`` property is done like this:

```python
class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock()
    alt = blocks.CharBlock(
        max_length=255,
        label="Alt.",
        help_text="Optioneel, afbeelding alt tekst",
        required=False,
    )
    lazy = blocks.BooleanBlock(label="Lazy", default=False, required=False)
    page_url = blocks.PageChooserBlock(label="Pe url", required=False)
    external_url = blocks.CharBlock(label="External link", required=False)
    open_in_new_tab = blocks.BooleanBlock(
        label="Open in een nieuwe tab", required=False
    )

    class Meta:
        preview = ["image"]
```

This block has a lot of fields that are more configuration than content. For a
user it is enough to just show the image as the preview. This is easily achieved
by specifying the ``meta.preview`` property as:

```python
    class Meta:
        preview = ["image"]
```

That reduces the clutter in the page editor interface by a lot! Instead of
showing all the form fields on the page, we just show the most important field
that makes the content recognisable for the user. The ``meta.preview`` property
is a list, suppose we also want to make the ``alt`` field visible to the user,
we could change it to:

```python
    class Meta:
        preview = ["image", "alt"]
```

The preview_template property
-----------------------------

Using the ``meta.preview_template`` property is done like this:

```python
class AccordionBlock(blocks.StructBlock):
    header = blocks.CharBlock(
        max_length=255,
        label="Title",
        help_text="Header of the accordion",
        required=False,
    )
    panel_content = blocks.RichTextBlock(
        label="Inhoud", help_text="Body of the accordion", required=False
    )

    class Meta:
        preview_template = "preview/bootstrap/accordion.html"
```

``meta.preview_template`` defines the preview template for this specific block as
preview/bootstrap/accordion.html. This template will be used to render the preview.
``preview_template`` acts much the same as ``form_template``
(see https://docs.wagtail.org/en/latest/advanced_topics/customisation/streamfield_blocks.html#how-to-build-custom-streamfield-blocks).
The template context is the same, with the most important variable:

```
    children
     An OrderedDict of BoundBlocks for all of the child blocks making up this StructBlock.
```

While the preview does not actually render any forms, the same ``render_form``
method should be used to render the preview of a formfield in the ``preview_template``.

```html
<div class="accordion_preview">
    {{ children.header.render_form }}
    {{ children.panel_content.render_form }}
</div>

```

Here you can add your own (bootstrap) classes and/or html tags to mirror the output of
your block. The fields are always accessed like this:

```
    children.field_name.render_form
```

The renderPreview method
------------------------

You can create your own preview UI in javascript by registering your own block
definition with telepath. To do this, you can either install wagtail-roadrunner
as a dependency in your javascript project like this:

```
npm add highbiza/wagtail-roadrunner
```

This will add the wagtail-roadrunner github repo's javascript to your project.
Now you can import the classes from wagtail-roadrunner in your js files.

Alternatively you can use the exported symbols on window, the entire library is
available as ``window.roadrunner``, the same as ``wagtailStreamField``.

Wagtail-roadrunner does use jsx, but without React because the way wagtail's
widgets work. They need to be rendered immediately into a placeholder div,
which would become very tedious in React. wagtail-roadrunner uses jsx-render,
which provides a jsx renderer implementation. Use the ``renderInPlaceHolder``
and ``PlaceHolder`` utils from roadrunner in your project.

Here is an example of the ``PageTitle`` UI, shipped with roadrunner but
modified to fit in your project. It has been changed to Use a ``<heading>``
instead of a ``<h1>``. We could have subclasses the existing PageTitle js,
but this is more similar to how things would look for a completely custom
component started from scratch.

```jsx
import $ from "jquery"
import dom, { Fragment } from 'jsx-render'

import { renderInPlaceHolder, PlaceHolder } from "roadrunner/jsx"
import { Preview } from "roadrunner/preview/render"

/**
 * or you could also import these symbols from window like this:
 */
 
const {
    roadrunner: {
        jsx: { renderInPlaceHolder, PlaceHolder },
        preview: {
            render: { Preview }
        }
    }
} = window

/**
 * now you can use the imported symbols and write your own code:
 */

class MyPageTitle extends Preview {
  getValue() {
    return $("h1").first()
      .text()
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    return renderInPlaceHolder(previewPlaceholder,
      <Fragment>
        <div id={prefix} class="preview-label">
          <heading>{this.getValue()}</heading>
        </div>
        <PlaceHolder/>
      </Fragment>
    )
  }
}

export class MyPageTitleDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new PageTitle(this, previewPlaceholder, prefix, initialState, initialError)
  }
}

// register the MyPageTitleDefinition class with telepath as "myproject.PageTitleDefinition"
window.telepath.register("myproject.PageTitleDefinition", MyPageTitleDefinition)
```

To use this code, we should register an ``Adapter`` with telepath. Let's not
start from scratch, but override the adapter shipped with roadrunner. It is
always best to find out which Adapter is used in wagtail for similar components
and subclass the Adapter for that type:

```python
from rr.adapters import PageTitleAdapter

class MyCustomPageTitleAdapter(PageTitleAdapter):
    js_constructor = "myproject.PageTitleDefinition"
```

To register the Adapter, which will make wagtail use our javascript for
objects of the registered type, we need to descide if we want to use it in a
narrow or wide scope.

Wide scope means, everywhere in wagtail, when a object of this type is encountered,
use this javascript. Narrow scope means only when encountered in a roadrunner
context, use this javascript.

Narrow registration:

```python
from rr.telepath import register
from rr.blocks.html import PageTitle
register(MyCustomPageTitleAdapter(), PageTitle)
```

If we want to use this code everywhere, just do:

```python
from wagtail.core.telepath import register
from rr.blocks.html import PageTitle
register(MyCustomPageTitleAdapter(), PageTitle)
```

Block searchable content
---------------------------------
By default, wagtail will index all blocks that have implemented the get_searchable_content method. It could be that not all fields on a block are meant to be searchable content. In that case you should make your own get_searchable_content implementation.

In our default blocks, we have implemented the get_searchable_content method already, ignoring fields that should not be searched.

To make implementing your own ```get_searchable_content``` easier, we have added a utility function for you in ```rr.search```:
```python
def get_searchable_content_for_fields(value, child_blocks, index_fields):
    content = []
    for block_key, block in child_blocks.items():
        if block_key in index_fields:
            content.extend(block.get_searchable_content(value[block_key]))
    return content
```

We use this in the ```SliderChildBlock``` and ```HeaderBlock``` block.
