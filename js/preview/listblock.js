import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview, renderPreview } from "./render"
import "./listblock.scss"


class PreviewListBlockPreview extends Preview {
  setState(newState) {
    this.state = newState
    const { children } = this
    const values = this.getValue()
    for (let i = 0; i < children.length; i++) {
      children[i].setState(values[i])
    }
  }

  getValue() {
    return this.state.map(state => state.value)
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const { element, placeholders: [childPlaceholder, placeholder] } = renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <div class="preview-listblock">
          <PlaceHolder/>
        </div>
        <PlaceHolder/>
      </Fragment>
    ))

    let nextChildPlaceholder = childPlaceholder
    this.children = initialState.map(childState => {
      const child = renderPreview(this.blockDef.childBlockDef, nextChildPlaceholder, `preview-${childState.id}`, childState.value)
      nextChildPlaceholder = child.placeholder
      return child
    })

    return { element, placeholder }
  }
}

export class PreviewListBlockDefinition extends window.wagtailStreamField.blocks.ListBlockDefinition {
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new PreviewListBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
