// Modified from mollerse's gist for simplex loops https://gist.github.com/mollerse/3bcaedb67d463b8d6a6558c3dc634b30
import alea from 'alea'
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise'
const SEED = 'skjalg-2023-10-28'
let noise2D = createNoise2D(alea(SEED))
let noise3D = createNoise3D(alea(SEED))
let noise4D = createNoise4D(alea(SEED))

/**
 * @type CanvasRenderingContext2D
 */
let ctx
let W, H, time, x0, y0, cx, cy, wW, hH, capturer

// const TOTALT_FRAME_N = 25*3;
const TOTALT_FRAME_N = 25 * 5
// const TOTALT_FRAME_N = 15;
const RECORD = false

const TWO_PI = Math.PI * 2

function periodicFunction(progress, offset, x, y) {
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
    S * x,
  )
}

function radialOffset(x, y) {
  return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))
  // return 1;
}

function frame(n) {
  let progress = n / TOTALT_FRAME_N
  // ctx.fillStyle = "#353539";
  // ctx.fillStyle = "#11ddcc";
  ctx.fillStyle = '#000'
  // ctx.fillStyle = "#000";
  // ctx.globalCompositeOperation = "source-over"

  ctx.fillRect(0, 0, wW, hH)
  ctx.save()
  // ctx.fillStyle = "#FF9C54";
  // ctx.fillStyle = "#004952";

  // let g = 73
  // let b = 82
  // ctx.fillStyle = `rgb(0, ${g}, ${b})`;

  // ctx.fillStyle = "#ff9930";
  // ctx.fillStyle = "purple";
  // ctx.fillStyle = "indigo";
  // ctx.strokeStyle = "indigo";
  // ctx.lineWidth = 1.5;
  ctx.globalCompositeOperation = 'lighter'

  // Loop over all pixels inside margin on the x-axis
  for (let i = x0; i < W; i += 8) {
    // Loop over all pixels inside margin on the y-axis
    for (let j = y0; j < H; j += 8) {
      let x = i
      let y = j
      const distancefactor = radialOffset(x, y) / radialOffset(0, 0)
      const vertdistancefactor = radialOffset(0, y) / radialOffset(0, 0)

      // const cyclingnoise = noise2D(
      //   0.01 * Math.cos(progress * TWO_PI),
      //   0.01 * Math.sin(progress * TWO_PI),
      // ) * 10;
      // let dx = 25 * periodicFunction(progress, 0, x, y);
      // let dy = 25 * periodicFunction(progress, 200, x, y);
      const g = 75*2 //* (1 + (0.45 * distancefactor))
      const r = 1 * (1 + (65* vertdistancefactor))
      const b = 128*2 //* (1 - distancefactor)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      const taper = 50 * (1 - .9 * distancefactor)
      // const taper = 30
      // // console.log({taper, x, y})
      let dx = taper * periodicFunction(progress - 0.001 * radialOffset(x, y), 0, x, y)
      let dy = taper * periodicFunction(progress - 0.001 * radialOffset(x, y), 150, x, y)

      ctx.beginPath()
      // ctx.arc(x + dx, y + dy, 1.1, 0, TWO_PI)
      ctx.arc(x + dx, y + dy, 1, 0, TWO_PI)
      // ctx.arc(x + dx, y + dy, 3, 4, TWO_PI)
      // ctx.arc(x + dx, y + dy, 0.25, 0, TWO_PI);
      // ctx.arc(x + dx, y + dy, 0.35, 0, TWO_PI);
      // ctx.arc(x + dx, y + dy, 0.4, 0, TWO_PI);
      ctx.fill()
      // ctx.stroke();
    }
  }

  ctx.restore()
}

function loop(frameN) {
  // console.log(frameN)
  frame(frameN)
  if (frameN < TOTALT_FRAME_N) {
    requestAnimationFrame(loop.bind(null, frameN + 1))
    if (capturer) {
      capturer.capture(ctx.canvas)
    }
  } else if (capturer) {
    capturer.stop()
    capturer.save()
  } else {
    requestAnimationFrame(loop.bind(null, 0))
  }
}

function init() {
  time = new Date().getTime()
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
  ctx = canvas.getContext('2d')

  wW = canvas.width
  hH = canvas.height
  W = wW - margin
  H = hH - margin
  x0 = margin
  y0 = margin
  cx = wW / 2
  cy = hH / 2
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
loop(0)
