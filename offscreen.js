import { TWO_PI, getNoiseOffset, getRadialOffset } from './utils'

onmessage = evt => {
  const { cx, cy, x0, y0, W, H, wW, hH, canvas } = evt.data
  const getCenteredRadOffset = (x, y) => getRadialOffset(x, y, cx, cy)

  const /** @type CanvasRenderingContext2D */ ctx = canvas.getContext('2d')

  // 25 frames per second for 5 seconds => 125 frames per loop
  const TOTALT_FRAME_N = 25 * 5

  const drawFrame = n => {
    let progress = n / TOTALT_FRAME_N
    ctx.fillStyle = '#000'

    // console.log({progress})
    ctx.fillRect(0, 0, wW, hH)
    ctx.save()

    ctx.globalCompositeOperation = 'lighter'
    // console.log({ x0: x0, W: W })
    // Loop over all pixels inside margin on the x-axis
    for (let i = x0; i < W; i += 5) {
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
