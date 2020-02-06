import { createArrayGrid, arrayGridForEach, arrayGridSet } from '../array'
import { Bit } from './types'
import { createSequence } from '../../util/array'

export const createBitmap = ( values: string[] ) => {
  let width = 0

  const bits = values.map( s => s.trim().split( '' ) ).filter( s => {
    if ( s.length ) {
      width = s.length > width ? s.length : width

      return true
    }
  } )

  const height = bits.length

  const bitmap = createArrayGrid<Bit>(
    width, height, createSequence<Bit>( width * height, () => 0 )
  )

  arrayGridForEach(
    bitmap,
    ( _value, x, y ) => {
      if ( bits[ y ][ x ] === '1' ) {
        arrayGridSet( bitmap, x, y, 1 )
      }
    }
  )

  return bitmap
}


