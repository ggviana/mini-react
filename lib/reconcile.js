import isRemovableElement from 'util/isRemovableElement'
import isDomElement from 'util/isDomElement'
import isDifferentInstance from 'util/isDifferentInstance'
import reconcileChildren from 'reconcileChildren'
import updateDom from 'util/updateDom'
import { createInstanceFromElement } from './render'

export default function reconcile (parentDom, instance, element) {
  switch (true) {
    case instance == null:
      return createInstance(parentDom, element)
    case isRemovableElement(element):
      return removeInstance(parentDom, instance)
    case isDifferentInstance(instance, element):
      return replaceInstance(parentDom, instance, element)
    default:
      return updateInstance(parentDom, instance, element)
  }
}

function createInstance (parentDom, element) {
  const instance = createInstanceFromElement(element)

  if (instance.componentInstance) {
    instance.componentInstance.willMount()
  }

  parentDom.appendChild(instance.dom)

  if (instance.componentInstance) {
    instance.componentInstance.didMount()
  }

  return instance
}

function removeInstance (parentDom, instance) {
  if (instance.componentInstance) {
    instance.componentInstance.willUnmount()
  }

  parentDom.removeChild(instance.dom)

  if (instance.componentInstance) {
    instance.componentInstance.didUnmount()
  }

  return null
}

function replaceInstance (parentDom, instance, element) {
  const newInstance = createInstanceFromElement(element)
  parentDom.replaceChild(newInstance.dom, instance.dom)

  return newInstance
}

function updateInstance (parentDom, instance, element) {
  if (isDomElement(element)) {
    // Update dom instances

    return Object.assign({}, instance, {
      childInstances: reconcileChildren(instance, element),
      dom: updateDom(instance.dom, element.props),
      element: Object.assign({}, element)
    })
  } else {
    // Update component instances

    instance.componentInstance.props = element.props
    const childElement = instance.componentInstance.render()
    const childInstance = reconcile(parentDom, instance.childInstance, childElement)

    return Object.assign({}, instance, {
      childInstance,
      dom: childInstance.dom,
      element: Object.assign({}, element)
    })
  }
}
