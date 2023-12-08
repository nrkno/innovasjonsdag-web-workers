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

export const drawFrame = (canvas, ctx, frame, totalFrames, wW, hH, W, H, x0, y0, cx, cy) => {
  // console.log({canvas, ctx, frame, totalFrames, wW, hH, W, H, x0, y0, cx, cy})
  const getCenteredRadOffset = (x, y) => getRadialOffset(x, y, cx, cy)
  let progress = frame / totalFrames
  ctx.fillStyle = '#000'

  ctx.fillRect(0, 0, wW, hH)
  ctx.save()

  ctx.globalCompositeOperation = 'lighter'
  // Loop over all pixels inside margin on the x-axis
  for (let i = x0; i < W; i += 3) {
    // Loop over all pixels inside margin on the y-axis
    for (let j = y0; j < H; j += 20) {
      let x = i
      let y = j
      const distancefactor = getCenteredRadOffset(x, y) / getCenteredRadOffset(0, 0)
      const vertdistancefactor = getCenteredRadOffset(0, y) / getCenteredRadOffset(0, 0)

      const g = 75 * 2
      const r = 1 * (1 + 65 * vertdistancefactor)
      const b = 128 * 2
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      const taper = 50 * (1 - 0.9 * distancefactor)

      let dx = taper * getNoiseOffset(progress - 0.001 * getCenteredRadOffset(x, y), 0, x, y)
      let dy = taper * getNoiseOffset(progress - 0.001 * getCenteredRadOffset(x, y), 150, x, y)

      ctx.beginPath()
      ctx.arc(x + dx, y + dy, 1, 0, TWO_PI)
      ctx.fill()
    }
  }
  ctx.restore()
  const bitmap = canvas.transferToImageBitmap()
  return bitmap
}