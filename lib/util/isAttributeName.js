import isListenerName from './isListenerName'

export default function isAttributeName (name) {
  return !isListenerName(name)
}
