import isRemovableNode from 'util/isRemovableNode'
import { Component, node } from '../../lib'

describe('util/isRemovableNode', () => {
  it('should consider null or boolean as removable', () => {
    expect(isRemovableNode(null)).toBeTruthy()
    expect(isRemovableNode(true)).toBeTruthy()
    expect(isRemovableNode(false)).toBeTruthy()

    class SampleComponent extends Component {
      render () {
        return node('sample component')
      }
    }

    expect(isRemovableNode(new SampleComponent())).toBeFalsy()

    const sampleNode = node('sample node')

    expect(isRemovableNode(sampleNode)).toBeFalsy()
  })
})
