def get_searchable_content_for_fields(value, child_blocks, index_fields):
    """
    A util you can use to only add certain child blocks fields to the search index.
    """
    content = []
    index_fields_blocks = {k: v for k, v in child_blocks.items() if k in index_fields}
    for block_key, block in index_fields_blocks.items():
        content.extend(block.get_searchable_content(value[block_key]))
    return content
