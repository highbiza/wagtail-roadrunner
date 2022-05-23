import dom, { Fragment, portalCreator } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { stripHtml } from "string-strip-html";

export function renderPreviewTemplate(previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError) {
  const result = renderInPlaceHolder(previewPlaceholder, (
    <Fragment>
    <div dangerouslySetInnerHTML={{__html: previewTemplate}}/>
    <PlaceHolder/>
    </Fragment>
  ))
  return result.placeholder
}

export function renderPreviewLabel(label, previewPlaceholder) {
  const result = renderInPlaceHolder(previewPlaceholder, (
    <p>{label}</p>
  ))
  return result.placeholder
}

export function renderPreviewItemStates(previewItems, previewPlaceholder, modalPrefix, initialState, initialError) {
  const itemStates = previewItems.reduce((acc, item) => {
    acc.push(initialState[item])
    return acc
  }, [])

  const result = renderInPlaceHolder(previewPlaceholder, (
    <div>
    {itemStates.map(item => (
      <p>{item}</p>
    ))}
    </div>
  ))
}

export function renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
  const { meta: { previewTemplate, preview, label }} = this

  if (previewTemplate) {
    return renderPreviewTemplate(previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError)
  }
  if (this.meta.preview && this.meta.preview.length) {
    return renderPreviewItemStates(preview, previewPlaceholder, modalPrefix, initialState, initialError)
  }

  const [firstStateValue] = Object.values(initialState)
  return renderPreviewLabel(stripHtml(firstStateValue).result || label, previewPlaceholder)
}

