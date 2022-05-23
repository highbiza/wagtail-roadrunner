import dom from 'jsx-render'


export const renderInPlaceHolder = (targetPlaceholder, element) => {
  // find placeholders first, because if it's a DocumentFragment, it will
  // be empty after being added to the dom
  const dataJsxPlaceholders = element.querySelectorAll('[data-jsx-placeholder]')

  // add element to the dom
  targetPlaceholder.parentNode.replaceChild(element, targetPlaceholder);

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