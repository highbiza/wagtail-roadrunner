import dom, { Fragment, portalCreator } from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { stripHtml } from "string-strip-html";
import $ from "jquery"

export function renderPreviewTemplate(previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError) {
  const html = previewTemplate.replace(/__PREFIX__/g, modalPrefix);
  const { element, placeholder } = renderInPlaceHolder(previewPlaceholder, (
    <Fragment>
    <div dangerouslySetInnerHTML={{__html: html}}/>
    <PlaceHolder/>
    </Fragment>
  ))

  if (this.childBlockDefs) {
    this.childBlockDefs.forEach(childBlockDef => {
      if ("renderPreview" in childBlockDef) {
        const childBlockElement = element.querySelector('[data-structblock-child="' + childBlockDef.name + '"]');
        if (childBlockElement) {
          const childBlock = childBlockDef.renderPreview(
            childBlockElement,
            modalPrefix + '-' + childBlockDef.name,
            initialState[childBlockDef.name],
            initialError?.blockErrors[childBlockDef.name]
          );
        }
      }
    });
  }
  return placeholder
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
    return renderPreviewTemplate.call(this, previewTemplate, previewPlaceholder, modalPrefix, initialState, initialError)
  }
  if (this.meta.preview && this.meta.preview.length) {
    return renderPreviewItemStates.call(this, preview, previewPlaceholder, modalPrefix, initialState, initialError)
  }

  const [firstStateValue] = Object.values(initialState)
  
  let previewLabel = label
  try {
    previewLabel = stripHtml(firstStateValue).result || label
  } catch (e) {
    previewLabel = label
  }
  return renderPreviewLabel.call(this, previewLabel, previewPlaceholder)
}

