
const worker = new Worker('offscreen.js', { type: 'module' })

/**
 * @type CanvasRenderingContext2D
 */
let ctx

/**
 * @type OffscreenCanvas
 */
let offscreen

let W, H, x0, y0, cx, cy, wW, hH, capturer

const RECORD = false

function init() {
  let canvas = document.createElement('canvas')
  let dim = 500
  // let xDim = dim;
  // let yDim = dim;
  let xDim = 1080
  let yDim = 1920
  let margin = 55
  // canvas.setAttribute("width", `${dim}px`);
  // canvas.setAttribute("height", `${dim}px`);
  canvas.setAttribute('width', `${xDim}px`)
  canvas.setAttribute('height', `${yDim}px`)
  document.body.appendChild(canvas)

  offscreen = canvas.transferControlToOffscreen()

  // ctx = canvas.getContext('2d')

  wW = canvas.width
  hH = canvas.height
  W = wW - margin
  H = hH - margin
  x0 = margin
  y0 = margin
  cx = wW / 2
  cy = hH / 2

  worker.postMessage(
    {
      canvas: offscreen,
      cx,
      cy,
      x0,
      y0,
      W,
      H,
      wW,
      hH,
    },
    [offscreen]
  )

  worker.addEventListener('message', (e) => {
    // console.log(`Got message from worker: ${JSON.stringify(e.data)}`);
    if (e.data === 'loaded') {
      document.querySelector('marquee').remove()
    }
  })

  if (RECORD) {
    capturer = new CCapture({
      format: 'webm',
      workersPath: 'node_modules/ccapture.js/src/',
      framerate: 25,
      quality: 100,
    })
    capturer.start()
  }
}

init()
// loop(0)
