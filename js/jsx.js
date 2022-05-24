import dom from 'jsx-render'


export const renderInPlaceHolder = (targetPlaceholder, element) => {
  // find placeholders first, because if it's a DocumentFragment, it will
  // be empty after being added to the dom
  const parent = targetPlaceholder.parentNode
  const dataJsxPlaceholders = element.querySelectorAll('[data-jsx-placeholder]')

  // add element to the dom
  parent.replaceChild(element, targetPlaceholder);

  // if the element was a DocumentFragment it has now been emptied when
  // adding the contained elements to the dom. In that case treat the new
  // parent of the elements that used to be in the DocumentFragment as the
  // element
  if (!element.childElementCount) {
    element = parent
  }

  // create result object with placeholders extracted.
  if (dataJsxPlaceholders.length == 1) {
    return {
      element,
      placeholder: dataJsxPlaceholders[0],
    }
  }
  
  if (dataJsxPlaceholders.length > 1) {
    return {
      element,
      placeholders: dataJsxPlaceholders,
    }
  }

  return {
    element
  }
}

export const PlaceHolder = () => (<div data-jsx-placeholder=""></div>)