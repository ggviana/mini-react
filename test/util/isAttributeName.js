import isAttributeName from 'util/isAttributeName'

describe('util/isAttributeName', () => {
  it('should return true to other property names', () => {
    expect(isAttributeName('tagName')).toBeTruthy()
    expect(isAttributeName('min')).toBeTruthy()
    expect(isAttributeName('type')).toBeTruthy()
    expect(isAttributeName('max')).toBeTruthy()
    expect(isAttributeName('value')).toBeTruthy()
  })

  it('should return false to listener-like names', () => {
    expect(isAttributeName('onchange')).toBeFalsy()
    expect(isAttributeName('onkeyup')).toBeFalsy()
    expect(isAttributeName('onclick')).toBeFalsy()
    expect(isAttributeName('ondrag')).toBeFalsy()
    expect(isAttributeName('onload')).toBeFalsy()
  })
})
