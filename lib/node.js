export default function node (config) {
  const { componentClass, tagName, children = [], props = {}, ...remaining } = config

  const node = {
    children,
    props: Object.assign({}, remaining, props)
  }

  if (typeof config === 'string') {
    node.type = 'TEXT_NODE'
    node.props.textContent = config
  } else if (typeof tagName === 'string') {
    node.type = tagName
  } else if (typeof componentClass === 'function') {
    node.type = componentClass
  }

  return node
}
