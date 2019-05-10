import node from './node'
import reconcile from 'reconcile'

export default class Component {
  constructor (props = {}) {
    this.props = props
    this.state = this.state || null
  }

  setState (stateMutator) {
    return new Promise(resolve => {
      const newState = typeof stateMutator === 'function'
        ? stateMutator(this.state)
        : stateMutator

      this.state = Object.assign({}, this.state, newState)
      updateOwnInstance(this.__internalInstance)
      resolve(this.state)
    })
  }

  render () {
    throw new Error(`The component ${this.constructor.name} should be implemented.`)
  }

  toElement () {
    return node({
      componentClass: this.constructor,
      props: this.props
    })
  }
}

function updateOwnInstance (internalInstance) {
  const parent = internalInstance.dom.parentNode
  const element = internalInstance.element
  reconcile(parent, internalInstance, element)
}
