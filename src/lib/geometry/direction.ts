import { pick } from '../util/random'
import { Direction } from '../types'

export const directionModifiers = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

export const directions: Direction[] = [ 'up', 'down', 'left', 'right' ]

export const randomDirection = () => pick( directions )
