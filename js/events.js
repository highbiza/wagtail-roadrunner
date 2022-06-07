export const GRID_SIZE_CHANGED_EVENT = "GRID_SIZE_CHANGED_EVENT"

export const createGridSizeChanged = (size, breakpoint) => new CustomEvent(GRID_SIZE_CHANGED_EVENT, {
  bubbles: true,
  detail: { size, breakpoint },
})
