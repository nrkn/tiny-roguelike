import { GridCb } from "../types"

export type SparseGridData<T> = {
  [ index: number ]: {
    [ index: number ]: T
  }
}

export type SparseGridCb<T, Result> =
  GridCb<T, SparseGridData<T>, Result>

export type SparseGridMap<T> = SparseGridCb<T, T>

export type SparseGridFilter<T> = SparseGridCb<T, boolean>
