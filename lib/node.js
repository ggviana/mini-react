export default function node (config) {
  const { componentClass, tagName, children = [], props = {}, ...remaining } = config

  const normalized = {
    children,
    props: Object.assign({}, remaining, props)
  }

  if (typeof tagName === 'string') {
    normalized.type = tagName
  } else if (typeof componentClass === 'function') {
    normalized.type = componentClass
  } else {
    throw new Error('The node configuration should either have a `componentClass` ot a `tagName`')
  }

  return normalized
}
