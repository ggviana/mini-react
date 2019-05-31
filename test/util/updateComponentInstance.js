import updateComponentInstance from 'util/updateComponentInstance'
import reconcile from 'reconcile'
import Component from 'Component'
import node from 'node'

describe('util/updateComponentInstance', () => {
  it('Re-render component with different props', () => {
    class Label extends Component {
      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: `Current value: ${this.props.value}`
          }
        })
      }
    }

    const element = node({
      componentClass: Label,
      value: 1
    })

    const instance = reconcile(testRoot, null, element)
    expect(testRoot.querySelector('label').textContent).toBe('Current value: 1')

    element.props.value = 2
    updateComponentInstance(instance)
    expect(testRoot.querySelector('label').textContent).toBe('Current value: 2')
  })
})
