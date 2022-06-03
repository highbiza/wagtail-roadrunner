import dom from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { StylingBlock } from "./stylingblock"
import { GRID_SIZE_CHANGED_EVENT } from "./events"
import { isInViewport } from "./utils"
import $ from "jquery"
import "./roadrunnerbaseblock.scss"

class RoadRunnerBaseBlock extends StylingBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    // console.log("RoadRunnerBaseBlock.constructor", blockDef, placeholder, prefix, initialState, initialError);
    const result = renderInPlaceHolder(placeholder, (
      <div className="roadrunnerbaseblock-container">
      <PlaceHolder />
      </div>
    ))

    super(blockDef, result.placeholder, prefix, initialState, initialError);
    this.element = result.element
    console.log("RoadRunnerBaseBlock", result);
    this.element.addEventListener(GRID_SIZE_CHANGED_EVENT, evt => {
      this.focus()
    })
  }

  setError(error) {
    // console.log("RoadRunnerBaseBlock.setError", error)
    super.setError(error)
  }

  focus(opts) {
    super.focus(opts)

    setTimeout(() => {
      if (!isInViewport(this.element)) {
        this.element.scrollIntoView( {behavior: "smooth"})
      }
    }, 100)
    
  }
}


export class RoadRunnerBaseBlockDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  constructor(name, childBlockDefs, meta) {
    super(name, childBlockDefs, meta)
    // console.log("RoadRunnerBaseBlockDefinition", name, childBlockDefs, meta)
  }

  render(placeholder, prefix, initialState, initialError) {
    return new RoadRunnerBaseBlock(this, placeholder, prefix, initialState, initialError);
  }
}

