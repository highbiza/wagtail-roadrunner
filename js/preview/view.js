import dom from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { stripHtml } from "string-strip-html"


export class Preview {
  constructor(blockDef, previewPlaceholder, prefix, initialState, initialError) {
    this.state = initialState
    this.prefix = prefix
    this.blockDef = blockDef
    const { element, placeholder } = this.render(previewPlaceholder, prefix, initialState, initialError)
    this.element = element
    this.placeholder = placeholder
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    return renderInPlaceHolder(previewPlaceholder,
      <div id={prefix} class="preview-label">
        {this.getValue()}
        <PlaceHolder/>
      </div>
    )
  }

  getValue() {
    const { meta: { label }} = this.blockDef
    const [firstStateValue] = Object.values(this.state)

    let previewValue = label
    try {
      previewValue = stripHtml(firstStateValue).result || label
    } catch (e) {
      previewValue = label
    }
    return previewValue
  }

  getState() {
    return this.state
  }

  setState(newState) {
    $(this.element).find(`#${this.prefix}`)
      .text(this.getValue())
  }

  setError(errorList) {
    $(this.element).addClass("error")
    renderInPlaceHolder(this.placeholder, (
      <p className="error-message">
        <span>Dit block bevat fouten</span>
      </p>
    ))
  }
}
