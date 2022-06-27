import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"


export class ImageChooserBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
    console.log("ImageChooserBlockDefinition.modalPrefix", modalPrefix)
    const previewImage = initialState?.preview

    return renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        {previewImage ? <img
          src={previewImage.url}
          width={previewImage.width}
          height={previewImage.height}
          alt={previewImage.title} /> : "empty"}
        <PlaceHolder/>
      </Fragment>
    ))
  }
}
