import isDomElement from 'util/isDomElement'
import node from 'node'
import { Component } from '../../lib'

describe('util/isDomElement', () => {
  it('should return true to Dom elements', () => {
    const target = node ({
      tagName: 'p',
      textContent: 'This is a paragraph'
    })

    expect(isDomElement(target)).toBeTruthy()
  })

  it('should return false to Component class elements', () => {
    class Counter extends Component {
      constructor () {
        super()
        this.state = {
          value: 0
        }
      }

      increment () {
        this.setState(state => ({
          value: ++state.value
        }))
      }

      render () {
        return node({
          tagName: 'button',
          props: {
            textContent: `Current count: ${this.state.value}`,
            onclick: () => this.increment()
          }
        })
      }
    }

    expect(isDomElement(new Counter)).toBeFalsy()
  })
})
