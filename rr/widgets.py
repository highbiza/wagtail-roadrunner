import json
import logging
import traceback
from wagtail.blocks.base import BlockWidget
from .telepath import RoadRunnerJSContext

logger = logging.getLogger(__name__)


class RoadRunnerBlockWidget(BlockWidget):
    """
    We use our own JSContext so we can override a couple of wagtail adapter
    when in the roadrunner context.
    """

    # pylint: disable=attribute-defined-outside-init
    def _build_block_json(self):
        try:
            self._js_context = RoadRunnerJSContext()
            self._block_json = json.dumps(self._js_context.pack(self.block_def))
        except Exception as e:
            logger.error(
                "Something went wrong while rendering the block json %s %s", e, type(e)
            )
            traceback.print_exception(e)
            raise
