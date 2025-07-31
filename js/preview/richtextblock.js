import dom, { Fragment } from 'jsx-render'
import $ from "jquery"
import draftToHtml from 'draftjs-to-html'
import { Preview } from "./render"
import { renderInPlaceHolder, PlaceHolder } from "../jsx"

const { convertToRaw } = window.DraftJS

export class RichTextBlockPreview extends Preview {
  setState(newState) {
    this.state = newState
    const previewElement = $(this.element).find(`#${this.prefix}`)
    previewElement.html(this.getValue())
  }

  getValue() {
    const { state } = this
    if (state) {
      try {
        const rawContentState = JSON.parse(state)
        return draftToHtml(rawContentState)
      } catch (e) {
        try {
          const rawContentState2 = convertToRaw(state.getCurrentContent())
          return draftToHtml(rawContentState2)
        } catch (error) {
          console.error("Invalid draftail data", error, state)
        }
      }
    }
    return `<h1>${state ? state.toString() : "empty richtext"}</h1>`
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const html = this.getValue()
    return renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <div id={prefix} className="rich-text" dangerouslySetInnerHTML={{__html: html}} />
        <PlaceHolder/>
      </Fragment>
    ))
  }
}

export class RichTextBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new RichTextBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
