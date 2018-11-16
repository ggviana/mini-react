import isRemovableElement from 'util/isRemovableElement'
import { Component, node } from '../../lib'

describe('util/isRemovableElement', () => {
  it('should consider null or boolean as removable', () => {
    expect(isRemovableElement(null)).toBeTruthy()
    expect(isRemovableElement(true)).toBeTruthy()
    expect(isRemovableElement(false)).toBeTruthy()

    class SampleComponent extends Component {
      render () {
        return node({
          textContent: 'sample component'
        })
      }
    }

    expect(isRemovableElement(new SampleComponent())).toBeFalsy()

    const sampleNode = node({
      textContent: 'sample node'
    })

    expect(isRemovableElement(sampleNode)).toBeFalsy()
  })
})
