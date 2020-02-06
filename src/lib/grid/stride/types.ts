import { GridCb, ArrayishGrid } from '../types'

export type StrideGridCb<T, Result> =
  GridCb<T[], ArrayishGrid<T>, Result>