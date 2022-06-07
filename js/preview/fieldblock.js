import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"


export class PreviewFieldBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {

    const result = renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <p>{initialState}</p>
        <PlaceHolder/>
      </Fragment>
    ))

    return result.placeholder
  }
}
