# # -*- coding: utf-8 -*-
#
# from django.conf.urls import include, url
#
# try:
#     from django.contrib.staticfiles.templatetags.staticfiles import static
# except ImportError:
#     from django.templatetags.static import static
#
from wagtail.core import hooks

#
# import roadrunner.urls
#
#
# def roadrunner_css():
#     return '<link href="{href}" rel="stylesheet">'.format(
#         href=static("roadrunner/css/roadrunner.css")
#     )
#
#
# def roadrunner_grid_css():
#     return '<link href="{href}" rel="stylesheet">'.format(
#         href=static("roadrunner/css/grid.css")
#     )
#
#
# def roadrunner_widgets_css():
#     return '<link href="{href}" rel="stylesheet">'.format(
#         href=static("roadrunner/css/widgets.css")
#     )
#
#
# def roadrunner_colorpicker_css():
#     return '<link href="{href}" rel="stylesheet">'.format(
#         href=static("roadrunner/plugins/colorpicker/css/colorpicker.css")
#     )
#
#
# def roadrunner_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("roadrunner/js/roadrunner.js")
#     )
#
#
# def roadrunner_widgets_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("roadrunner/js/widgets.js")
#     )
#
#
# def roadrunner_colorpicker_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("roadrunner/plugins/colorpicker/js/colorpicker.js")
#     )
#
#
# @hooks.register("insert_editor_css")
# def css():
#     return (
#         roadrunner_css()
#         + roadrunner_grid_css()
#         + roadrunner_widgets_css()
#         + roadrunner_colorpicker_css()
#     )
#
#
# @hooks.register("insert_editor_js")
# def js():
#     return roadrunner_js() + roadrunner_widgets_js() + roadrunner_colorpicker_js()
#
#
# # --- wagtail
#
#
# def wagtail_draftail_css():
#     return '<link href="{href}" rel="stylesheet">'.format(
#         href=static("wagtailadmin/css/panels/draftail.css")
#     )
#
#
# def wagtail_image_chooser_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailimages/js/image-chooser.js")
#     )
#
#
# def wagtail_image_chooser_modal_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailimages/js/image-chooser-modal.js")
#     )
#
#
# def wagtail_page_chooser_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailadmin/js/page-chooser.js")
#     )
#
#
# def wagtail_page_chooser_modal_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailadmin/js/page-chooser-modal.js")
#     )
#
#
# def wagtail_document_chooser_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtaildocs/js/document-chooser.js")
#     )
#
#
# def wagtail_document_chooser_modal_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtaildocs/js/document-chooser-modal.js")
#     )
#
#
# def wagtail_draftail_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailadmin/js/draftail.js")
#     )
#
#
# def wagtail_embed_chooser_modal_js():
#     return '<script type="text/javascript" src="{src}"></script>'.format(
#         src=static("wagtailembeds/js/embed-chooser-modal.js")
#     )
#
#
# @hooks.register("insert_editor_js")
# def wagtail():
#     return (
#         wagtail_draftail_css()
#         + wagtail_image_chooser_js()
#         + wagtail_image_chooser_modal_js()
#         + wagtail_page_chooser_js()
#         + wagtail_page_chooser_modal_js()
#         + wagtail_draftail_js()
#         + wagtail_document_chooser_js()
#         + wagtail_document_chooser_modal_js()
#         + wagtail_embed_chooser_modal_js()
#     )
#
#
# @hooks.register("register_admin_urls")
# def urlconf_time():
#     return [url(r"^_roadrunner/", include(roadrunner.urls, namespace="roadrunner"))]


@hooks.register("register_icons")
def register_roadrunner_icons(icons):
    icons.extend(
        [
            "roadrunner/icons/laptop.svg",
            "roadrunner/icons/mobile.svg",
            "roadrunner/icons/palette.svg",
            "roadrunner/icons/tablet.svg",
            "roadrunner/icons/tv.svg",
            "roadrunner/icons/layout.svg",
        ]
    )
    return icons
