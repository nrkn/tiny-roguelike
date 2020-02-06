export const randInt = ( exclMax: number ) =>
  Math.floor( Math.random() * exclMax )

export const pick = <T>( values: T[] ) => values[ randInt( values.length ) ]

export const clt = ( exclMax: number, samples = 3 ) => {
  let sum = 0

  for( let i = 0; i < samples; i++ ){
    sum += Math.random()
  }

  sum /= samples

  return Math.floor( sum * exclMax )
}
