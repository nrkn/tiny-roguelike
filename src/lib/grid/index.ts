import { GridData } from './types'
import { Point, BoundingRect } from '../geometry/types'
import { emptyBoundingRect } from '../geometry/rect'

export const gridDelete = (
  data: GridData<any>, x: number, y: number
) => {
  const key = x + ',' + y

  if( !(key in data) ) return false

  delete data[ key ]

  return true
}

export const gridGet = <T>(
  data: GridData<T>, x: number, y: number
): T | undefined =>
  data[ x + ',' + y ]

export const gridSet = <T>(
  data: GridData<T>, x: number, y: number, value: T
) => {
  data[ x + ',' + y ] = value

  return data
}

export const Stop = Symbol( 'Stop' )

export const gridForEach = <T>(
  data: GridData<T>,
  cb: (
    value: T, x: number, y: number, i: number, data: GridData<T>
  ) => any
) => {
  const keys = Object.keys( data )

  for( let i = 0; i < keys.length; i++ ){
    const key = keys[ i ]
    const value = data[ key ]
    const [ x, y ] = key.split( ',' ).map( Number )

    const result = cb( value, x, y, i, data )

    if( result === Stop ) break
  }
}

export const gridKeys = ( data: GridData<any> ) => {
  const keys = Object.keys( data )
  const points = new Array<Point>( keys.length )

  for( let i = 0; i < keys.length; i++ ){
    const [ x, y ] = keys[ i ].split( ',' ).map( Number )

    points[ i ] = { x, y }
  }

  return points
}

export const gridValues = <T>( data: GridData<T> ) => {
  const keys = Object.keys( data )
  const values = new Array<T>( keys.length )

  for( let i = 0; i < keys.length; i++ )
    values[ i ] = data[ keys[ i ] ]

  return values
}

export const gridEntries = <T>( data: GridData<T> ) => {
  const keys = Object.keys( data )
  const entries = new Array<[ Point, T]>()

  for( let i = 0; i < keys.length; i++ ){
    const key = keys[ i ]
    const [ x, y ] = key.split( ',' ).map( Number )

    entries[ i ] = [ { x, y }, data[ key ] ]
  }

  return entries
}

export const gridEntry = <T>(
  data: GridData<T>, i: number
): [ Point, T ] | undefined => {
  const keys = Object.keys( data )
  const key = keys[ i ]

  if( key === undefined ) return

  const [ x, y ] = key.split( ',' ).map( Number )

  return [ { x, y }, data[ key ] ]
}

export const gridSize = ( data: GridData<any> ) =>
  Object.keys( data ).length

export const gridGetBoundingRect = ( data: GridData<any> ) => {
  const keys = Object.keys( data )

  if( keys.length === 0 ) return emptyBoundingRect()

  let left = Number.MAX_VALUE
  let right = Number.MIN_VALUE
  let top = Number.MAX_VALUE
  let bottom = Number.MIN_VALUE

  for( let i = 0; i < keys.length; i++ ){
    const [ x, y ] = keys[ i ].split( ',' ).map( Number )

    if( x < left ) left = x
    if( x > right ) right = x
    if( y < top ) top = y
    if( y > bottom ) bottom = y
  }

  const width = (right - left) + 1
  const height = (bottom - top) + 1

  const rect: BoundingRect = {
    left, right, top, bottom, x: left, y: top, width, height
  }

  return rect
}

