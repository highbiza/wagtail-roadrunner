import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview } from "./render"


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

  render(previewPlaceholder, prefix, initialState, initialError) {
    console.log("ImageChooserBlockDefinition.modalPrefix", prefix)
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
