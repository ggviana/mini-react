import isDomElement from 'util/isDomElement'
import isRemovableElement from 'util/isRemovableElement'
import updateDom from 'util/updateDom'
import Component from './Component'

let root = null

export default function render (config, parent) {
  if (isRemovableElement(config)) return

  const element = config instanceof Component ? config.toElement() : config

  const prev = root
  const next = reconcile(parent, prev, element)
  root = next
}

export function reconcile (parent, instance, element) {
  if (instance == null) {
    // Create instance

    const newInstance = createInstanceFromElement(element)

    parent.appendChild(newInstance.dom)

    return newInstance
  } else if (isRemovableElement(element)) {
    // Remove nullified nodes

    parent.removeChild(instance.dom)

    return null
  } else if (instance.element.type !== element.type) {
    // Replace instance

    const newInstance = createInstanceFromElement(element)
    parent.replaceChild(newInstance.dom, instance.dom)

    return newInstance
  } else if (isDomElement(element)) {
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

function createInstanceFromElement (element) {
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
      element
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
      element
    })
  }
}

function createComponentInstanceFromElement (element, internalInstance) {
  const { type: Component, props } = element
  const instance = new Component(props)
  instance.__internalInstance = internalInstance
  return instance
}
