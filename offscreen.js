import { drawFrame } from './utils'

onmessage = evt => {
  const { cx, cy, x0, y0, W, H, wW, hH, canvas } = evt.data

  const /** @type CanvasRenderingContext2D */ ctx = canvas.getContext('2d')

  // 25 frames per second for 5 seconds => 125 frames per loop
  const TOTALT_FRAME_N = 25 * 5
  const allFrames = new Array(TOTALT_FRAME_N).fill(0).map((_, i) => i)

  const drawSingleFrame = (frame) => drawFrame(canvas, ctx, frame, TOTALT_FRAME_N, wW, hH, W, H, x0, y0, cx, cy)
  const allBitmaps = allFrames.map((val) => drawSingleFrame(val))
  // console.log({allFrames, allBitmaps})
  // allBitmaps.forEach((bmp) => {
  //   requestAnimationFrame(ctx.drawImage(bmp, 0, 0)
  //   bmp.transferFromImageBitmap()
  // })
  const loop = frameN => {
    // console.log({ frameN })
    ctx.drawImage(allBitmaps[frameN], 0, 0)
    if (frameN < TOTALT_FRAME_N - 1) {
      requestAnimationFrame(loop.bind(null, frameN + 1))
    } else {
      requestAnimationFrame(loop.bind(null, 0))
    }
  }

  loop(0)
}
