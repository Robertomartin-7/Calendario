import { describe, expect, it } from 'vitest'
import { fitSize } from './image'

describe('fitSize', () => {
  it('reduce el lado mayor a 1200 conservando la proporción', () => {
    expect(fitSize(4000, 3000, 1200)).toEqual({ w: 1200, h: 900 })
    expect(fitSize(3000, 4000, 1200)).toEqual({ w: 900, h: 1200 })
  })
  it('no amplía imágenes pequeñas', () => {
    expect(fitSize(800, 600, 1200)).toEqual({ w: 800, h: 600 })
  })
})
