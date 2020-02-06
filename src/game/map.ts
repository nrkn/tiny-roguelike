import { Level, GameMap, Monster } from '../lib/types'
import { stairsUpId, stairsDownId, ghostId, devilId, floorId } from './consts'

import {
  sparseGridBoundingRect, sparseGridForEach, sparseGridGet, sparseGridSet
} from '../lib/grid/sparse'

import { createTunnels } from '../lib/map'
import { translate, scale } from '../lib/geometry/point'
import { createArrayGrid, arrayGridSet, arrayGridGet } from '../lib/grid/array'
import { createSequence } from '../lib/util/array'
import { pick, randInt, clt } from '../lib/util/random'
import { ArrayGrid } from '../lib/grid/array/types'
import { SparseGridData } from '../lib/grid/sparse/types'

export const createLevel = ( currentLevel: number ) => {
  const monsterCount = currentLevel * 5
  const mapSize = currentLevel * 100

  const tunnels = createTunnels( mapSize )
  const bounds = sparseGridBoundingRect( tunnels.data )

  const { width, height } = bounds
  const translateBy = scale( bounds, { x: -1, y: -1 } )
  const start = translate( tunnels.start, translateBy )
  const end = translate( tunnels.end, translateBy )

  const grid = createArrayGrid<number>(
    width, height, createSequence( width * height, () => 0 )
  )

  sparseGridForEach( tunnels.data, ( value, x, y ) => {
    const dest = translate( { x, y }, translateBy )

    if( value === 1 ) value = floorId

    arrayGridSet( grid, dest.x, dest.y, value )
  } )

  arrayGridSet( grid, start.x, start.y, stairsUpId )
  arrayGridSet( grid, end.x, end.y, stairsDownId )

  const map: GameMap = { grid, start, end }
  const monsters = createMonsters( monsterCount, grid )

  const level: Level = { map, monsters }

  return level
}

const createMonsters = ( count: number, grid: ArrayGrid<number> ) => {
  const { width, height } = grid
  const monsters: SparseGridData<Monster> = {}

  const canPlace = ( x: number, y: number ) => {
    if( arrayGridGet( grid, x, y ) !== floorId ) return false
    if( sparseGridGet( grid, x, y ) ) return false

    return true
  }

  for ( let i = 0; i < count; i++ ) {
    const monster = randomMonster()

    let x = randInt( width )
    let y = randInt( height )

    while ( !canPlace( x, y ) ) {
      x = randInt( width )
      y = randInt( height )
    }

    sparseGridSet( monsters, x, y, monster )
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