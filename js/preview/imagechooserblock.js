import dom, { Fragment, portalCreator } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import $ from "jquery"


export class ImageChooserBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
    const previewImage = initialState?.preview

    const result = renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
      {previewImage ? <img src={previewImage.url} width={previewImage.width} height={previewImage.height} alt={previewImage.title} /> : "empty"}
      <PlaceHolder/>
      </Fragment>
    ))

    return result.placeholder
  }
}