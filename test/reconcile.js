import reconcile from 'reconcile'
import { unmount } from 'render'
import node from 'node'
import Component from 'Component'

describe('reconcile', () => {
  beforeEach(() => unmount(testRoot))

  it('should create a instance when there is no previous root instance', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null,  element)

    expect(instance).toBeDefined()
    expect(instance.dom).toBeInstanceOf(HTMLParagraphElement)
    expect(instance.element).toMatchObject(element)
  })

  it('should remove from the tree null instances', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null,  element)
    expect(testRoot.children.length).toBe(1)

    reconcile(testRoot, instance, null)
    expect(testRoot.children.length).toBe(0)
  })

  it('should replace when instances differ in completely', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null,  element)
    expect(testRoot.children.length).toBe(1)
    expect(instance.dom).toBeInstanceOf(HTMLParagraphElement)

    const newElement = node({
      tagName: 'h1',
      textContent: 'New title'
    })

    const newInstance = reconcile(testRoot, instance, newElement)
    expect(testRoot.children.length).toBe(1)
    expect(newInstance.dom).toBeInstanceOf(HTMLHeadingElement)
    expect(newInstance.dom.textContent).toBe("New title")
  })

  it('should not update the instance when nothing changed', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null,  element)
    expect(testRoot.children.length).toBe(1)
    expect(instance.dom).toBeInstanceOf(HTMLParagraphElement)
    expect(instance.dom.textContent).toBe("Title")

    const newElement = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const newInstance = reconcile(testRoot, instance, newElement)
    expect(testRoot.children.length).toBe(1)
    expect(newInstance.dom).toBeInstanceOf(HTMLParagraphElement)
    expect(newInstance.dom.textContent).toBe("Title")
  })

  it('should update the instance when a prop change', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Text'
    })

    const instance = reconcile(testRoot, null,  element)
    expect(testRoot.children.length).toBe(1)
    expect(instance.dom).toBeInstanceOf(HTMLParagraphElement)
    expect(instance.dom.textContent).toBe(element.props.textContent)

    const newElement = node({
      tagName: 'p',
      textContent: 'New text'
    })

    const newInstance = reconcile(testRoot, instance, newElement)
    expect(testRoot.children.length).toBe(1)
    expect(newInstance.dom).toBeInstanceOf(HTMLParagraphElement)
    expect(newInstance.dom.textContent).toBe(newElement.props.textContent)
  })

  it('should update the instance when a prop changes a component element', () => {
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

    const instance = reconcile(testRoot, null,  element)
    expect(testRoot.children.length).toBe(1)
    expect(instance.dom).toBeInstanceOf(HTMLLabelElement)
    expect(instance.dom.textContent).toBe("Current value: 1")

    const newElement = node({
      componentClass: Label,
      value: 2
    })

    const newInstance = reconcile(testRoot, instance, newElement)
    expect(testRoot.children.length).toBe(1)
    expect(newInstance.dom).toBeInstanceOf(HTMLLabelElement)
    expect(newInstance.dom.textContent).toBe("Current value: 2")
  })
})
