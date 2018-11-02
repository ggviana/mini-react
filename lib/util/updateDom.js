import isAttribute from 'util/isAttribute'
import isListener from 'util/isListener'

export default function updateDom (dom, nextProps = {}, prevProps = {}) {
  const {
    attributes: prevAttributes,
    listeners: prevListeners
  } = splitProps(prevProps)

  const {
    attributes: nextAttributes,
    listeners: nextListeners
  } = splitProps(nextProps)

  // Update attributes
  prevAttributes.forEach(propKey => {
    dom.removeAttribute(propKey)
  })

  nextAttributes.forEach(propKey => {
    dom[propKey] = nextProps[propKey]
  })

  // Update listeners
  prevListeners.forEach(listener => {
    dom.removeEventListener(getEventName(listener), prevProps[listener])
  })

  nextListeners.forEach(listener => {
    dom.addEventListener(getEventName(listener), nextProps[listener])
  })

  return dom
}

function splitProps (props) {
  const propKeys = Object.keys(props)

  return {
    attributes: propKeys.filter(isAttribute),
    listeners: propKeys.filter(isListener)
  }
}

function getEventName (text) {
  return text.toLowerCase().replace(/^on/, '')
}
