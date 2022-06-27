import dom, { Fragment } from 'jsx-render'
import draftToHtml from 'draftjs-to-html'

import { renderInPlaceHolder, PlaceHolder } from "../jsx"


export class RichTextBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
    if (initialState) {
      try {
        const rawContentState = JSON.parse(initialState)
        const html = draftToHtml(rawContentState)
        return renderInPlaceHolder(previewPlaceholder, (
          <Fragment>
            <div className="rich-text" dangerouslySetInnerHTML={{__html: html}} />
            <PlaceHolder/>
          </Fragment>
        ))
      } catch (e) {
        console.log("Invalid data", initialState)
      }
    }

    return renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <h1>{initialState ? initialState.toString() : "empty"}</h1>
        <PlaceHolder/>
      </Fragment>
    ))
  }
}
