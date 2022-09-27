def get_specific_fields_searchable_content(value, child_blocks, index_fields):
    """
    A util you can use to only add certain child blocks fields to the search index.
    """
    content = []
    for block_key, block in child_blocks.items():
        if block_key in index_fields:
            content.extend(block.get_searchable_content(value[block_key]))
    return content
