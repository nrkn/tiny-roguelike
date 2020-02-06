import { Sprite, Rgb } from './types'
import { arrayGridGet } from './grid/array'
import { strideGridSet } from './grid/stride'

export const compositeColor = ( sprites: Sprite[], x: number, y: number ) => {
  for( let i = 0; i < sprites.length; i++ ){
    const { bitmap, color } = sprites[ i ]

    if ( arrayGridGet( bitmap, x, y ) ) return color
  }
}
export const drawSprites = (
  imageData: ImageData, sprites: Sprite[], x: number, y: number, background: Rgb
) => {
  const { width, height } = imageData

  for ( let spriteY = 0; spriteY < 8; spriteY++ ) {
    const viewY = y + spriteY

    if( viewY >= height ) continue

    for ( let spriteX = 0; spriteX < 8; spriteX++ ) {
      const viewX = x + spriteX

      if( viewX >= width ) continue

      const [ r, g, b ] = (
        compositeColor( sprites, spriteX, spriteY ) || background
      )

      strideGridSet( imageData, viewX, viewY, [ r, g, b, 255 ], 4 )
    }
  }
}
