import { SparseMap } from './types'
import { randomDirection, directionModifiers } from './geometry/direction'
import { SparseGridData } from './grid/sparse/types'
import { sparseGridSet, sparseGridGet } from './grid/sparse'

export const createTunnels = ( numTiles: number ) => {
  const data: SparseGridData<number> = {}

  let x = 0
  let y = 0

  sparseGridSet( data, x, y, 1 )

  const start = { x, y }

  let tileCount = 1

  while( tileCount < numTiles ){
    const direction = randomDirection()
    const modifier = directionModifiers[ direction ]

    x += modifier.x
    y += modifier.y

    if( sparseGridGet( data, x, y ) !== 1 ){
      sparseGridSet( data, x, y, 1 )

      tileCount++
    }
  }

  const end = { x, y }

  const tileMap: SparseMap = { data, start, end }

  return tileMap
}
