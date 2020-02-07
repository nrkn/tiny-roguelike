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
