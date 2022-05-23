import json
from wagtail.core.blocks.base import BlockWidget

from .telepath import RoadRunnerJSContext


class RoadRunnerBlockWidget(BlockWidget):
    """
    We use our own JSContext so we can override a couple of wagtail adapter
    when in the roadrunner context.
    """

    # pylint: disable=attribute-defined-outside-init
    def _build_block_json(self):
        self._js_context = RoadRunnerJSContext()
        self._block_json = json.dumps(self._js_context.pack(self.block_def))
