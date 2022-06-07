import dom from 'jsx-render'
import $ from "jquery"

import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { getStreamChild } from "../wagtailprivate"
import { renderPreview } from "./render.js"

import "./streamblock.scss"


class PreviewBlockChildWrapper {
  constructor(blockDef, originalPlaceholder, modalPrefix, prefix, index, id, initialState, sequence, opts) {
    // copy all of the original blockDef props except render, because we are
    // going to use our own render.
    const { render, ...blockDefProps} = blockDef
    // console.log("PreviewBlockChildWrapper", blockDefProps)
    Object.assign(this, blockDefProps)

    // keep a reference to the original render and the placeholder it was
    // supposed to be rendered in
    this.originalRender = render
    this.originalPlaceholder = originalPlaceholder

    // keep a reference to all the variables of interest that would be passed
    // to _createChild so we can use them in our preview template if we want
    this.modalPrefix = modalPrefix
    this.prefix = prefix
    this.index = index
    this.id = id
    this.initialState = initialState
    this.sequence = sequence
    this.opts = opts

    // properly bind the render and renderPreview methods
    this.render = this.render.bind(this)
    if ("renderPreview" in blockDef) {
      this.renderPreview = blockDef.renderPreview.bind(this)
    } else {
      this.renderPreview = renderPreview.bind(this)
    }
  }

  render(blockElement, childPrefix, initialState, initialError) {

    // render our wrapper tempplate with the placeholders for the preview and
    // the child element
    const { modalPrefix, sequence: { blockDef: { meta } } } = this

    const result = renderInPlaceHolder(blockElement, (
      <div className="preview field-content">
        <div role="button" data-toggle="modal" data-target={`#${modalPrefix}`}>
          <PlaceHolder />
        </div>
        <div className={`modal fade modal-edit`} id={modalPrefix} tabindex="-1" role="dialog" aria-labelledby={`${modalPrefix}Label`} aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <PlaceHolder />
              </div>
              <div className="modal-footer">
                <button type="button" className="button" data-dismiss="modal">{meta?.strings?.APPLY || "Apply"}</button>
                <button type="submit" className="button action-save button-longrunning" data-clicked-text={meta?.strings?.SAVING || "Saving..."}>
                  {meta?.strings?.SAVE_DRAFT || "Save Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
    this.previewElement = result.element
    const [previewPlaceholder, originalPlaceholder] = result.placeholders

    // call the original render and render it in the child placeholder
    const child = this.originalRender(originalPlaceholder, childPrefix, this.initialState, initialError)

    // now render our preview in the preview placeholder
    this.previewErrorPlaceholder = this.renderPreview(previewPlaceholder, modalPrefix, initialState, initialError)

    // return the original created child object, which has all the logic on it.
    return child
  }

  setError(error) {
    $(this.previewElement).addClass("error")
    renderInPlaceHolder(this.previewErrorPlaceholder, (
      <p className="error-message">
        <span>Dit block bevat fouten</span>
      </p>
    ))
  }
}

class PreviewStreamChild extends getStreamChild() {
  setError(error) {
    // console.log("PreviewStreamChild.setError", error)
    super.setError(error)
    this.blockDef.setError(error)
  }
}

class PreviewStreamBlock extends window.wagtailStreamField.blocks.StreamBlock {

  _getChildDataForInsertion({ type }) {
    // console.log("PreviewStreamBlock._getChildDataForInsertion", type)
    const [blockDef, initialState, uuidv4] = super._getChildDataForInsertion({type})
    initialState.isNew = true
    return [blockDef, initialState, uuidv4]
  }

  _createChild(blockDef, placeholder, prefix, index, id, initialState, sequence, opts) {
    const { isNew=false } = initialState
    const modalPrefix = `preview-${prefix}`
    const blockDefWrapper = new PreviewBlockChildWrapper(blockDef, placeholder, modalPrefix, prefix, index, id, initialState, sequence, opts)
    const child = new PreviewStreamChild(blockDefWrapper, placeholder, prefix, index, id, initialState, sequence, opts)
    // const child = super._createChild(blockDefWrapper, placeholder, prefix, index, id, initialState, sequence, opts)
    if (isNew) {
      $(`#${modalPrefix}`).modal("show")
    }
    return child
  }

  setError(error) {
    // console.log("PreviewStreamBlock.setError", error)
    super.setError(error)
  }
}

export class PreviewStreamBlockDefinition extends window.wagtailStreamField.blocks.StreamBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new PreviewStreamBlock(this, placeholder, prefix, initialState, initialError)
  }
}
