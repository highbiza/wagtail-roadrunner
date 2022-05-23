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