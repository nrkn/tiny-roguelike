import { SparseMap, GameMap } from '../lib/types'
import { createBitmap } from '../lib/grid/bitmap'
import { arrayGridGet } from '../lib/grid/array'
import { ArrayGrid } from '../lib/grid/array/types'
import { Bit } from '../lib/grid/bitmap/types'
import { sparseGridBoundingRect, sparseGridGet } from '../lib/grid/sparse'

export const logBitmap = ( bitmap: ArrayGrid<Bit> ) => {
  for ( let y = 0; y < bitmap.height; y++ ) {
    let row = ''

    for ( let x = 0; x < bitmap.width; x++ ) {
      row += arrayGridGet( bitmap, x, y ) ? '#' : '.'
    }

    console.log( row )
  }

  console.log( '='.repeat( 80 ) )
}

export const logValues = ( values: string[] ) =>
  logBitmap( createBitmap( values ) )

export const logSparseMap = ( map: SparseMap ) => {
  const { data, start, end } = map
  const { x: sx, y: sy, width, height } = sparseGridBoundingRect( data )

  for ( let y = 0; y < height; y++ ) {
    const dy = y + sy
    let row = ''

    for ( let x = 0; x < width; x++ ) {
      const dx = x + sx

      const value = sparseGridGet( data, dx, dy )

      let c = '#'

      if ( dx === start.x && dy === start.y ) {
        c = '<'
      } else if ( dx === end.x && dy === end.y ) {
        c = '>'
      } else if ( value ) {
        c = '.'
      }

      row += c
    }

    console.log( row )
  }

  console.log( '='.repeat( 80 ) )
}

export const logGameMap = ( map: GameMap ) => {
  const { grid, start, end } = map
  const { width, height } = grid

  for ( let y = 0; y < height; y++ ) {
    let row = ''

    for ( let x = 0; x < width; x++ ) {
      const value = arrayGridGet( grid, x, y )

      let c = '#'

      if ( x === start.x && y === start.y ) {
        c = '<'
      } else if ( x === end.x && y === end.y ) {
        c = '>'
      } else if ( value ) {
        c = '.'
      }

      row += c
    }

    console.log( row )
  }

  console.log( '='.repeat( 80 ) )
}
