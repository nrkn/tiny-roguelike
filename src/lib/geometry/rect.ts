import { Rect, Point, BoundingRect } from './types'

export const pointInRect = ( rect: Rect, point: Point ) => {
  if ( point.x < rect.x ) return false
  if ( point.y < rect.y ) return false
  if ( point.x >= rect.x + rect.width ) return false
  if ( point.y >= rect.y + rect.height ) return false

  return true
}

export const emptyBoundingRect = () => {
  const left = 0
  const top = 0
  const right = 0
  const bottom = 0
  const x = 0
  const y = 0
  const width = 0
  const height = 0

  const rect: BoundingRect = { left, top, right, bottom, x, y, width, height }

  return rect
}
