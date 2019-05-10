import isDifferentInstance from 'util/isDifferentInstance'
import reconcile from 'reconcile'
import node from 'node'

describe('util/isDifferentInstance', () => {
  it('should return false when the instance is of the same type', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null, element)

    expect(isDifferentInstance(instance, element)).toBeFalsy()
  })

  it('should return true when the instance is of the different type', () => {
    const element = node({
      tagName: 'p',
      textContent: 'Title'
    })

    const instance = reconcile(testRoot, null, element)

    element.type = 'h1'

    expect(isDifferentInstance(instance, element)).toBeTruthy()
  })
})
