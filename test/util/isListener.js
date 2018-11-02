import isListener from 'util/isListener'

describe('util/isListener', () => {
  it('should return true to listener-like names', () => {
    expect(isListener('onchange')).toBeTruthy()
    expect(isListener('onkeyup')).toBeTruthy()
    expect(isListener('onclick')).toBeTruthy()
    expect(isListener('ondrag')).toBeTruthy()
    expect(isListener('onload')).toBeTruthy()
  })

  it('should return false to other property names', () => {
    expect(isListener('tagName')).toBeFalsy()
    expect(isListener('min')).toBeFalsy()
    expect(isListener('type')).toBeFalsy()
    expect(isListener('max')).toBeFalsy()
    expect(isListener('value')).toBeFalsy()
  })
})
