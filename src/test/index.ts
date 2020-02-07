import { createTunnels } from '../lib/map/tunnel'
import { logValues, logGrid } from './log'
import { createLevel } from '../game/map'
import { gridGetBoundingRect } from '../lib/grid'

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

const bounds = gridGetBoundingRect( tunnels )

console.log( bounds )

logGrid( tunnels )

console.log(
  gridGetBoundingRect( {} )
)

const level = createLevel( 10 )

logGrid( level.map )

const start = process.hrtime()
createLevel( 100 )
const end = process.hrtime( start )

console.log( end )
