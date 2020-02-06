import { Action, Sprite, Rgb } from '../lib/types'

import {
  viewWidth, viewHeight, floorId, centerRow, centerCol, viewRows, viewCols,
  tileHeight, tileWidth, ghostId, devilId, stairsDownId, stairsUpId
} from './consts'

import { createLevel } from './map'

import {
  sparseGridGet, sparseGridKeys, sparseGridDelete, sparseGridSet
} from '../lib/grid/sparse'

import { arrayGridGet } from '../lib/grid/array'
import { randomDirection } from '../lib/geometry/direction'
import { translate, scale } from '../lib/geometry/point'

import {
  playerSprite, ghostSprite, devilSprite, stairsDownSprite, stairsUpSprite
} from './data/sprites'

import { drawSprites } from '../lib/sprite'
import { pointInRect } from '../lib/geometry/rect'

export const createGame = () => {
  const imageData = new ImageData( viewWidth, viewHeight )

  let level = createLevel( 10 )
  const { x: px, y: py } = level.map.start

  const player = {
    x: px,
    y: py,
    attack: 6,
    defense: 6,
    health: 12
  }

  const action = ( action: Action ) => {
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

    const mapRect = {
      x: 0, y: 0, width: level.map.grid.width, height: level.map.grid.height
    }

    for ( let vy = 0; vy < viewRows; vy++ ) {
      const dy = vy * tileHeight
      const my = mapOffset.y + vy

      for ( let vx = 0; vx < viewCols; vx++ ) {
        const dx = vx * tileWidth
        const mx = mapOffset.x + vx

        const sprites: Sprite[] = []

        let background: Rgb = [ 0, 0, 255 ]

        if ( !pointInRect( mapRect, { x: mx, y: my } ) ) {
          drawSprites( imageData, sprites, dx, dy, background )

          continue
        }


        if ( vx === centerCol && vy === centerRow ) {
          sprites.push( playerSprite )
        }

        const monster = sparseGridGet( level.monsters, mx, my )

        if ( monster ) {
          if ( monster.id === ghostId ) {
            sprites.push( ghostSprite )
          }

          if( monster.id === devilId ){
            sprites.push( devilSprite )
          }
        }

        const mapTile = arrayGridGet( level.map.grid, mx, my )

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

  const move = ( action: Action, x: number, y: number ) => {
    if ( action === 'up' ) y--
    if ( action === 'down' ) y++
    if ( action === 'left' ) x--
    if ( action === 'right' ) x++

    if ( x < 0 ) return
    if ( y < 0 ) return
    if ( x >= level.map.grid.width ) return
    if ( y >= level.map.grid.height ) return

    if ( canMove( x, y ) ) return { x, y }
  }

  const canMove = ( x: number, y: number ) =>
    isFloor( x, y ) && !isMonster( x, y )

  const isFloor = ( x: number, y: number ) =>
    arrayGridGet( level.map.grid, x, y ) === floorId

  const isMonster = ( x: number, y: number ) =>
    sparseGridGet( level.monsters, x, y ) !== undefined

  const tick = () => {
    const monsterPoints = sparseGridKeys( level.monsters )

    monsterPoints.forEach( ( { x, y } ) => {
      const newPoint = move( randomDirection(), x, y )

      if ( !newPoint ) return

      const { x: nx, y: ny } = newPoint

      const monster = sparseGridGet( level.monsters, x, y )

      if ( nx === player.x && ny === player.y ) {
        //attack

        return
      }

      sparseGridDelete( level.monsters, x, y )
      sparseGridSet( level.monsters, nx, ny, monster )
    } )
  }

  return { action, draw }
}
