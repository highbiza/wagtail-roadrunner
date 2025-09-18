import dom from 'jsx-render'
import { Preview } from "./render"
import { stripHtml } from "string-strip-html"


export class PreviewFieldBlockPreview extends Preview {
  getValue() {
    if (this.state) {
      try {
        return stripHtml(this.state.toString()).result
      } catch (e) {
        return this.state
      }
    }

    return "empty FieldBlock"
  }
}

export class PreviewFieldBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  render(placeholder, prefix, initialState, initialError, parentCapabilities) {
    // unfortunately wagtail did break the rendering of children of a structblock.
    // Children of strucblocks don;t get any labels anymore, but there is stil code
    // that checks for idForLabel and if it is set, it will try to access the label.
    // this causes a big error and breaks all structblocks with previews.
    // fornow we solve this by explicitly removing all the label id's for blocks with preview.
    const renderedBlock = super.render(placeholder, prefix, initialState, initialError, parentCapabilities)
    renderedBlock.idForLabel = null
    return renderedBlock
  }

  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new PreviewFieldBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
