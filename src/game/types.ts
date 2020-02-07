import { GridData } from '../lib/grid/types'
import { Point } from '../lib/geometry/types'

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
