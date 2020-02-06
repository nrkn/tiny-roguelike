import { ArrayGrid } from './grid/array/types'
import { Bit } from './grid/bitmap/types'
import { SparseGridData } from './grid/sparse/types'
import { Point } from './geometry/types'

export type Game = {
  draw: ( timestamp: number ) => ImageData
  action: ActionHandler
}

export type Action = 'up' | 'down' | 'left' | 'right'

export type ActionHandler = ( action: Action ) => void

export type Rgb = [ number, number, number ]

export type Sprite = {
  bitmap: ArrayGrid<Bit>
  color: Rgb
}

export type SparseMap = {
  data: SparseGridData<number>
  start: Point
  end: Point
}

export type GameMap = {
  grid: ArrayGrid<number>
  start: Point
  end: Point
}

export type Level = {
  map: GameMap
  monsters: SparseGridData<Monster>
}

export type Mob = {
  attack: number
  defense: number
  health: number
}

export type Player = Point & Mob

export type Identifiable = { id: number }

export type Monster = Mob & Identifiable

export type GameState = {
  player: Player
  currentLevel: number
  levels: Level[]
}
