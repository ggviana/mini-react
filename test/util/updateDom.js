import updateDom from 'util/updateDom'

describe('util/updateDom', () => {
  const click = dom => dom.dispatchEvent(new MouseEvent('click'))

  it('sets a attribute of a dom node', () => {
    let button = document.createElement('button')

    button = updateDom(button, {
      textContent: 'Click here'
    })

    expect(button.textContent).toBe('Click here')
  })

  it('sets the className', () => {
    let button = document.createElement('button')

    button = updateDom(button, {
      className: 'btn-primary'
    })

    expect(button.classList.toString()).toBe('btn-primary')
  })

  it('updates the attribute of a dom node', () => {
    let button = document.createElement('button')

    button = updateDom(button, {
      textContent: 'Click here'
    })

    button = updateDom(button, {
      textContent: 'Click me'
    })

    expect(button.textContent).toBe('Click me')
  })

  it('remove old attributes of a dom node', () => {
    let button = document.createElement('button')

    const oldProps = {
      textContent: 'Click here',
      name: 'select',
      value: 'true'
    }

    const newProps = {
      textContent: 'Click me'
    }

    button = updateDom(button, oldProps)

    button = updateDom(button, newProps, oldProps)

    expect(button.textContent).toBe('Click me')
    expect(button.name).toBe('')
    expect(button.value).toBe('')
  })

  it('subscribes events of a dom node', () => {
    let button = document.createElement('button')
    const onclick = jest.fn()

    button = updateDom(button, {
      onclick
    })

    click(button)

    expect(onclick).toBeCalled()
  })

  it('unsubscribes old events of a dom node', () => {
    let button = document.createElement('button')
    const oldProps = {
      textContent: 'Click here',
      onclick: jest.fn()
    }

    const newProps = {
      textContent: 'Click me'
    }

    button = updateDom(button, oldProps)

    click(button)

    button = updateDom(button, newProps, oldProps)

    click(button)

    expect(oldProps.onclick).toHaveBeenCalledTimes(1)
  })
})
