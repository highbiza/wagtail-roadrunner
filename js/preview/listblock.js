import dom, { Fragment } from 'jsx-render'
import { v4 as uuidv4 } from 'uuid'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview, renderPreview } from "./render"
import "./listblock.scss"


class ListBlockPreview extends Preview {
  setState(newState) {
    this.state = newState
    const { children=[] } = this
    const values = this.getValue()
    const numValues = values.length

    for (let i = 0; i < numValues; i++) {
      if (i < children.length) {
        children[i].setState(values[i])
      } else {
        const childState = values[i]
        // generate an id because they need to be unique per item.
        childState.id = `listitem-preview-${uuidv4()}`
        const { child, childPlaceholder } = this.renderChild(this.childPlaceholder, childState)
        this.childPlaceholder = childPlaceholder
        this.children.push(child)
      }
    }
  }

  getValue() {
    return this.state.map(state => state.value)
  }

  renderChild(placeholder, childState) {
    const child = renderPreview(this.blockDef.childBlockDef, placeholder, `preview-${childState.id}`, childState.value)
    const childPlaceholder = child.placeholder
    return { child, childPlaceholder}
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const { classname="preview-listblock" } = this.blockDef.meta
    const { element, placeholders: [initialChildPlaceholder, placeholder] } = renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <div className={classname || "preview-listblock"}>
          <PlaceHolder/>
        </div>
        <PlaceHolder/>
      </Fragment>
    ))

    this.childPlaceholder = initialChildPlaceholder
    this.children = initialState.map(childState => {
      const { child, childPlaceholder } = this.renderChild(this.childPlaceholder, childState)
      this.childPlaceholder = childPlaceholder
      return child
    })

    return { element, placeholder }
  }
}

export class PreviewListBlockDefinition extends window.wagtailStreamField.blocks.ListBlockDefinition {
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new ListBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
