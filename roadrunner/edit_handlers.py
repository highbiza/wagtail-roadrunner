import json
import hashlib
import re

from django.contrib.contenttypes.models import ContentType
from django.utils.html import mark_safe
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.serializers.json import DjangoJSONEncoder

from wagtail.admin.edit_handlers import StreamFieldPanel
from wagtail.core.rich_text import features as feature_registry

from . import art


class RoadRunnerPanel(StreamFieldPanel):
    object_template = "roadrunner/roadrunner_panel.html"
    choice_table = {}

    def classes(self):
        return ["object", "road-runner"]

    def html_declarations(self):
        """
        RoadRunner does not use html declarations -- this lightens the
        load heavily.
        """
        return ""

    def render(self):
        context = {"field": self.bound_field, "roadrunner": self.run_road()}
        return mark_safe(render_to_string(self.object_template, context))

    def render_as_object(self):
        return self.render()

    def render_as_field(self):
        return self.render()

    def render_form_content(self):
        return self.render()

    def run_road(self):
        stream_data = getattr(self.instance, self.field_name).raw_data
        tree = self.get_stream_tree()
        context = {
            "tree": tree,
            "choices": self.choice_table,
            "stream_data": list(stream_data),
            "tree_name": self.field_name,
            "urls": self.get_urls(),
            "rich_text_opts": self.rich_text_opts(),
            "art": art,
        }
        context.update(self.get_additional_context())
        return json.dumps(context, cls=DjangoJSONEncoder)

    def get_additional_context(self):
        return {}

    def rich_text_opts(self):
        options = {}
        features = feature_registry.get_default_features()
        for feature in features:
            plugin = feature_registry.get_editor_plugin("draftail", feature)
            if plugin:
                plugin.construct_options(options)
        return json.dumps(options, cls=DjangoJSONEncoder)

    def get_urls(self):
        return {
            "page": reverse("roadrunner:page"),
            "image": reverse("roadrunner:image"),
            "document": reverse("roadrunner:document"),
            "product": reverse("roadrunner:product"),
        }

    def get_content_type(self):
        return ContentType.objects.get_for_model(self.model)

    def strip_script_tags(self, string):
        return re.compile(r"<script.*<\/script>").sub("", string)

    # Generate a tree from a given StreamBlock, containing all the underlying
    # fields. Updates self.choice_table in the process
    def generate_stream_tree(self, block):
        tree = {
            "name": block.name,
            "options": getattr(block.meta, "roadrunner_options", {}),
            "def": block.definition_prefix,
            "label": "",
            "icon": "",
            "type": block.__class__.__name__,
            "field": {},
            "children": [],
            "default": "",
        }

        child_blocks = []

        # Try to retrieve icon/label from _constructor_args
        if hasattr(block, "_constructor_args"):
            if len(block._constructor_args) > 1:  # pylint: disable=W0212
                args = block._constructor_args[1]  # pylint: disable=W0212
                if "icon" in args:
                    tree["icon"] = args["icon"]
                if "label" in args:
                    tree["label"] = args["label"]
                else:
                    tree["label"] = block.label
                if "default" in args:
                    tree["default"] = args["default"]

        # If a block has only one child, try to soak up the data
        # and then move on to processing the children of that child
        if hasattr(block, "child_block"):
            if hasattr(block.child_block, "child_blocks"):
                child_blocks = block.child_block.child_blocks
                if block.child_block.__class__.__bases__[0].__name__ == "StructBlock":
                    # the single child who's blocks we have soaked up is
                    # actually a struct
                    tree["hasStruct"] = True
            else:
                child_blocks = {block.child_block.name: block.child_block}
        elif hasattr(block, "child_blocks"):
            child_blocks = block.child_blocks

            if hasattr(block, "additional_child_blocks"):
                child_blocks.update(
                    block.additional_child_blocks()  # self.get_content_type()
                )

        # Add field information if this is, or extends a "primitive" field
        if hasattr(block, "field"):
            fields_to_grab = [
                "initial",
                "required",
                "help_text",
                "min_value",
                "max_value",
                "disabled",
                "stip",
                "min_length",
                "max_length",
                "empty_value",
                "default",
            ]
            tree["field"]["type"] = block.field.__class__.__name__

            for field in fields_to_grab:
                if hasattr(block.field, field) and getattr(block.field, field) not in [
                    False,
                    "",
                    None,
                ]:
                    tree["field"][field] = getattr(block.field, field)

            # Check if we're dealing with a choice field, in that case we have to
            # update the choices table. We're using this table because we want
            # to avoid duplicating data we send to the browser.
            choices = None

            if (
                not hasattr(block, "add_choices_to_source")
                or hasattr(block, "add_choices_to_source")
                and block.add_choices_to_source
            ):
                if hasattr(block.field, "_choices"):
                    choices = block.field._choices  # pylint: disable=W0212
                if hasattr(block.field, "choices"):
                    choices = block.field.choices
                if choices:
                    tmp = []
                    for key, val in choices:
                        tmp.append([str(key), str(val)])

                    choices_hash = hashlib.md5(str(tmp).encode("utf-8")).hexdigest()

                    if choices_hash not in self.choice_table:
                        self.choice_table[choices_hash] = tmp

                    tree["field"]["choices"] = choices_hash

        # Delete some empty fields to tighten our json in the end
        delete_if_empty = ["label", "icon"]
        for item in delete_if_empty:
            if tree[item] == "":
                del tree[item]

        # Delete field if it's empty
        if not tree["field"]:
            del tree["field"]

        for child in child_blocks:
            tree["children"].append(self.generate_stream_tree(child_blocks[child]))

        # Delete children if it's empty
        if len(tree["children"]) == 0:
            del tree["children"]

        if block.__class__.__bases__[0].__name__ == "StructBlock":
            tree["struct"] = True

        return tree

    def get_stream_tree(self):
        parent_block = getattr(self.model, self.field_name).field.stream_block
        return self.generate_stream_tree(parent_block)
