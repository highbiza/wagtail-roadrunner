import $ from "jquery"
import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview } from "./render"

export class PageTitle extends Preview {
  getValue() {
    return $("h1").first()
      .text()
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    return renderInPlaceHolder(previewPlaceholder,
      <Fragment>
        <div id={prefix} class="preview-label">
          <h1>{this.getValue()}</h1>
        </div>
        <PlaceHolder/>
      </Fragment>
    )
  }
}

export class PageTitleDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new PageTitle(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
