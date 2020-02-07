import { stairsUpId, stairsDownId, ghostId, devilId, floorId } from './consts'
import { createTunnels } from '../lib/map/tunnel'
import { pick, randInt, clt } from '../lib/util/random'
import { gridGetBoundingRect, gridSet, gridGet, gridKeys } from '../lib/grid'
import { GridData } from '../lib/grid/types'
import { BoundingRect, Point } from '../lib/geometry/types'
import { Level, Monster } from './types'

export const createLevel = ( currentLevel: number ) => {
  const monsterCount = currentLevel * 5
  const mapSize = currentLevel * 100

  const map = createTunnels( mapSize )
  const bounds = gridGetBoundingRect( map )
  const points = gridKeys( map )

  const start = points[ 0 ]
  const player = points[ 1 ]
  const end = points[ points.length - 1 ]

  ensureWalkable( map, player.x, player.y )

  if( currentLevel > 1 ){
    gridSet( map, start.x, start.y, stairsUpId )
  }

  gridSet( map, end.x, end.y, stairsDownId )

  const monsters = createMonsters( monsterCount, map, bounds, player )

  const level: Level = { map, monsters }

  return level
}

const ensureWalkable = ( grid: GridData<number>, x: number, y: number ) => {
  for( let dy = -1; dy < 2; dy++ ){
    for( let dx = -1; dx < 2; dx++ ){
      gridSet( grid, dx + x, dy + y, floorId )
    }
  }
}

const createMonsters = (
  count: number, map: GridData<number>, bounds: BoundingRect, playerStart: Point
) => {
  const { x, y, width, height } = bounds
  const monsters: GridData<Monster> = {}

  const canPlace = ( x: number, y: number ) => {
    if( x === playerStart.x && y === playerStart.y ) return false
    if ( gridGet( map, x, y ) !== floorId ) return false
    if ( gridGet( monsters, x, y ) ) return false

    return true
  }

  for ( let i = 0; i < count; i++ ) {
    const monster = randomMonster()

    let mx = randInt( width ) + x
    let my = randInt( height ) + y

    while ( !canPlace( mx, my ) ) {
      mx = randInt( width ) + x
      my = randInt( height ) + y
    }

    gridSet( monsters, mx, my, monster )
  }

  return monsters
}

// 2:1 for ghosts
const monsterTypes = [ ghostId, ghostId, devilId ]

const randomMonster = () => {
  const id = pick( monsterTypes )

  let attack = 0
  let defense = 0
  let health = 0

  if ( id === ghostId ) {
    attack = randInt( 2 ) + 2
    defense = randInt( 3 ) + 2
    health = randInt( 2 ) + 3
  }

  if ( id === devilId ) {
    attack = clt( 5 ) + 1
    defense = clt( 3 ) + 1
    health = clt( 3 ) + 3
  }

  const monster: Monster = {
    attack, defense, health, id
  }

  return monster
}
