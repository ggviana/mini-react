import node from './node'
import updateComponentInstance from './util/updateComponentInstance'

export default class Component {
  constructor (props = {}) {
    this.props = props
    this.state = this.state || null
  }

  willMount () {}

  didMount () {}

  willUnmount () {}

  didUnmount () {}

  setState (stateMutator) {
    return new Promise(resolve => {
      const newState = typeof stateMutator === 'function'
        ? stateMutator(this.state)
        : stateMutator

      this.state = Object.assign({}, this.state, newState)
      updateComponentInstance(this.__internalInstance)
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
