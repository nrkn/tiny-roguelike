import { Sprite, Rgb } from './types'
import { gridGet } from './grid'

export const compositeColor = ( sprites: Sprite[], x: number, y: number ) => {
  for( let i = 0; i < sprites.length; i++ ){
    const { bitmap, color } = sprites[ i ]

    if ( gridGet( bitmap, x, y ) ) return color
  }
}

export const drawSprites = (
  imageData: ImageData, sprites: Sprite[], x: number, y: number, background: Rgb
) => {
  const { width, height } = imageData

  for ( let spriteY = 0; spriteY < 8; spriteY++ ) {
    const viewY = y + spriteY

    if( viewY >= height || viewY < 0 ) continue

    for ( let spriteX = 0; spriteX < 8; spriteX++ ) {
      const viewX = x + spriteX

      if( viewX >= width || viewX < 0 ) continue

      const index = viewY * width + viewX
      const destIndex = index * 4

      const [ r, g, b ] = (
        compositeColor( sprites, spriteX, spriteY ) || background
      )

      imageData.data[ destIndex ] = r
      imageData.data[ destIndex + 1 ] = g
      imageData.data[ destIndex + 2 ] = b
      imageData.data[ destIndex + 3 ] = 255
    }
  }
}
