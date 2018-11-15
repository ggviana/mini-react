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
    normalized.type = ''
  }

  return normalized
}
