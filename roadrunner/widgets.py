import json
from wagtail.core.blocks.base import BlockWidget
from django.utils.safestring import mark_safe
from django.utils.html import format_html
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

    def render(self, name, value, attrs=None, renderer=None):
        content = super().render(name, value, attrs, renderer)
        return format_html("""
        <div id="roadrunner-breakpoint-switcher">
            <ul>
                <li>
                    <button type="button" value="col" class="c-sf-block__actions__single" title="mobile">
                        <svg class="icon icon-mobile default" aria-hidden="true" focusable="false">
                            <use href="#icon-mobile"/>
                        </svg>
                    </button>
                </li>
                <li>
                    <button type="button" value="col-md" class="c-sf-block__actions__single" title="tablet">
                        <svg class="icon icon-tablet default" aria-hidden="true" focusable="false">
                            <use href="#icon-tablet"/>
                        </svg>
                    </button>
                </li>
                <li>
                    <button type="button" value="col-lg" class="c-sf-block__actions__single active" title="screen">
                        <svg class="icon icon-tv default" aria-hidden="true" focusable="false">
                            <use href="#icon-tv"/>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
        {content}
        """, content=content)
