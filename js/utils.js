import dom from 'jsx-render'


const GRID_RE = new RegExp("col(?:-(?<breakpoint>xs|sm|md|lg|xl|xxl))?(?:-(?<size>\\d+))?")

function _wagtailGridsize(selectedGridSize) {
  return selectedGridSize ? selectedGridSize.replaceAll(/-(xs|sm|md|lg|xl|xxl)?/g, "") : selectedGridSize
}

function _wagtailGridSizeFromBootstrapGridSize(gridSize, editorGridSize) {
  const gridSizeRegex = new RegExp(`${editorGridSize}-\\d+`)
  const match = gridSize.match(gridSizeRegex)
  if (match) {
    const [selectedGridSize] = match
    return  _wagtailGridsize(selectedGridSize)
  }

  return undefined
}


export function breakPointValue(gridSizes, gridSize) {
  let item=null,
    match=null
  const { breakpoint } = gridSize.match(GRID_RE).groups
  for (let i = 0; i < gridSizes.length; i++) {
    item = gridSizes[i]
    match = item.match(GRID_RE)
    if (match && match.groups.breakpoint == breakpoint) {
      return item
    }
  }
  return ""
}


export function breakPointFallback(gridSizes, gridSize) {
  let breakpoints = ["col-lg", "col-md", "col"]
  const klats = breakpoints.indexOf(gridSize)
  breakpoints = breakpoints.slice(klats)
  for (let i = 0; i < breakpoints.length; i++) {
    const result = breakPointValue(gridSizes, breakpoints[i])
    if (result) {
      return result
    }
  }
  return ""
}


export function wagtailGridSizeFromBootstrapGridSize(gridSizes, editorGridSize="col-lg") {
  const gridSize = gridSizes.join(" ")
  let wagtailGridSize = _wagtailGridSizeFromBootstrapGridSize(gridSize, editorGridSize)
  if (wagtailGridSize) {
    return wagtailGridSize
  }
  wagtailGridSize = breakPointFallback(gridSizes, editorGridSize)
  if (wagtailGridSize) {
    return _wagtailGridsize(wagtailGridSize)
  }

  wagtailGridSize = _wagtailGridSizeFromBootstrapGridSize(gridSize, "col")
  if (wagtailGridSize) {
    return wagtailGridSize
  }

  return "col12"
}


export function cols(gridSize, defaultSize=0) {
  const match = GRID_RE.exec(gridSize)
  if (match) {
    return parseInt(match.groups.size, 10)
  }
  return defaultSize
}


export const SvgIcon = ({ name }) => (
  <svg className={`icon ${name} default`} aria-hidden="true" focusable="false">
    <use href={`#${name}`}></use>
  </svg>
)

export const times = (num, func) => {
  const result = Array(num)
  for (let i = 0; i < num; i++) {
    result[i] = func(i)
  }
  return result
}


export function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  return rect.top >= 0 && rect.top < window.innerHeight
}


const observeDOM = (() => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  return (obj, callback) => {
    if (!obj || obj.nodeType !== 1) {
      return null
    }

    if (MutationObserver) {
      // define a new observer
      const mutationObserver = new MutationObserver(callback)
      // have the observer observe foo for changes in children
      mutationObserver.observe(obj, { subtree:true, attributes:true, attributeFilter:["value"] })
      return mutationObserver
    } else if (window.addEventListener){
    // browser support fallback
      return obj.addEventListener('DOMAttrModified', callback, false)
    }

    return null
  }
})()


export function onHiddenInputValueChanged(el, handler) {
  return observeDOM(el, handler)
}

