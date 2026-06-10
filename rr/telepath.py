from wagtail.telepath import JSContext


class RegistryWrapper:
    def __init__(self, registry):
        self.telepath_js_path = registry.telepath_js_path
        self.registry = registry
        self.roadrunner_adapters = {}

    def register(self, adapter, cls):
        self.roadrunner_adapters[cls] = adapter

    def find_adapter(self, cls):
        # print("find_adapter", cls, self.roadrunner_adapters)

        for base in cls.__mro__:
            adapter = self.roadrunner_adapters.get(base)
            if adapter is not None:
                return adapter

        return self.registry.find_adapter(cls)

    @property
    def adapters(self):
        adapters = dict(self.registry.adapters)
        adapters.update(self.roadrunner_adapters)
        return adapters


class RoadRunnerJSContext(JSContext):
    registry = RegistryWrapper(JSContext.registry)


def register(adapter, cls):
    return RoadRunnerJSContext.registry.register(adapter, cls)
