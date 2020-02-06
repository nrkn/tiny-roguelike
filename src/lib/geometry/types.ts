export type Point = { x: number, y: number }

export type Size = { width: number, height: number }

export type Rect = Point & Size

export type Bounds = {
  left: number
  right: number
  top: number
  bottom: number
}

export type BoundingRect = Rect & Bounds
