import { pick } from '../util/random'
import { Action } from '../types'

export const directionModifiers = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

const directions: Action[] = [ 'up', 'down', 'left', 'right' ]

export const randomDirection = () => pick( directions )
