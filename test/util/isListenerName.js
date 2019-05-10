import isListenerName from 'util/isListenerName'

describe('util/isListenerName', () => {
  it('should return true to listener-like names', () => {
    expect(isListenerName('onchange')).toBeTruthy()
    expect(isListenerName('onkeyup')).toBeTruthy()
    expect(isListenerName('onclick')).toBeTruthy()
    expect(isListenerName('ondrag')).toBeTruthy()
    expect(isListenerName('onload')).toBeTruthy()
  })

  it('should return false to other property names', () => {
    expect(isListenerName('tagName')).toBeFalsy()
    expect(isListenerName('min')).toBeFalsy()
    expect(isListenerName('type')).toBeFalsy()
    expect(isListenerName('max')).toBeFalsy()
    expect(isListenerName('value')).toBeFalsy()
  })
})
