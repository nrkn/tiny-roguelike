import { ArrayGrid, ArrayGridCb } from './types'
import { getIndex } from '../utils'

export const createArrayGrid = <T = any>(
  width: number, height: number, data?: T[]
) => {
  width |= 0
  height |= 0

  if ( width < 1 ) throw Error( 'Expected width to be greater than 0' )
  if ( height < 1 ) throw Error( 'Expected height to be greater than 0' )

  const size = width * height

  data = data || new Array<T>( size )

  if ( data.length !== size )
    throw Error( `Expected data to contain exactly ${ size } elements` )

  const arrayGrid: ArrayGrid<T> = { width, height, data }

  return arrayGrid
}

export const arrayGridGet = <T = any>(
  grid: ArrayGrid<T>, x: number, y: number
): T | undefined =>
  grid.data[ getIndex( grid, x, y ) ]

export const arrayGridSet = <T = any>(
  grid: ArrayGrid<T>, x: number, y: number, value: T
) => {
  grid.data[ getIndex( grid, x, y ) ] = value

  return grid
}

export const arrayGridForEach = <T = any>(
  grid: ArrayGrid<T>, cb: ArrayGridCb<T,any>
) => {
  const { width, height } = grid

  for ( let y = 0; y < height; y++ ) {
    for ( let x = 0; x < width; x++ ) {
      if (
        cb( arrayGridGet( grid, x, y )!, x, y, grid ) === -1
      ) return
    }
  }
}
