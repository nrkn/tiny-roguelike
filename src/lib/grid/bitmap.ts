import { Bit, GridData } from './types'
import { gridSet } from '.'

export const createBitmap = ( values: string[] ) => {
  const data: GridData<Bit> = {}

  for( let y = 0; y < values.length; y++ ){
    const row = values[ y ]

    for( let x = 0; x < row.length; x++ ){
      gridSet( data, x, y, row[ x ] === '1' ? 1 : 0 )
    }
  }

  return data
}
