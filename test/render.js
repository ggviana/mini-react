import render, { unmount } from 'render'
import node from 'node'
import Component from 'Component'

const root = document.getElementById('testRoot')

describe('render', () => {
  it('renders the tree', () => {
    const tree = node({
      tagName: 'div',
      children: [
        node({
          tagName: 'h1',
          textContent: 'Hello world'
        }),
        node({
          tagName: 'ul',
          children: [
            node({
              tagName: 'li',
              textContent: '1'
            }),
            node({
              tagName: 'li',
              textContent: '2'
            }),
            node({
              tagName: 'li',
              textContent: '3'
            })
          ]
        })
      ]
    })

    render(tree, root)

    const h1 = document.querySelector('h1')
    expect(h1).not.toBe(null)
    expect(h1.textContent).toBe('Hello world')

    const ul = document.querySelector('ul')
    expect(ul.childElementCount).toBe(3)
  })

  it("doesn't render null, undefined and booleans", () => {
    render(null, root)
    render(undefined, root)
    render(true, root)
    render(false, root)

    const tree = node({
      tagName: 'section',
      children: [
        null,
        undefined,
        true,
        false,
        node({
          tagName: 'p',
          textContent: 'Hello world'
        })
      ]
    })

    render(tree, root)

    const container = document.querySelector('section')
    expect(container.childElementCount).toBe(1)
  })

  it('render Components instances', () => {
    class Label extends Component {
      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: this.props.text
          }
        })
      }
    }

    render(new Label({ text: 'Hello world' }), root)

    const label = document.querySelector('label')
    expect(label).not.toBe(null)
    expect(label.textContent).toBe('Hello world')
  })

  it('render a Component within a node', () => {
    class Label extends Component {
      render () {
        return node({
          tagName: 'label',
          props: {
            textContent: this.props.text
          }
        })
      }
    }

    const element = node({
      tagName: 'section',
      children: [
        node({
          componentClass: Label,
          props: {
            text: 'Hello world'
          }
        })
      ]
    })

    render(element, root)

    const label = document.querySelector('label')
    expect(label).not.toBe(null)
    expect(label.textContent).toBe('Hello world')
  })

  it('unmount the application', () => {
    unmount(testRoot)

    expect(testRoot.childNodes.length).toBe(0)
  })
})
