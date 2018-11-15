import { node, Component } from '../lib'

describe('node', () => {
  const onchange = () => {}

  it('should create a normalized element object', () => {
    const element = node({
      tagName: 'input',
      type: 'range',
      min: 0,
      max: 100,
      value: 50,
      onchange
    })

    const desiredElement = {
      type: 'input',
      children: [],
      props: {
        type: 'range',
        min: 0,
        max: 100,
        value: 50,
        onchange
      }
    }


    expect(element).toMatchObject(desiredElement)
  })

  it('should be able to create a tree of components', () => {
    const element = node({
      tagName: 'section',
      children: [
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

    const desiredElement = {
      type: 'section',
      children: [
        {
          type: 'ul',
          children: [
            {
              type: 'li',
              props: {
                textContent: '1'
              }
            },
            {
              type: 'li',
              props: {
                textContent: '2'
              }
            },
            {
              type: 'li',
              props: {
                textContent: '3'
              }
            }
          ],
          props: {}
        }
      ]
    }

    expect(element).toMatchObject(desiredElement)
  })

  it('should be able to create a class component', () => {
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
      componentClass: Label,
      props: {
        text: 'Hello world'
      }
    })

    const desiredElement = {
      type: Label,
      children: [],
      props: {
        text: 'Hello world'
      }
    }

    expect(element).toMatchObject(desiredElement)
  })

  it('should throw when neither a `componentClass` ot a `tagName` is passed', () => {
    expect(() => node({
      children: [],
      props: {
        textContent: 'Hello world'
      }
    })).toThrow()
  })
})