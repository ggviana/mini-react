import isDomElement from 'util/isDomElement'
import isRemovableElement from 'util/isRemovableElement'
import updateDom from 'util/updateDom'
import Component from 'Component'
import reconcile from 'reconcile'

let root = null

export default function render (config, parentDom) {
  if (isRemovableElement(config)) return

  const element = config instanceof Component ? config.toElement() : config

  const prev = root
  const next = reconcile(parentDom, prev, element)
  root = next
}

export function unmount (parentDom) {
  if (root != null) {
    root = reconcile(parentDom, root, null)
  }

  for(let child of parentDom.children) {
    child.remove()
  }
}

export function createInstanceFromElement (element) {
  const { children = [], props } = element

  const instance = {}

  if (isDomElement(element)) {
    const dom = element.type === 'TEXT_NODE'
      ? document.createTextNode('')
      : document.createElement(element.type)

    updateDom(dom, props)

    const childInstances = children
      .filter(child => !isRemovableElement(child))
      .map(createInstanceFromElement)

    // Append children
    childInstances.forEach(child => {
      dom.appendChild(child.dom)
    })

    return Object.assign(instance, {
      childInstances,
      dom,
      element: Object.assign({}, element)
    })
  } else {
    const componentInstance = createComponentInstanceFromElement(element, instance)
    const childElement = componentInstance.render()
    const childInstance = createInstanceFromElement(childElement)
    const dom = childInstance.dom

    return Object.assign(instance, {
      componentInstance,
      childInstance,
      dom,
      element: Object.assign({}, element)
    })
  }
}

export function createComponentInstanceFromElement (element, internalInstance) {
  const { type: Component, props } = element
  const instance = new Component(props)
  instance.__internalInstance = internalInstance
  return instance
}
