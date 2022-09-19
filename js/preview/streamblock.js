import dom from 'jsx-render'
import $ from "jquery"

import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { getStreamChild } from "../wagtailprivate"
import { onHiddenInputValueChanged } from "../utils"
import { renderPreview, renderPreviewMethod } from "./render.js"

import "./streamblock.scss"

class PreviewBlockWrapper {
  constructor(blockDef, placeholder, modalPrefix, childPrefix, index, id, initialState, sequence, opts) {
    // render our wrapper tempplate with the placeholders for the preview and
    // the child element
    const { sequence: { blockDef: { meta } } } = blockDef

    const result = renderInPlaceHolder(placeholder, (
      <div className="preview field-content">
        <div className="preview-container" role="button" data-toggle="modal" data-target={`#${modalPrefix}`}>
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
    const child = blockDef.renderChild(originalPlaceholder, childPrefix, initialState)
    this.wrappedChild = child

    // now render our preview in the preview placeholder
    const preview = renderPreview(blockDef, previewPlaceholder, `preview-${childPrefix}`, initialState)
    this.previewErrorPlaceholder = preview.placeholder
    this.preview = preview

    // listen to changes in the forms and update the preview if somethang did change

    // hidden inputs do not send change events
    onHiddenInputValueChanged(this.previewElement, e => {
      if ("setState" in preview) {
        const childState = child.getState()
        preview.setState(childState)
      }
    })

    // regular inputs do send change events
    $(this.previewElement).change(e => {
      if ("setState" in preview) {
        const childState = child.getState()
        preview.setState(childState)
      }
    })
  }

  getValue() {
    return this.wrappedChild.getValue()
  }

  getState() {
    return this.wrappedChild.getState()
  }

  setState(state) {
    this.wrappedChild.setState(state)
  }

  setError(errorList) {
    this.preview.setError(errorList)
    this.wrappedChild.setError(errorList)
  }

  getTextLabel(opts) {
    return null
  }

  focus(opts) {
    this.wrappedChild.focus(opts)
  }
}


class PreviewBlockDefinition {
  constructor(blockDef, originalPlaceholder, modalPrefix, prefix, index, id, initialState, sequence, opts) {
    // copy all of the original blockDef props except render, because we are
    // going to use our own render.
    const { render, ...blockDefProps} = blockDef
    Object.assign(this, blockDefProps)

    // keep a reference to the original render and the placeholder it was
    // supposed to be rendered in
    this.renderChild = render

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
      this.renderPreview = renderPreviewMethod.bind(this)
    }
  }

  render(blockElement, childPrefix, initialState, initialError) {
    return new PreviewBlockWrapper(this, blockElement, this.modalPrefix, childPrefix, this.index, this.id, initialState, this.sequence, this.opts)
  }
}

class PreviewStreamChild extends getStreamChild() {
  setError(error) {
    super.setError(error)
    this.blockDef.setError(error)
  }
  collapse() { /* we don't want this */ }
  expand() { /* we don't want this either */ }
}

class PreviewStreamBlock extends window.wagtailStreamField.blocks.StreamBlock {

  _getChildDataForInsertion(koe) {
    const { type } = koe
    const [blockDef, initialState, uuidv4] = super._getChildDataForInsertion({type})
    blockDef.isNew = true
    return [blockDef, initialState, uuidv4]
  }

  _createChild(blockDef, placeholder, prefix, index, id, initialState, sequence, opts) {
    const { isNew=false } = blockDef
    const modalPrefix = `preview-${prefix}`
    const blockDefWrapper = new PreviewBlockDefinition(blockDef, placeholder, modalPrefix, prefix, index, id, initialState, sequence, opts)
    const child = new PreviewStreamChild(blockDefWrapper, placeholder, prefix, index, id, initialState, sequence, opts)

    if (isNew) {
      // after the modal has opened, declare this PreviewStreamChild
      // as nolonger new.
      $(`#${modalPrefix}`).one('shown.bs.modal', e => {
        blockDef.isNew = false
      })
      $(`#${modalPrefix}`).modal("show")
    }

    return child
  }

  setError(error) {
    super.setError(error)
  }

  getTextLabel(opts) {
    return super.getTextLabel(opts)
  }
}

export class PreviewStreamBlockDefinition extends window.wagtailStreamField.blocks.StreamBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new PreviewStreamBlock(this, placeholder, prefix, initialState, initialError)
  }
}
