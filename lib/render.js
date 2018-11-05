import updateDom from 'util/updateDom'

let root = null

export default function render (element, parent) {
  if (isRemovableElement(element)) return

  const prev = root
  const next = reconcile(parent, prev, element)
  root = next
}

function reconcile (parent, instance, element) {
  let newInstance = null

  if (instance == null) {
    // New element, create it

    newInstance = createInstance(element)

    parent.appendChild(newInstance.dom)
  } else if (isRemovableElement(element)) {
    // Remove null or undefined
    parent.removeChild(instance.dom)
  } else if (instance.element.type === element.type) {
    // Update

    newInstance = Object.assign({}, instance)

    newInstance.dom = updateDom(instance.dom, element.props)
    newInstance.element = element
    newInstance.childInstances = reconcileChildren(instance, element)
  } else {
    // Replace entire instance

    newInstance = createInstance(element)
    parent.replaceChild(newInstance.dom, instance.dom)
  }

  return newInstance
}

function reconcileChildren (instance, element) {
  const { childInstances, dom } = instance
  const { children: nextChildren = [] } = element

  const length = Math.max(childInstances.length, nextChildren.length)

  return Array.from({ length }, (_, i) => i)
    .map(i => reconcile(dom, childInstances[i], nextChildren[i]))
}

function createInstance (element) {
  const { type, children = [], props } = element
  const dom = updateDom(document.createElement(type), props)

  const childInstances = children.filter(child => !isRemovableElement(child)).map(createInstance)

  // Append children
  childInstances.forEach(child => {
    dom.appendChild(child.dom)
  })

  return {
    childInstances,
    dom,
    element
  }
}

function isRemovableElement (element) {
  return element === true || element === false || element == null
}
