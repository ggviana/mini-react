import updateDom from 'util/updateDom'
import isRemovableElement from 'util/isRemovableElement'

let root = null

export default function render (config, parent) {
  if (isRemovableElement(config)) return

  const element = config.isComponent ? config.toElement() : config

  const prev = root
  const next = reconcile(parent, prev, element)
  root = next
}

export function reconcile (parent, instance, element) {
  if (instance == null) {
    // Create instance

    const newInstance = createInstance(element)

    parent.appendChild(newInstance.dom)

    return newInstance
  } else if (isRemovableElement(element)) {
    // Remove nullified elements

    parent.removeChild(instance.dom)

    return null
  } else if (instance.element.type !== element.type) {
    // Replace instance

    const newInstance = createInstance(element)
    parent.replaceChild(newInstance.dom, instance.dom)

    return newInstance
  } else if (typeof element.type === 'string') {
    // Update element instances

    return Object.assign({}, instance, {
      childInstances: reconcileChildren(instance, element),
      dom: updateDom(instance.dom, element.props),
      element
    })
  } else {
    // Update component instances

    instance.componentInstance.props = element.props
    const childElement = instance.componentInstance.render()
    const childInstance = reconcile(parent, instance.childInstance, childElement)

    return Object.assign({}, instance, {
      childInstance,
      dom: childElement.dom,
      element
    })
  }
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
  const isDomElement = typeof type === 'string'

  if (isDomElement) {
    const dom = updateDom(type === '' ? document.createTextNode('') : document.createElement(type), props)

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
  } else {
    const instance = {}

    const componentInstance = createComponentInstance(element, instance)
    const childElement = componentInstance.render()
    const childInstance = createInstance(childElement)
    const dom = childInstance.dom

    return Object.assign(instance, { dom, element, childInstance, componentInstance })
  }
}

function createComponentInstance (element, internalInstance) {
  const { type: Component, props } = element
  const instance = new Component(props)
  instance.__internalInstance = internalInstance
  return instance
}
