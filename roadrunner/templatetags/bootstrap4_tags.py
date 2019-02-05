import re

from django import template


register = template.Library()
sizes_regex = r"(?P<offset>col-\w+-\d+)"
offset_regex = r"(?P<offset>col-\w+-offset-\d+)"
cols = {"xs": "sm", "sm": "md", "md": "lg", "lg": "xl"}


@register.filter
def to_bootstrap4(classes):
    def fix_sizes(match):
        offset = match.group(0)
        i, old_col, size = offset.split("-")  # pylint: disable=W0612
        if old_col == "xs":
            size = "%s col-%s" % (size, size)
        col = cols[old_col]
        return "col-%s-%s" % (col, size)

    def fix_offset(match):
        offset = match.group(0)
        i, col, j, offset = offset.split("-")  # pylint: disable=W0612
        return "offset-%s-%s" % (cols[col], offset)

    classes = re.sub(sizes_regex, fix_sizes, classes)

    classes = re.sub(offset_regex, fix_offset, classes)

    return classes.strip()
