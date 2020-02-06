import { createBitmap } from '../../lib/grid/bitmap'

export const playerBitmap = createBitmap(
  [
    '00000000',
    '00111100',
    '01000000',
    '01010100',
    '01000000',
    '00111100',
    '01111110',
    '00100100'
  ]
)


export const ghostBitmap = createBitmap(
  [
    '00000000',
    '00000000',
    '00011100',
    '00111110',
    '00101010',
    '00111110',
    '00101010',
    '00000000',
  ]
)

export const devilBitmap = createBitmap(
  [
    '00000000',
    '00000000',
    '00100100',
    '00111100',
    '00101000',
    '00111100',
    '01111110',
    '00100100'
  ]
)

export const stairsUpBitmap = createBitmap(
  [
    '00111100',
    '00100100',
    '01111110',
    '01000010',
    '11111111',
    '10000001',
    '11111111',
    '00000000',
  ]
)

export const stairsDownBitmap = createBitmap(
  [
    '11111111',
    '00000000',
    '01111110',
    '00000000',
    '00111100',
    '00000000',
    '00011000',
    '00000000',
  ]
)
