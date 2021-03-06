import $ from "jquery"
import dom from 'jsx-render'
import { renderInPlaceHolder } from "./jsx"
import { SvgIcon, breakPointValue, breakPointFallback, cols, times } from "./utils"
import { createGridSizeChanged, breakPointEmitter } from "./events"
import "./gridchoiceblock.scss"

const ICONS = {
  "col": "icon-mobile",
  "col-md": "icon-tablet",
  "col-lg": "icon-tv",
}

const GridSegment = ({ onClick, active=false, fallback=false }) =>
  <span onClick={onClick} className={`gridsegment${active ? ' active': ''}${fallback ? ' fallback': ''}`}></span>


const GridLine = ({ value, name, breakpoint, backupValue="col-12"}) => {
  const col = cols(value)
  const backupCols = cols(backupValue)
  const handleClick = index => evt => {

    $(`input[name=${name}][type=hidden][data-breakpoint=${breakpoint}]`).val(`${breakpoint}-${index+1}`)
    const gridSizeChangedEvent = createGridSizeChanged(index + 1, breakpoint)
    if (breakPointEmitter.current == breakpoint) {
      evt.target.dispatchEvent(gridSizeChangedEvent)
    }

    const segments = $(evt.target.parentNode).children(".gridsegment")
    $(segments).removeClass("active")
    // set the first index+1 segments to active
    segments.slice(0, index+1).addClass("active")
  }

  const html = (
    <div className={`gridchoice ${breakPointEmitter.current == breakpoint ? "active" : ""}`}>
      <div className="svg-wrapper"><SvgIcon name={ICONS[breakpoint]}/></div>
      <div className="gridplaceholder">
        {times(12, i => <GridSegment fallback={!col && i < backupCols} active={i < col} onClick={handleClick(i)} />)}
      </div>
      <input type="hidden" name={`${name}`} value={value} data-value={value} data-breakpoint={breakpoint} />
    </div>
  )
  breakPointEmitter.addListener(newBreakPoint => {
    if (newBreakPoint != breakpoint) {
      $(html).removeClass("active")
    } else {
      $(html).addClass("active")
    }
  })
  return html
}

const Grid = ({ values, name }) => (
  <div className="gridchooser-wrapper">
    <div className={`dropdown gridchooser${values.length ? "" : " open"}`}>
      <a className="toggler dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <SvgIcon name="icon-arrow-down"/>
      </a>
      <div className="gridchoices-wrapper">
        <GridLine name={name} backupValue={breakPointFallback(values, "col-md")} value={breakPointValue(values, "col-lg")} breakpoint="col-lg" />
        <GridLine name={name} backupValue={breakPointFallback(values, "col")} value={breakPointValue(values, "col-md")} breakpoint="col-md" />
        <GridLine name={name} value={breakPointValue(values, "col")} breakpoint="col" />
      </div>
    </div>
  </div>
)

class GridChoiceBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    this.state = initialState
    this.prefix = prefix
    const {element} = renderInPlaceHolder(placeholder, <Grid name={prefix} values={initialState} />)
    this.element = element
  }

  setState(state) {
    throw new Error("setState", state)
    this.state = {...this.state, ...state}
  }

  setError(errorList) {
    $(this.element).find(".dropdown.gridchooser")
      .addClass("error")
  }

  getState() {
    let result = []
    $(this.element).find("input[type=hidden]")
      .each((i, e) => {
        const val = $(e).val()
        if (val) {
          result.push(val)
        }
      })

    return result
  }

  getValue() {
    throw new Error("getValue", this.state)
    return this.state
  }

  getTextLabel(opts) {
    return null
  }

  focus(opts) {
    console.log("GridChoiceBlock focus", opts)
  }
}

export class GridChoiceBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new GridChoiceBlock(this, placeholder, prefix, initialState, initialError)
  }
}
