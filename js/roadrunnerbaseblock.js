import dom, { Fragment, portalCreator } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { StylingBlock } from "./stylingblock"
import $ from "jquery"
import "./roadrunnerbaseblock.scss"

class RoadRunnerBaseBlock extends StylingBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    console.log("RoadRunnerBaseBlock.constructor", blockDef, placeholder, prefix, initialState, initialError);
    super(blockDef, placeholder, prefix, initialState, initialError);
    console.log("RoadRunnerBaseBlock", this);
  }

  setError(error) {
    console.log("RoadRunnerBaseBlock.setError", error)
    super.setError(error)
  }
}


export class RoadRunnerBaseBlockDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  constructor(name, childBlockDefs, meta) {
    super(name, childBlockDefs, meta)
    console.log("RoadRunnerBaseBlockDefinition", name, childBlockDefs, meta)
  }

  render(placeholder, prefix, initialState, initialError) {
    return new RoadRunnerBaseBlock(this, placeholder, prefix, initialState, initialError);
  }
}

