import { Component, render, node, unmount } from '../lib'
import reconcile from '../lib/reconcile'

describe('Component', () => {
  beforeEach(() => unmount(testRoot))

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
        state = {
          value: 0
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
        state = {
          value: 0
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
        state = {
          value: this.props.count
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

  it('calls the `willMount` before mounting', () => {
    const willMount = jest.fn(() => {
      expect(testRoot.querySelector('label')).toBe(null)
    })

    class Label extends Component {
      willMount = willMount

      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: 'Hello world'
          }
        })
      }
    }

    expect(willMount).not.toHaveBeenCalled()

    render(new Label(), testRoot)

    expect(willMount).toHaveBeenCalled()
  })

  it('calls the `didMount` after mounting', () => {
    const didMount = jest.fn(() => {
      expect(testRoot.querySelector('label')).toBeTruthy()
    })

    class Label extends Component {
      didMount = didMount

      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: 'Hello world'
          }
        })
      }
    }

    expect(didMount).not.toHaveBeenCalled()

    render(new Label(), testRoot)

    expect(didMount).toHaveBeenCalled()
  })

  it('calls the `willUnmount` after unmounting', () => {
    const willUnmount = jest.fn(() => {
      expect(testRoot.querySelector('label')).toBeTruthy()
    })

    class Label extends Component {
      willUnmount = willUnmount

      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: 'Hello world'
          }
        })
      }
    }

    render(new Label(), testRoot)

    expect(willUnmount).not.toHaveBeenCalled()

    unmount(testRoot)

    expect(willUnmount).toHaveBeenCalled()
  })

  it('calls the `didUnmount` after unmounting', () => {
    const didUnmount = jest.fn(() => {
      expect(testRoot.querySelector('label')).toBe(null)
    })

    class Label extends Component {
      didUnmount = didUnmount

      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: "Hello world"
          }
        })
      }
    }

    render(new Label(), testRoot)

    expect(didUnmount).not.toHaveBeenCalled()

    unmount(testRoot)

    expect(didUnmount).toHaveBeenCalled()
  })
})
