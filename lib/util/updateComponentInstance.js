import reconcile from '../reconcile'

export default function updateComponentInstance (instance) {
  const parent = instance.dom.parentNode
  const element = instance.element
  reconcile(parent, instance, element)
}
