def get_searchable_content_for_fields(value, child_blocks, index_fields):
    """
    A util you can use to only add certain child blocks fields to the search index.
    """
    content = []
    for field in index_fields:
        content.extend(child_blocks[field].get_searchable_content(value[field]))
    return content
