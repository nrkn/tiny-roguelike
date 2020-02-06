import { ArrayishGrid, GridCb } from '../types'

export type ArrayGrid<T> = ArrayishGrid<T, T[]>

export type ArrayGridCb<T, Result> =
  GridCb<T, ArrayGrid<T>, Result>
