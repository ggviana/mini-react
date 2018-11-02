import isListener from './isListener'

export default function isAttribute (name) {
  return !isListener(name)
}
