import { Direction, Sprite, Rgb } from '../lib/types'

import {
  viewWidth, viewHeight, floorId, centerRow, centerCol, viewRows, viewCols,
  tileHeight, tileWidth, ghostId, devilId, stairsDownId, stairsUpId
} from './consts'

import { createLevel } from './map'

import { randomDirection } from '../lib/geometry/direction'
import { translate, scale } from '../lib/geometry/point'

import {
  playerSprite, ghostSprite, devilSprite, stairsDownSprite, stairsUpSprite
} from './data/sprites'

import { drawSprites } from '../lib/sprite'
import { pointInRect } from '../lib/geometry/rect'
import { gridGet, gridKeys, gridDelete, gridSet, gridGetBoundingRect } from '../lib/grid'

export const createGame = () => {
  const imageData = new ImageData( viewWidth, viewHeight )

  let level = createLevel( 10 )

  const points = gridKeys( level.map )
  const mapBounds = gridGetBoundingRect( level.map )

  const { x: px, y: py } = points[ 1 ]

  const player = {
    x: px,
    y: py,
    attack: 6,
    defense: 6,
    health: 12
  }

  const action = ( action: Direction ) => {
    const newPoint = move( action, player.x, player.y )

    if ( newPoint ) {
      Object.assign( player, newPoint )
    }

    tick()
  }

  const draw = ( timestamp: number ) => {
    const mapOffset = translate(
      player,
      scale( { x: centerCol, y: centerRow }, { x: -1, y: -1 } )
    )

    for ( let vy = 0; vy < viewRows; vy++ ) {
      const dy = vy * tileHeight
      const my = mapOffset.y + vy

      for ( let vx = 0; vx < viewCols; vx++ ) {
        const dx = vx * tileWidth
        const mx = mapOffset.x + vx

        const sprites: Sprite[] = []

        let background: Rgb = [ 0, 0, 255 ]

        if ( !pointInRect( mapBounds, { x: mx, y: my } ) ) {
          drawSprites( imageData, sprites, dx, dy, background )

          continue
        }

        if ( vx === centerCol && vy === centerRow ) {
          sprites.push( playerSprite )
        }

        const monster = gridGet( level.monsters, mx, my )

        if ( monster ) {
          if ( monster.id === ghostId ) {
            sprites.push( ghostSprite )
          }

          if( monster.id === devilId ){
            sprites.push( devilSprite )
          }
        }

        const mapTile = gridGet( level.map, mx, my )

        if( mapTile ){
          background = [ 255, 255, 255 ]

          if ( mapTile === stairsDownId ) {
            background = [ 0, 0, 128 ]
            sprites.push( stairsDownSprite )
          }

          if ( mapTile === stairsUpId ) {
            sprites.push( stairsUpSprite )
          }
        }

        drawSprites( imageData, sprites, dx, dy, background )
      }
    }

    return imageData
  }

  const move = ( action: Direction, x: number, y: number ) => {
    if ( action === 'up' ) y--
    if ( action === 'down' ) y++
    if ( action === 'left' ) x--
    if ( action === 'right' ) x++

    if ( canMove( x, y ) ) return { x, y }
  }

  const canMove = ( x: number, y: number ) =>
    isFloor( x, y ) && !isMonster( x, y )

  const isFloor = ( x: number, y: number ) =>
    gridGet( level.map, x, y ) === floorId

  const isMonster = ( x: number, y: number ) =>
    gridGet( level.monsters, x, y ) !== undefined

  const tick = () => {
    const monsterPoints = gridKeys( level.monsters )

    monsterPoints.forEach( ( { x, y } ) => {
      const newPoint = move( randomDirection(), x, y )

      if ( !newPoint ) return

      const { x: nx, y: ny } = newPoint

      const monster = gridGet( level.monsters, x, y )

      if ( nx === player.x && ny === player.y ) {
        //attack

        return
      }

      gridDelete( level.monsters, x, y )
      gridSet( level.monsters, nx, ny, monster )
    } )
  }

  return { action, draw }
}
