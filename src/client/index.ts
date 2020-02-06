import { createGame } from '../game'

const canvas = document.querySelector( 'canvas' )!
const context = canvas.getContext( '2d' )!

const { action, draw } = createGame()

document.body.addEventListener( 'keydown', e => {
  if ( e.key === 'ArrowUp' ) action( 'up' )
  if ( e.key === 'ArrowDown' ) action( 'down' )
  if ( e.key === 'ArrowLeft' ) action( 'left' )
  if ( e.key === 'ArrowRight' ) action( 'right' )
} )

const tick = ( timestamp = 0 ) => {
  const imageData = draw( timestamp )

  if (
    imageData.width !== canvas.width ||
    imageData.height !== canvas.height
  ) {
    canvas.width = imageData.width
    canvas.height = imageData.height
  }

  context.putImageData( imageData, 0, 0 )

  requestAnimationFrame( tick )
}

tick()
