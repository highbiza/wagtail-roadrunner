import dom, {Fragment} from 'jsx-render'


const GRID_RE = new RegExp("col(?:-(?<breakpoint>xs|sm|md|lg|xl|xxl))?(?:-(?<size>\\d+))?");

function _wagtailGridSizeFromBootstrapGridSize(gridSize, editorGridSize) {
  const gridSizeRegex = new RegExp(`${editorGridSize}(?:-\\d+)?`);
  const match = gridSize.match(gridSizeRegex);
  if (match) {
    const [selectedGridSize] = match
    return selectedGridSize ? selectedGridSize.replaceAll(/-(xs|sm|md|lg|xl|xxl)?/g, "") : selectedGridSize
   
  }
}


export function wagtailGridSizeFromBootstrapGridSize(gridSizes, editorGridSize="col-lg") {
  const gridSize = gridSizes.join(" ")
  let wagtailGridSize = _wagtailGridSizeFromBootstrapGridSize(gridSize, editorGridSize)
  if (wagtailGridSize) {
    return wagtailGridSize
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
    return parseInt(match.groups.size)
  }
  return defaultSize
}


export function breakPointValue(gridSizes, gridSize) {
  let match, item;
  const { breakpoint } = gridSize.match(GRID_RE).groups
  for (var i = 0; i < gridSizes.length; i++) {
    item = gridSizes[i]
    match = item.match(GRID_RE)
    if (match && match.groups.breakpoint == breakpoint) {
      return item
    }
  }
  return ""
}


export const SvgIcon = ({ name }) => (
    <svg className={`icon ${name} default`} aria-hidden="true" focusable="false">
      <use href={`#${name}`}></use>
    </svg>
)

export const times = (num, callback) => {
  const result = Array(num)
  for (var i = 0; i < num; i++) {
    result[i] = callback(i)
  }
  return result
}