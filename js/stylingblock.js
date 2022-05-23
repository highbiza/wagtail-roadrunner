import dom, {Fragment} from 'jsx-render'
import { renderInPlaceHolder, PlaceHolder } from "./jsx"
import { renderPreview } from "./preview.js"
import "./stylingblock.scss"

const SvgIcon = ({ name }) => (
    <svg className={`icon ${name} default`} aria-hidden="true" focusable="false">
      <use href={`#${name}`}></use>
    </svg>
)

const HelpText = ({ helpText }) => (
  <span>
      <div className="help">
        <SvgIcon name="icon-help"/>
        { help_text }
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
    console.log("StructBlock.constructor", blockDef.meta)
    if (blockDef.meta.formTemplate) {
      super(blockDef, placeholder, prefix, initialState, initialError)
    } else {
      const state = initialState || {};

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
            <div className="tab-content">
              <section className="tab-pane fade in show active" id={`all-${ prefix }`} role="tabpanel">
                <div className="corner-tab-control">
                  <a className="nav-link" data-toggle="tab" href={`#styling-${prefix}`} role="tab" aria-controls={`styling-${prefix}`} aria-selected="false">
                    <SvgIcon name="icon-palette"/>
                  </a>
                </div>
                <PlaceHolder/>
              </section>
              <section className="tab-pane fade" id={`styling-${prefix}`} role="tabpanel">
                <div className="corner-tab-control">
                  <a className="nav-link active" data-toggle="tab" href={`#all-${prefix}`}>
                    <SvgIcon name="icon-layout"/>
                  </a>
                </div>
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
        const stylingResult = renderInPlaceHolder(stylingPlaceholderElement, (<Child name={stylingBlockdef.name} {...stylingBlockdef.meta}/>))
        const stylingBlock = stylingBlockdef.render(
          stylingResult.placeholder,
          prefix + '-' + stylingBlockdef.name,
          state[stylingBlockdef.name],
            initialError?.blockErrors[stylingBlockdef.name]
        )
        this.childBlocks[stylingBlockdef.name] = stylingBlock;
      } else {
        super(blockDef, placeholder, prefix, initialState, initialError)
      }
    }
  }

  setError(error) {
    console.log("StylingBlock.setError", error)
    super.setError(error)
  }
}

export class StylingBlockDefinition extends window.wagtailStreamField.blocks.StructBlockDefinition {
  constructor(name, childBlockDefs, meta) {
    super(name, childBlockDefs, meta)
  }

  render(placeholder, prefix, initialState, initialError) {
    return new StylingBlock(this, placeholder, prefix, initialState, initialError);
  }

  renderPreview = function(previewPlaceholder, modalPrefix, initialState, initialError) {
    // create lookuptable for child blocks
    const childBlockDefsByName = this.childBlockDefs.reduce((acc, bd) => {
      const { name } = bd
      acc[name] = bd
      return acc
    }, {})

    if (this.meta.preview) {
      // render each childblock below eachother, passing the placeholder
      // consecutively.
      return this.meta.preview.reduce((placeholder, name) => {
        const blockDef = childBlockDefsByName[name]
        console.log(blockDef)
        if ("renderPreview" in blockDef) {
          const result = blockDef.renderPreview(placeholder, modalPrefix, initialState[name], initialError?.[name])
          return result
        }
        return placeholder
      }, previewPlaceholder)
    } else {
      console.log("WWWWUUUUUWUDLLLLDGGG")
      return renderPreview.call(this, previewPlaceholder, modalPrefix, initialState, initialError)
    }

    return previewPlaceholder
  }
}
