import dom, { Fragment } from 'jsx-render'
import $ from "jquery"
import { stripHtml } from "string-strip-html"

import { renderInPlaceHolder, PlaceHolder } from "../jsx"


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
      <Fragment>
        <div id={prefix} class="preview-label">
          {this.getValue()}
        </div>
        <PlaceHolder/>
      </Fragment>
    )
  }

  getValue() {
    const { meta: { label }} = this.blockDef
    const [firstStateValue] = Object.values(this.state)

    let previewValue = label
    try {
      previewValue = stripHtml(firstStateValue.toString()).result || label
    } catch (e) {
      previewValue = label || firstStateValue.toString()
    }
    return previewValue
  }

  getState() {
    return this.state
  }

  setState(newState) {
    this.state = newState
    const previewElement = $(this.element).find(`#${this.prefix}`)
    previewElement.text(this.getValue())
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

export class TemplatePreview extends Preview {
  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      const child = this.children[key]
      if (child && "setState" in child) {
        child.setState(value)
      }
    }
    this.state = newState
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const { childBlockDefs, meta: { previewTemplate }} = this.blockDef
    const html = previewTemplate.replace(/__PREFIX__/g, prefix)
    const { element, placeholder } = renderInPlaceHolder(previewPlaceholder, (
      <Fragment>
        <div dangerouslySetInnerHTML={{__html: html}}/>
        <PlaceHolder/>
      </Fragment>
    ))

    this.children = {}
    if (childBlockDefs) {
      childBlockDefs.forEach(childBlockDef => {
        if ("renderPreview" in childBlockDef) {
          const childBlockElement = element.querySelector('[data-structblock-child="' + childBlockDef.name + '"]')
          if (childBlockElement) {
            this.children[childBlockDef.name] = childBlockDef.renderPreview(
              childBlockElement,
              prefix + '-' + childBlockDef.name,
              initialState[childBlockDef.name],
              initialError?.blockErrors[childBlockDef.name]
            )
          }
        }
      })
    }

    return { element, placeholder }
  }
}

export class PreviewList extends Preview {
  setState(newState) {
    this.state = newState
    for (const [key, value] of Object.entries(newState)) {
      const child = this.children[key]
      if (child && "setState" in child) {
        child.setState(value)
      } else {
        console.log("PreviewList.setState: Dit child heeft geen preview", child, this.children, key, value)
      }
    }
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    const { childBlockDefs, meta: { preview} } = this.blockDef

    // create lookuptable for child blocks
    const childBlockDefsByName = childBlockDefs.reduce((acc, bd) => {
      const { name } = bd
      acc[name] = bd
      return acc
    }, {})

    const children = {}
    this.children = children

    // render each childblock below eachother, passing the placeholder
    // consecutively.
    return preview.reduce((def, name) => {
      const { placeholder } = def
      const blockDef = childBlockDefsByName[name]
      const result = renderPreview(blockDef, placeholder, `${name}-${prefix}`, initialState[name], initialError?.[name])
      children[name] = result
      return result
    }, { placeholder: previewPlaceholder })
  }
}


export function renderPreviewMethod(previewPlaceholder, prefix, initialState, initialError) {
  const { meta: { previewTemplate, preview }} = this

  if (previewTemplate) {
    return new TemplatePreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
  if (preview && preview.length) {
    return new PreviewList(this, previewPlaceholder, prefix, initialState, initialError)
  }

  return new Preview(this, previewPlaceholder, prefix, initialState, initialError)
}


export function renderPreview(blockDef, previewPlaceholder, prefix, initialState, initialError) {

  if ("renderPreview" in blockDef) {
    return blockDef.renderPreview(previewPlaceholder, prefix, initialState, initialError)
  }

  return renderPreviewMethod.call(blockDef, previewPlaceholder, prefix, initialState, initialError)
}


