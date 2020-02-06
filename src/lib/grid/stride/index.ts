import { ArrayishGrid } from '../types'
import { getIndex } from '../utils'
import { StrideGridCb } from './types'
import { createSequence } from '../../util/array'

export const strideGridGet = <T>(
  grid: ArrayishGrid<T>, x: number, y: number, stride: number
) => {
  const index = getIndex( grid, x, y ) * stride

  return createSequence( stride, i => grid.data[ index + i ] )
}

export const strideGridSet = <T>(
  grid: ArrayishGrid<T>, x: number, y: number, value: T[], stride: number
) => {
  const index = getIndex( grid, x, y ) * stride

  for ( let i = 0; i < stride; i++ )
    grid.data[ index + i ] = value[ i ]

  return grid
}

export const strideGridForEach = <T>(
  grid: ArrayishGrid<T>, cb: StrideGridCb<T,any>, stride: number
) => {
  const { width, height } = grid

  for ( let y = 0; y < height; y++ ) {
    for ( let x = 0; x < width; x++ ) {
      if (
        cb( strideGridGet( grid, x, y, stride ), x, y, grid ) === -1
      ) return
    }
  }
}
