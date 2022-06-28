import dom, { Fragment } from 'jsx-render'
import $ from "jquery"

import { Preview } from "./render"
import { renderInPlaceHolder, PlaceHolder } from "../jsx"


class ImageChooserPreview extends Preview {

  getValue() {
    const previewImage = this.state?.preview
    return {
      src: previewImage.url,
      width: previewImage.width,
      height: previewImage.height,
      alt: previewImage.title,
    }
  }

  setState(newState) {
    this.state = newState
    $(`#${this.prefix}`).attr(this.getValue())
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const previewImage = initialState?.preview

    return renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        {previewImage ? <img id={prefix} {...this.getValue()} /> : "empty"}
        <PlaceHolder/>
      </Fragment>
    ))
  }
}

export class ImageChooserBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
    return new ImageChooserPreview(this, previewPlaceholder, modalPrefix, initialState, initialError)
  }
}
