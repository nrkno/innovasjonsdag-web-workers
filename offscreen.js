import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'

const SEED = 'skjalg-2023-10-28'
let noise2D = createNoise2D(alea(SEED))
let noise3D = createNoise3D(alea(SEED))
let noise4D = createNoise4D(alea(SEED))

onmessage = evt => {
  console.log({ ...evt.data })
  const canvas = evt.data.canvas
  /**
   * @type CanvasRenderingContext2D
   */
  const ctx = canvas.getContext('2d')

  // 25 frames per second for 5 seconds => 125 frames per loop
  const TOTALT_FRAME_N = 25 * 5
  const TWO_PI = Math.PI * 2

  let W, H, x0, y0

  const periodicFunction = (progress, offset, x, y) => {
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

  const getRadialOffset = (x, y) => Math.sqrt(Math.pow(x - evt.data.cx, 2) + Math.pow(y - evt.data.cy, 2))

  const drawFrame = n => {
    let progress = n / TOTALT_FRAME_N
    ctx.fillStyle = '#000'
    
    // console.log({progress})
    ctx.fillRect(0, 0, evt.data.wW, evt.data.hH)
    ctx.save()

    ctx.globalCompositeOperation = 'lighter'
    // console.log({ x0: evt.data.x0, W: evt.data.W })
    // Loop over all pixels inside margin on the x-axis
    for (let i = evt.data.x0; i < evt.data.W; i += 8) {
      // Loop over all pixels inside margin on the y-axis
      for (let j = evt.data.y0; j < evt.data.H; j += 8) {
        let x = i
        let y = j
        const distancefactor = getRadialOffset(x, y) / getRadialOffset(0, 0)
        const vertdistancefactor = getRadialOffset(0, y) / getRadialOffset(0, 0)

        const g = 75 * 2
        const r = 1 * (1 + 65 * vertdistancefactor)
        const b = 128 * 2
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        const taper = 50 * (1 - 0.9 * distancefactor)

        let dx = taper * periodicFunction(progress - 0.001 * getRadialOffset(x, y), 0, x, y)
        let dy = taper * periodicFunction(progress - 0.001 * getRadialOffset(x, y), 150, x, y)

        ctx.beginPath()
        ctx.arc(x + dx, y + dy, 1, 0, TWO_PI)
        ctx.fill()
      }
    }

    ctx.restore()
  }

  const loop = frameN => {
    // console.log({ frameN })
    drawFrame(frameN)
    if (frameN < TOTALT_FRAME_N) {
      requestAnimationFrame(loop.bind(null, frameN + 1))
    } else {
      requestAnimationFrame(loop.bind(null, 0))
    }
  }

  loop(0)
}
