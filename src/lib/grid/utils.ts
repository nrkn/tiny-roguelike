import { Size } from '../geometry/types'

export const getIndex = ( { width }: Size, x: number, y: number ) =>
  y * width + x
