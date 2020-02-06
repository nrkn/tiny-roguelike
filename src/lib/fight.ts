import { clt } from './util/random'

export const fight = ( attack: number, defense: number ) => {
  const attackStrength = clt( attack )
  const defenseStrength = clt( defense )

  return attackStrength - defenseStrength
}
