export default function node (config) {
  const { componentClass, tagName, children = [], props = {}, ...remaining } = config

  const normalized = {
    children,
    props: Object.assign({}, remaining, props)
  }

  if (typeof config === 'string') {
    normalized.type = ''
    normalized.props.textContent = config
  } else if (typeof tagName === 'string') {
    normalized.type = tagName
  } else if (typeof componentClass === 'function') {
    normalized.type = componentClass
  }

  return normalized
}
