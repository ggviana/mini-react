import reconcileChildren from 'reconcileChildren'
import node from 'node'
import { unmount } from 'render'
import reconcile from '../lib/reconcile'

describe('reconcileChildren', () => {
  beforeEach(() => unmount(testRoot))

  it('should create all new child elements', () => {
    const element = node({
      tagName: 'ol'
    })

    const instance = reconcile(testRoot, null, element)
    expect(instance.dom.children.length).toBe(0)

    const newElement = node({
      tagName: 'ol',
      children: [
        node({
          tagName: 'li',
          textContent: 1
        }),
        node({
          tagName: 'li',
          textContent: 2
        }),
        node({
          tagName: 'li',
          textContent: 3
        })
      ]
    })

    const reconciledChildren = reconcileChildren(instance, newElement)
    expect(reconciledChildren).toBeInstanceOf(Array)
    expect(reconciledChildren.length).toBe(3)
    expect(instance.dom.children.length).toBe(3)

    const renderedChildren = testRoot.querySelectorAll('li')
    expect(renderedChildren.length).toBe(3)
  })

  it('should remove all nullified child elements', () => {
    const element = node({
      tagName: 'ol',
      children: [
        node({
          tagName: 'li',
          textContent: 1
        }),
        node({
          tagName: 'li',
          textContent: 2
        }),
        node({
          tagName: 'li',
          textContent: 3
        })
      ]
    })

    const instance = reconcile(testRoot, null, element)
    expect(instance.dom.children.length).toBe(3)

    const newElement = node({
      tagName: 'ol',
      children: [
        node({
          tagName: 'li',
          textContent: 1
        }),
        null,
        node({
          tagName: 'li',
          textContent: 3
        })
      ]
    })

    const reconciledChildren = reconcileChildren(instance, newElement)
    expect(reconciledChildren).toBeInstanceOf(Array)
    expect(reconciledChildren.length).toBe(3)
    expect(instance.dom.children.length).toBe(2)

    const renderedChildren = testRoot.querySelectorAll('li')
    expect(renderedChildren.length).toBe(2)

    expect(testRoot.innerHTML).toBe('<ol><li>1</li><li>3</li></ol>')
  })

  it('should update/replace all child elements', () => {
    const element = node({
      tagName: 'div',
      children: [
        node({
          tagName: 'h1',
          textContent: 'Title'
        }),
        node({
          tagName: 'h2',
          textContent: 'Subtitle'
        }),
        node({
          tagName: 'p',
          textContent: 3
        })
      ]
    })

    const instance = reconcile(testRoot, null, element)

    const newElement = node({
      tagName: 'div',
      children: [
        node({
          tagName: 'p',
          textContent: 'Title'
        }),
        node({
          tagName: 'h2',
          textContent: 'New subtitle'
        }),
        node({
          tagName: 'p',
          textContent: 3
        })
      ]
    })

    reconcileChildren(instance, newElement)

    const paragraphs = testRoot.querySelectorAll('p')
    expect(paragraphs.length).toBe(2)

    const heading = testRoot.querySelector('h2')
    expect(heading.textContent).toBe('New subtitle')
  })
})
