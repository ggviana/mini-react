import isRemovableElement from 'util/isRemovableElement'
import isDomElement from 'util/isDomElement'
import reconcileChildren from 'reconcileChildren'
import updateDom from 'util/updateDom'
import { createInstanceFromElement } from './render'

const isDifferentInstance = (instance, element) => instance.element.type !== element.type

export default function reconcile (parentDom, instance, element) {
  if (instance == null) {
    return createInstance(parentDom, element)
  } else if (isRemovableElement(element)) {
    return removeInstance(parentDom, instance)
  } else if (isDifferentInstance(instance, element)) {
    return replaceInstance(parentDom, instance, element)
  } else { return updateInstance(parentDom, instance, element) }
}

function createInstance (parentDom, element) {
  const instance = createInstanceFromElement(element)

  parentDom.appendChild(instance.dom)

  return instance
}

function removeInstance (parentDom, instance) {
  parentDom.removeChild(instance.dom)
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
