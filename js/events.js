import EventEmitter from "events"

export const GRID_SIZE_CHANGED_EVENT = "GRID_SIZE_CHANGED_EVENT"

export const createGridSizeChanged = (size, breakpoint) => new CustomEvent(GRID_SIZE_CHANGED_EVENT, {
  bubbles: true,
  detail: { size, breakpoint },
})

export const BREAKPOINT_MOBILE = "col"
export const BREAKPOINT_TABLET = "col-md"
export const BREAKPOINT_SCREEN = "col-lg"
const BREAKPOINT_CHANGED_EVENT = "BREAKPOINT_CHANGED_EVENT"


class BreakPointEmitter extends EventEmitter {
  constructor() {
    super()
    this.current = BREAKPOINT_SCREEN
    this.setMaxListeners(100)
  }
  dispatch(type) {
    this.emit(BREAKPOINT_CHANGED_EVENT, type)
    this.current = type
  }

  addListener(callback) {
    this.on(BREAKPOINT_CHANGED_EVENT, callback)
  }
}

export const breakPointEmitter = new BreakPointEmitter()
