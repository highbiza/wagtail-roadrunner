registered_blocks = []


def register_block(name=None, *args, **kwargs):  # pylint: disable=W1113
    def get_name(block):
        return getattr(block, "_name", block.__name__.lower().replace("block", ""))

    def real_register(block):
        registered_blocks.append((name or get_name(block), block(*args, **kwargs)))

    if isinstance(name, type):
        registered_blocks.append((get_name(name), name()))
    return real_register
