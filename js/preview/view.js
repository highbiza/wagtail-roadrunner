import dom, { Fragment } from 'jsx-render'
import $ from "jquery"
import { renderInPlaceHolder, PlaceHolder } from "../jsx"
import { stripHtml } from "string-strip-html"


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
      <div id={prefix} class="preview-label">
        {this.getValue()}
        <PlaceHolder/>
      </div>
    )
  }

  getValue() {
    const { meta: { label }} = this.blockDef
    const [firstStateValue] = Object.values(this.state)

    let previewValue = label
    try {
      previewValue = stripHtml(firstStateValue).result || label
    } catch (e) {
      previewValue = label
    }
    return previewValue
  }

  getState() {
    return this.state
  }

  setState(newState) {
    $(this.element).find(`#${this.prefix}`)
      .text(this.getValue())
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
      if ("setState" in child) {
        child.setState(value)
      }
    }
    this.state = state
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
  render(previewPlaceholder, prefix, initialState, initialError) {
    const { meta: { preview }} = this.blockDef

    const itemStates = preview.reduce((acc, item) => {
      acc.push(initialState[item])
      return acc
    }, [])

    return renderInPlaceHolder(previewPlaceholder, (
      <ul class="preview-items">
        {itemStates.map(item =>
          <li id={`wut-${item.id}`}>{item}</li>
        )}
      </ul>
    ))
  }
}
