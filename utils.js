import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'

const SEED = 'skjalg-2023-10-28'
let noise2D = createNoise2D(alea(SEED))
let noise3D = createNoise3D(alea(SEED))
let noise4D = createNoise4D(alea(SEED))

export const getRadialOffset = (x, y, cx, cy) => Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))

export const TWO_PI = Math.PI * 2

export const getNoiseOffset = (progress, offset, x, y) => {
  const R = 1.6
  const S = 0.016
  // const S = 0.007
  const P = progress
  // console.log({progress: progress/10})
  // return progress/10;
  return noise2D(
    // return noise3D(
    // return noise4D(
    offset + R * Math.cos(P * TWO_PI),
    R * Math.sin(P * TWO_PI),
    S * y,
    S * x
  )
}