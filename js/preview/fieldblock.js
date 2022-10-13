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
  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new PreviewFieldBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
