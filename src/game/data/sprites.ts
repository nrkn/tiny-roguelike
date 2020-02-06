import { Sprite } from '../../lib/types'

import {
  playerBitmap, ghostBitmap, devilBitmap, stairsDownBitmap, stairsUpBitmap
} from './bitmaps'

export const playerSprite: Sprite = {
  bitmap: playerBitmap,
  color: [ 0, 0, 0 ]
}

export const ghostSprite: Sprite = {
  bitmap: ghostBitmap,
  color: [ 255, 0, 255 ]
}

export const devilSprite: Sprite = {
  bitmap: devilBitmap,
  color: [ 255, 32, 0 ]
}

export const stairsDownSprite: Sprite = {
  bitmap: stairsDownBitmap,
  color: [ 255, 255, 255 ]
}

export const stairsUpSprite: Sprite = {
  bitmap: stairsUpBitmap,
  color: [ 64, 64, 255 ]
}
