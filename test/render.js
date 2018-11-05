import render from 'render'
import node from 'node'

const root = document.getElementById('root')

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

  it('doesnt render null, undefined and booleans', () => {
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
        }),
      ]
    })

    render(tree, root)

    const container = document.querySelector('section')
    expect(container.childElementCount).toBe(1)
  })
})
