import { randomDirection, directionModifiers } from './geometry/direction'
import { GridData } from './grid/types'
import { gridSet, gridGet } from './grid'

export const createTunnels = ( numTiles: number ) => {
  const grid: GridData<number> = {}

  let x = 0
  let y = 0

  gridSet( grid, x, y, 1 )

  let tileCount = 1

  while( tileCount < numTiles ){
    const direction = randomDirection()
    const modifier = directionModifiers[ direction ]

    x += modifier.x
    y += modifier.y

    if ( gridGet( grid, x, y ) !== 1 ) {
      gridSet( grid, x, y, 1 )

      tileCount++
    }
  }

  return grid
}
