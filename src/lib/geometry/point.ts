import { directionModifiers } from './direction'
import { Point } from './types'

export const translate = ( a: Point, b: Point ): Point => {
  const x = a.x + b.x
  const y = a.y + b.y

  return { x, y }
}

export const scale = ( a: Point, b: Point ): Point => {
  const x = a.x * b.x
  const y = a.y * b.y

  return { x, y }
}

export const getNeighbours = ( point: Point ) => {
  const up = translate( point, directionModifiers.up )
  const down = translate( point, directionModifiers.down )
  const left = translate( point, directionModifiers.left )
  const right = translate( point, directionModifiers.right )

  return { up, down, left, right }
}
