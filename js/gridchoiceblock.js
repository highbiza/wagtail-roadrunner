import $ from "jquery"
import { v4 as uuidv4 } from 'uuid'
import dom from 'jsx-render'
import Collapse from "./bootstrapnoconflict/collapse"
import { renderInPlaceHolder } from "./jsx"
import { SvgIcon, breakPointValue, breakPointFallback, cols, times } from "./utils"
import { createGridSizeChanged, breakPointEmitter } from "./events"
import "./gridchoiceblock.scss"

const ICONS = {
  "col": "icon-mobile-alt",
  "col-md": "icon-tablet-alt",
  "col-lg": "icon-desktop",
}

export const GridSegment = ({ onClick, active=false, fallback=false }) =>
  <span onClick={onClick} className={`gridsegment${active ? ' active': ''}${fallback ? ' fallback': ''}`}></span>


export const GridLine = ({ value, name, breakpoint, backupValue="col-12", collapsed=true}) => {
  const col = cols(value)
  const backupCols = cols(backupValue)
  const handleClick = index => evt => {
    const input = $(`input[name=${name}][type=hidden][data-breakpoint=${breakpoint}]`)
    const newVal = `${breakpoint}-${index+1}`
    // clear the active elements
    const segments = $(evt.target.parentNode).children(".gridsegment")
    $(segments).removeClass("active")

    if (input.val() == newVal) {
      input.val("")
      if (breakPointEmitter.current == breakpoint) {
        const gridSizeChangedEvent = createGridSizeChanged(backupCols, breakpoint)
        evt.target.dispatchEvent(gridSizeChangedEvent)
      }
      // take the fallback as the new width
      segments.slice(0, backupCols).addClass("fallback")

    } else {
      input.val(newVal)
      if (breakPointEmitter.current == breakpoint) {
        const gridSizeChangedEvent = createGridSizeChanged(index + 1, breakpoint)
        evt.target.dispatchEvent(gridSizeChangedEvent)
      }
      // set the first index+1 segments to active
      segments.slice(0, index+1).addClass("active")
    }
  }

  const html = (
    <div className={`gridchoice collapse ${breakPointEmitter.current != breakpoint && collapsed ? "gridchoice-toggle": "show"}`}>
      <div className="svg-wrapper"><SvgIcon name={ICONS[breakpoint]}/></div>
      <div className="gridplaceholder">
        {times(12, i => <GridSegment fallback={!col && i < backupCols} active={i < col} onClick={handleClick(i)} />)}
      </div>
      <input type="hidden" name={`${name}`} value={value} data-value={value} data-breakpoint={breakpoint} />
    </div>
  )
  breakPointEmitter.addListener(newBreakPoint => {
    if (newBreakPoint != breakpoint) {
      $(html).removeClass("show")
      $(html).addClass("gridchoice-toggle")
    } else {
      $(html).addClass("show")
      $(html).removeClass("gridchoice-toggle")
    }
  })
  return html
}

export const Grid = ({ values, name, collapsed=true }) => {
  const gridChoiceUUID = `grid-${uuidv4()}`

  return (
    <div className="gridchooser-wrapper" id={gridChoiceUUID}>
      <div className={`gridchooser`}>
        <a className="toggler collapsed" data-bs-toggle="collapse" data-bs-target={`#${gridChoiceUUID} .gridchoices-wrapper > .gridchoice-toggle`} aria-haspopup="true" aria-expanded="false">
          <SvgIcon name="icon-arrow-down"/>
        </a>
        <div className="gridchoices-wrapper">
          <GridLine name={name} backupValue={breakPointFallback(values, "col-md")} value={breakPointValue(values, "col-lg")} breakpoint="col-lg" collapsed={collapsed} />
          <GridLine name={name} backupValue={breakPointFallback(values, "col")} value={breakPointValue(values, "col-md")} breakpoint="col-md" collapsed={collapsed} />
          <GridLine name={name} value={breakPointValue(values, "col")} breakpoint="col" collapsed={collapsed} />
        </div>
      </div>
    </div>
  )
}

export class GridChoiceBlock {
  constructor(blockDef, placeholder, prefix, initialState, initialError) {
    this.state = initialState
    this.prefix = prefix
    const {element} = renderInPlaceHolder(placeholder, <Grid name={prefix} values={initialState} />)
    this.element = element
  }

  open() {
    const gridChoiceUUID = this.element.id
    $(`#${gridChoiceUUID} .gridchoices-wrapper > .gridchoice-toggle`).each(
      (_, element) => Collapse.getOrCreateInstance(element, { toggle: false }).show()
    )
  }

  setState(state) {
    /* eslint-disable no-unreachable */
    throw new Error("setState", state)
    this.state = {...this.state, ...state}
  }

  setError(errorList) {
    $(this.element).find(".gridchooser")
      .addClass("error")
    this.open()
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
    /* eslint-disable no-unreachable */
    throw new Error("getValue", this.state)
    return this.state
  }

  getTextLabel(opts) {
    return null
  }

  focus(opts) {
    this.open()
  }
}

export class GridChoiceBlockDefinition extends window.wagtailStreamField.blocks.FieldBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    return new GridChoiceBlock(this, placeholder, prefix, initialState, initialError)
  }
}
