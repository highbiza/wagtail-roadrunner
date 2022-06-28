import dom from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { renderPreview, renderPreviewMethod, Preview } from "./preview/render.js"
import { SvgIcon } from "./utils"
import "./stylingblock.scss"


const HelpText = ({ helpText }) => (
  <span>
    <div className="help">
      <SvgIcon name="icon-help"/>
      { helpText }
    </div>
  </span>
)


const Child = ({ name, label, required=false }) => (
  <div className={`field ${required && 'required'}`} data-contentpath={name}>
    <label className="field__label"><h2><b>{label}</b></h2></label>
    <PlaceHolder />
  </div>
)


export class StylingBlock extends window.wagtailStreamField.blocks.StructBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    if (blockDef.meta.formTemplate) {
      super(blockDef, placeholder, prefix, initialState, initialError)
    } else {
      const state = initialState || {}

      // separate the stylingBlockdef and the childBlockDefs, because the stylingblock
      // will be rendered separately in a tab
      const { stylingBlockdef, childBlockDefs } = blockDef.childBlockDefs.reduce((acc, el) => {
        if (el.name == "styling") {
          acc.stylingBlockdef = el
        } else if (el.name == "grid") {
          acc.childBlockDefs.push(el)
          acc.gridBlockDef = el
        } else {
          acc.childBlockDefs.push(el)
        }
        return acc
      }, { childBlockDefs: [], stylingBlockdef:null, gridBlockDef:null})

      if (stylingBlockdef) {
        // render the tabed interface with placeholders for the stylingblock and
        // the childblocks
        const result = renderInPlaceHolder(placeholder, (
          <div className={`stylingblock ${blockDef.meta.classname || ''}`}>
            { blockDef.meta.helpText && <HelpText helpText={blockDef.meta.helpText} /> }

            <ul className="nav nav-tabs corner-tab-control" role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link" data-bs-toggle="tab" href={`#styling-${prefix}`} role="tab" aria-controls={`styling-${prefix}`} aria-selected="false">
                  <SvgIcon name="icon-palette"/>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link active" data-bs-toggle="tab" href={`#all-${prefix}`} role="tab" aria-controls={`all-${prefix}`}>
                  <SvgIcon name="icon-layout"/>
                </a>
              </li>
            </ul>

            <div className="nav tab-content">
              <section className="tab-pane fade show active" id={`all-${prefix}`} role="tabpanel">
                <PlaceHolder/>
              </section>
              <section className="tab-pane fade" id={`styling-${prefix}`} role="tabpanel">
                <PlaceHolder/>
              </section>
            </div>
          </div>
        ))

        // create a new blockDef with only the child blocks and render them in
        // the childPlaceholderElement using super
        const childBlockDef = {...blockDef, childBlockDefs}
        const [childPlaceholderElement, stylingPlaceholderElement] = result.placeholders
        super(childBlockDef, childPlaceholderElement, prefix, initialState, initialError)

        // render the stylingblock in the stylingPlaceholderElement and register
        // in the childBlocks registry.
        const stylingResult = renderInPlaceHolder(stylingPlaceholderElement, <Child name={stylingBlockdef.name} {...stylingBlockdef.meta}/>)
        const stylingBlock = stylingBlockdef.render(
          stylingResult.placeholder,
          prefix + '-' + stylingBlockdef.name,
          state[stylingBlockdef.name],
          initialError?.blockErrors[stylingBlockdef.name]
        )
        this.childBlocks[stylingBlockdef.name] = stylingBlock
      } else {
        super(blockDef, placeholder, prefix, initialState, initialError)
      }
    }
  }

  setError(error) {
    // console.log("StylingBlock.setError", error)
    super.setError(error)
  }
}

class StylingBlockPreview extends Preview {
  setState(newState) {
    for (const [key, value] of Object.entries(newState)) {
      const child = this.children[key]
      if (child && "setState" in child) {
        child.setState(value)
      } else {
        console.log("Deze doet het niet", key, value, child)
      }
    }
    this.state = newState
  }

  render(previewPlaceholder, prefix, initialState, initialError) {
    console.log("StylingBlockPreview.initialState",initialState)

    const { childBlockDefs, meta: { preview} } = this.blockDef

    // create lookuptable for child blocks
    const childBlockDefsByName = childBlockDefs.reduce((acc, bd) => {
      const { name } = bd
      acc[name] = bd
      return acc
    }, {})

    const children = {}
    this.children = children
    if (preview) {
      // render each childblock below eachother, passing the placeholder
      // consecutively.
      const childDef = preview.reduce((def, name) => {
        const { placeholder } = def
        const blockDef = childBlockDefsByName[name]
        const result = renderPreview(blockDef, placeholder, `${name}-${prefix}`, initialState[name], initialError?.[name])
        children[name] = result
        return result
      }, { placeholder: previewPlaceholder })

      return childDef
    }

    return renderPreviewMethod.call(this.blockDef, previewPlaceholder, prefix, initialState, initialError)
  }
}
export class StylingBlockDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {

  render(placeholder, prefix, initialState, initialError) {
    return new StylingBlock(this, placeholder, prefix, initialState, initialError)
  }

  renderPreview(previewPlaceholder, prefix, initialState, initialError) {
    return new StylingBlockPreview(this, previewPlaceholder, prefix, initialState, initialError)
  }
}
