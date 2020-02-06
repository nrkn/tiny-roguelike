import { createBitmap } from '../lib/grid/bitmap'
import { GridData, Bit } from '../lib/grid/types'
import { gridGet, gridGetBoundingRect, gridKeys } from '../lib/grid'

export const logBitmap = ( bitmap: GridData<Bit> ) => {
  for ( let y = 0; y < bitmap.height; y++ ) {
    let row = ''

    for ( let x = 0; x < bitmap.width; x++ ) {
      row += gridGet( bitmap, x, y ) ? '#' : '.'
    }

    console.log( row )
  }

  console.log( '='.repeat( 80 ) )
}

export const logValues = ( values: string[] ) =>
  logBitmap( createBitmap( values ) )

export const logGrid = ( grid: GridData<number> ) => {
  const { x: sx, y: sy, width, height } = gridGetBoundingRect( grid )
  const points = gridKeys( grid )
  const start = points[ 0 ]
  const player = points[ 1 ]
  const end = points[ points.length - 1 ]

  for ( let y = 0; y < height; y++ ) {
    const dy = y + sy
    let row = ''

    for ( let x = 0; x < width; x++ ) {
      const dx = x + sx

      const value = gridGet( grid, dx, dy )

      let c = '#'

      if ( dx === start.x && dy === start.y ) {
        c = '<'
      } else if ( dx === end.x && dy === end.y ) {
        c = '>'
      } else if( dx === player.x && dy === player.y ){
        c = '@'
      } else if ( value ) {
        c = '.'
      }

      row += c
    }

    console.log( row )
  }

  console.log( '='.repeat( 80 ) )
}
