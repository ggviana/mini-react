import isDomElement from 'util/isDomElement'
import isRemovableNode from 'util/isRemovableNode'
import updateDom from 'util/updateDom'
import Component from './Component'

let root = null

export default function render (config, parent) {
  if (isRemovableNode(config)) return

  const node = config instanceof Component ? config.toNode() : config

  const prev = root
  const next = reconcile(parent, prev, node)
  root = next
}

export function reconcile (parent, instance, node) {
  if (instance == null) {
    // Create instance

    const newInstance = createInstance(node)

    parent.appendChild(newInstance.dom)

    return newInstance
  } else if (isRemovableNode(node)) {
    // Remove nullified nodes

    parent.removeChild(instance.dom)

    return null
  } else if (instance.node.type !== node.type) {
    // Replace instance

    const newInstance = createInstance(node)
    parent.replaceChild(newInstance.dom, instance.dom)

    return newInstance
  } else if (isDomElement(node)) {
    // Update node instances

    return Object.assign({}, instance, {
      childInstances: reconcileChildren(instance, node),
      dom: updateDom(instance.dom, node.props),
      node
    })
  } else {
    // Update component instances

    instance.componentInstance.props = node.props
    const childNode = instance.componentInstance.render()
    const childInstance = reconcile(parent, instance.childInstance, childNode)

    return Object.assign({}, instance, {
      childInstance,
      dom: childNode.dom,
      node
    })
  }
}

function reconcileChildren (instance, node) {
  const { childInstances, dom } = instance
  const { children: nextChildren = [] } = node

  const length = Math.max(childInstances.length, nextChildren.length)

  return Array.from({ length }, (_, i) => i)
    .map(i => reconcile(dom, childInstances[i], nextChildren[i]))
}

function createInstance (node) {
  const { children = [], props } = node

  const instance = {}

  if (isDomElement(node)) {
    const dom = node.type === 'TEXT_NODE'
      ? document.createTextNode('')
      : document.createElement(node.type)

    updateDom(dom, props)

    const childInstances = children
      .filter(child => !isRemovableNode(child))
      .map(createInstance)

    // Append children
    childInstances.forEach(child => {
      dom.appendChild(child.dom)
    })

    return Object.assign(instance, {
      childInstances,
      dom,
      node
    })
  } else {
    const componentInstance = createComponentInstance(node, instance)
    const childNode = componentInstance.render()
    const childInstance = createInstance(childNode)
    const dom = childInstance.dom

    return Object.assign(instance, {
      componentInstance,
      childInstance,
      dom,
      node
    })
  }
}

function createComponentInstance (node, internalInstance) {
  const { type: Component, props } = node
  const instance = new Component(props)
  instance.__internalInstance = internalInstance
  return instance
}
