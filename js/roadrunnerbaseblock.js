import dom from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { StylingBlock } from "./stylingblock"
import { GRID_SIZE_CHANGED_EVENT } from "./events"
import { isInViewport } from "./utils"
import "./roadrunnerbaseblock.scss"

export class RoadRunnerBaseBlock extends StylingBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    const result = renderInPlaceHolder(placeholder, (
      <div className="roadrunnerbaseblock-container">
        <PlaceHolder />
      </div>
    ))

    super(blockDef, result.placeholder, prefix, initialState, initialError)
    this.element = result.element
    this.element.addEventListener(GRID_SIZE_CHANGED_EVENT, evt => {
      this.focus()
    })
  }

  setError(error) {
    super.setError(error)
  }

  focus(opts) {
    super.focus(opts)

    setTimeout(() => {
      if (!isInViewport(this.element)) {
        this.element.scrollIntoView({behavior: "smooth"})
      }
    }, 100)

  }
}


export class RoadRunnerBaseBlockDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new RoadRunnerBaseBlock(this, placeholder, prefix, initialState, initialError)
  }
}

