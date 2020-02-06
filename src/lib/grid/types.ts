import { Size } from '../geometry/types'

export type Arrayish<T> = {
  length: number
  [ n: number ]: T
}

export type ArrayishGrid<T, Data = Arrayish<T>> = Size & { data: Data }

export type GridCb<Value, Grid, Result> = (
  value: Value, x: number, y: number, grid: Grid
) => Result
