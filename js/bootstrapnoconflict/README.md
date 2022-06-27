# Bootstrap noconflict

## Javascript

It is very unfortunate that this is needed.
What is in this folder, is the exact files from bootstrap for the collapse and
tab functionality, with 1 minor change, the jquery plugin registration was
removed. The plugin registration conflicts with wagtail, which still uses
bootstrap 3 tabs and has a custom implementation for collapse.

We need to use the bootstrap5 tabs and collapse because it works much better
with nesting.

There is another way to disable the jquery plugin registration.
If we could add the following code to the body element of a page that has
roadrunner, we could remove the js files::

    data-bs-no-jquery="true"

This will disabled the plugin registration as well.

## CSS

The CSS files include bootstrap in the scope of preview components, so it is
easier to write previews using modern bootstrap, which is also used on the
frontend.
