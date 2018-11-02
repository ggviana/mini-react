export default function node (config) {
  const { tagName, children = [], props = {}, ...remaining } = config

  const normalized = {
    children,
    props: Object.assign({}, remaining, props)
  }

  if (typeof tagName === 'string') {
    normalized.type = tagName
  }

  return normalized
}
