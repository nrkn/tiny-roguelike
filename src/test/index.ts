import { createTunnels } from '../lib/map'
import { logValues, logSparseMap, logGameMap } from './log'
import { sparseGridBoundingRect, sparseGridKeys } from '../lib/grid/sparse'
import { createLevel } from '../game/map'

const playerValues = [
  '00000000',
  '00111100',
  '01000000',
  '01010100',
  '01000000',
  '00111100',
  '01111110',
  '00100100'
]

logValues( playerValues )

logValues( [
  '1111',
  '1001',
  '1001',
  '1111'
] )

logValues( [
  '111111111111'
] )

const tunnels = createTunnels( 100 )

console.log( tunnels )

const bounds = sparseGridBoundingRect( tunnels.data )

console.log( bounds )

logSparseMap( tunnels )

console.log(
  sparseGridBoundingRect( {} )
)

const level = createLevel( 2 )

console.log( level )

logGameMap( level.map )

const { start, end, data } = tunnels

const keys = sparseGridKeys( data )

console.log( start, end, keys.length )
console.log( JSON.stringify( keys ) )
