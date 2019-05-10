import reconcile from 'reconcile'

export default function reconcileChildren (instance, element) {
  const { childInstances, dom } = instance
  const { children: nextChildren = [] } = element

  const length = Math.max(childInstances.length, nextChildren.length)

  return Array
    .from({ length }, (_, i) => i)
    .map(i => reconcile(dom, childInstances[i], nextChildren[i]))
}
