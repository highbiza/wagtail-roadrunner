import $ from "jquery"

let PRIVATE_WAGTAIL_CLASSES = {}

function getChildClass(parentClass) {

  if (PRIVATE_WAGTAIL_CLASSES[parentClass]) {
    return PRIVATE_WAGTAIL_CLASSES[parentClass]
  }
  const parent = document.createElement("div")
  const placeHolder = document.createElement("div")
  parent.appendChild(placeHolder)
  const ChildInstance = parentClass.prototype._createChild(
    {
      meta: {
        label: "",
        icon: ""
      },
      name: "",
      render: function() {return {}}
    },
    placeHolder,
    "",
    0,
    "",
    {},
    null,
    {}
  );
  
  const childClass = ChildInstance.constructor
  PRIVATE_WAGTAIL_CLASSES[parentClass] = childClass

  return childClass
}

export function getStreamChild() {
  return getChildClass(window.wagtailStreamField.blocks.StreamBlock)
}

export function getListChild() {
  return getChildClass(window.wagtailStreamField.blocks.ListBlock)
}
