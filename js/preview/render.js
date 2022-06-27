import dom, { Fragment } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { Preview } from "./view"

export function renderPreviewTemplate(previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError) {
  const html = previewTemplate.replace(/__PREFIX__/g, modalPrefix)
  const { element, placeholder } = renderInPlaceHolder(previewPlaceholder, (
    <Fragment>
      <div dangerouslySetInnerHTML={{__html: html}}/>
      <PlaceHolder/>
    </Fragment>
  ))

  if (this.childBlockDefs) {
    this.childBlockDefs.forEach(childBlockDef => {
      if ("renderPreview" in childBlockDef) {
        const childBlockElement = element.querySelector('[data-structblock-child="' + childBlockDef.name + '"]')
        if (childBlockElement) {
          const _ = childBlockDef.renderPreview(
            childBlockElement,
            modalPrefix + '-' + childBlockDef.name,
            initialState[childBlockDef.name],
            initialError?.blockErrors[childBlockDef.name]
          )
        }
      }
    })
  }
  return { element, placeholder }
}

export function renderPreviewLabel(label, previewPlaceholder) {
  return renderInPlaceHolder(previewPlaceholder,
    <p>{label}</p>
  )
}

export function renderPreviewItemStates(previewItems, previewPlaceholder, modalPrefix, initialState, initialError) {
  const itemStates = previewItems.reduce((acc, item) => {
    acc.push(initialState[item])
    return acc
  }, [])

  return renderInPlaceHolder(previewPlaceholder, (
    <div>
      {itemStates.map(item =>
        <p>{item}</p>
      )}
    </div>
  ))
}

export function renderPreview(previewPlaceholder, modalPrefix, initialState, initialError) {
  const { meta: { previewTemplate, preview }} = this

  if (previewTemplate) {
    return renderPreviewTemplate.call(this, previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError)
  }
  if (this.meta.preview && this.meta.preview.length) {
    return renderPreviewItemStates.call(this, preview, previewPlaceholder, modalPrefix, initialState, initialError)
  }

  return new Preview(this, previewPlaceholder, modalPrefix, initialState, initialError)
}

