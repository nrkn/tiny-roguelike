import { Point } from './geometry/types'
import { GridData, Bit } from './grid/types'

export type Game = {
  draw: ( timestamp: number ) => ImageData
  action: ActionHandler
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Action = Direction

export type ActionHandler = ( action: Action ) => void

export type Rgb = [ number, number, number ]

export type Sprite = {
  bitmap: GridData<Bit>
  color: Rgb
}

export type Level = {
  map: GridData<number>
  monsters: GridData<Monster>
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
