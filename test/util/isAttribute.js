import isAttribute from 'util/isAttribute'

describe('util/isAttribute', () => {
  it('should return true to other property names', () => {
    expect(isAttribute('tagName')).toBeTruthy()
    expect(isAttribute('min')).toBeTruthy()
    expect(isAttribute('type')).toBeTruthy()
    expect(isAttribute('max')).toBeTruthy()
    expect(isAttribute('value')).toBeTruthy()
  })

  it('should return false to listener-like names', () => {
    expect(isAttribute('onchange')).toBeFalsy()
    expect(isAttribute('onkeyup')).toBeFalsy()
    expect(isAttribute('onclick')).toBeFalsy()
    expect(isAttribute('ondrag')).toBeFalsy()
    expect(isAttribute('onload')).toBeFalsy()
  })
})
