import updateDom from 'util/updateDom'
import isRemovableNode from 'util/isRemovableNode'

let root = null

export default function render (config, parent) {
  if (isRemovableNode(config)) return

  const node = config.isComponent ? config.toNode() : config

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
  } else if (typeof node.type === 'string') {
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
  const { type, children = [], props } = node
  const isDomElement = typeof type === 'string'

  if (isDomElement) {
    const dom = updateDom(type === '' ? document.createTextNode('') : document.createElement(type), props)

    const childInstances = children.filter(child => !isRemovableNode(child)).map(createInstance)

    // Append children
    childInstances.forEach(child => {
      dom.appendChild(child.dom)
    })

    return {
      childInstances,
      dom,
      node
    }
  } else {
    const instance = {}

    const componentInstance = createComponentInstance(node, instance)
    const childNode = componentInstance.render()
    const childInstance = createInstance(childNode)
    const dom = childInstance.dom

    return Object.assign(instance, { dom, node, childInstance, componentInstance })
  }
}

function createComponentInstance (node, internalInstance) {
  const { type: Component, props } = node
  const instance = new Component(props)
  instance.__internalInstance = internalInstance
  return instance
}
