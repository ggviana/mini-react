import { Component, render, node } from '../lib'

describe('Component', () => {
  const click = dom => dom.dispatchEvent(new MouseEvent('click'))

  describe('render', () => {
    it('should throw a error when `render` is not implemented', () => {
      class BasketItem extends Component {

      }

      const item = new BasketItem({ product: 'batteries' })

      expect(() => item.render()).toThrow()
    })
  })

  describe('setState', () => {
    it('changes the state passing a function as stateMutator', () => {
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

      render(new Counter(), testRoot)

      const renderedButton = document.querySelector('button')
      expect(renderedButton.textContent).toBe(`Current count: 0`)

      click(renderedButton)
      expect(renderedButton.textContent).toBe(`Current count: 1`)
    })

    it('changes the state passing a object as stateMutator', () => {
      class Counter extends Component {
        constructor () {
          super()
          this.state = {
            value: 0
          }
        }

        increment () {
          this.setState({
            value: ++this.state.value
          })
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

      render(new Counter(), testRoot)

      const renderedButton = document.querySelector('button')
      expect(renderedButton.textContent).toBe(`Current count: 0`)

      click(renderedButton)
      expect(renderedButton.textContent).toBe(`Current count: 1`)
    })
  })

  describe('toElement', () => {
    it('returns a node node from a Component', () => {
      class Counter extends Component {
        constructor (props) {
          super(props)
          this.state = {
            value: props.count
          }
        }

        increment () {
          this.setState({
            value: ++this.state.value
          })
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

      const counter = new Counter({ count: 10 })

      const desiredNode = node({
        componentClass: Counter,
        props: {
          count: 10
        }
      })

      expect(counter.toElement()).toMatchObject(desiredNode)
    })
  })
})
