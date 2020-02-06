import {
  SparseGridData, SparseGridCb, SparseGridMap, SparseGridFilter
} from './types'
import { Point, BoundingRect } from '../../geometry/types'
import { emptyBoundingRect } from '../../geometry/rect'

export const sparseGridDelete = <T>(
  data: SparseGridData<T>, x: number, y: number
) => {
  if (data[y] && data[y][x] !== undefined) {
    delete data[y][x]

    if (!Object.keys(data[y]).length) delete data[y]

    return true
  }

  return false
}

export const sparseGridGet = <T>(
  data: SparseGridData<T>, x: number, y: number
): T | undefined => {
  if (!data[y]) return

  return data[y][x]
}

export const sparseGridSet = <T>(
  data: SparseGridData<T>, x: number, y: number, value: T
) => {
  if (data[y] === undefined) data[y] = {}

  data[y][x] = value

  return data
}

export const sparseGridForEach = <T>(
  data: SparseGridData<T>,
  cb: SparseGridCb<T, any>
) => {
  const yKeys = Object.keys(data).map(Number)

  for (let i = 0; i < yKeys.length; i++) {
    const y = yKeys[i]
    const xKeys = Object.keys(data[y]).map(Number)

    for (let j = 0; j < xKeys.length; j++) {
      const x = xKeys[j]

      const value = data[y][x]

      if (cb(value, x, y, data) === -1) return
    }
  }
}

export const sparseGridKeys = (data: SparseGridData<any>) => {
  const keys: Point[] = []

  sparseGridForEach(data, (_v, x, y) => keys.push({ x, y }))

  return keys
}

export const sparseGridEntries = <T>(data: SparseGridData<T>) => {
  const values: T[] = []

  sparseGridForEach(data, value => values.push(value))

  return values
}

export const sparseGridBoundingRect = (data: SparseGridData<any>) => {
  let left = Number.MAX_SAFE_INTEGER
  let top = Number.MAX_SAFE_INTEGER
  let right = Number.MIN_SAFE_INTEGER
  let bottom = Number.MIN_SAFE_INTEGER
  let any = false

  sparseGridForEach(data, (_value, x, y) => {
    if (x < left) left = x
    if (y < top) top = y
    if (x > right) right = x
    if (y > bottom) bottom = y

    any = true
  })

  if (!any) return emptyBoundingRect()

  const x = left
  const y = top
  const width = (right - left) + 1
  const height = (bottom - top) + 1

  const rect: BoundingRect = { left, top, right, bottom, x, y, width, height }

  return rect
}
