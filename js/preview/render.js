import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview, PreviewList, TemplatePreview } from "./view"


export function renderPreview(previewPlaceholder, prefix, initialState, initialError) {
  const { meta: { previewTemplate, preview }} = this

  if (previewTemplate) {
    return new TemplatePreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
  if (this.meta.preview && this.meta.preview.length) {
    return new PreviewList(this, previewPlaceholder, prefix, initialState, initialError)
  }

  return new Preview(this, previewPlaceholder, prefix, initialState, initialError)
}

