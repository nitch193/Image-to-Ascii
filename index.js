const file = document.getElementById("file");
const canvas = document.getElementById("canvas");
const ascii = document.getElementById("ascii-canvas");
const change = document.getElementById("change");
const brightnessChars = " .,:;ox%#@";
function main() {
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.crossOrigin = "anonymous";
  file.addEventListener("change", (e) => {
    img.src = URL.createObjectURL(e.target.files[0]);
    getImage(img, ctx);
  });
  change.addEventListener("click", () => {
    const url = document.getElementById("imgurl");
    if (url.value) img.src = url.value;
    getImage(img, ctx);
    url.value = "";
  });
}

main();

function manipulate(iData, pad, context) {
  grayScale(iData);
  drawText(iData, pad, context);
}

function grayScale(iData) {
  let data = iData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.21 + data[i + 1] * 0.71 + data[i + 2] * 0.07;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
}

function getImage(img, ctx) {
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    let iData = ctx.getImageData(0, 0, img.width, img.height);
    let asciiCtx = ascii.getContext("2d");
    ascii.width = img.width;
    ascii.height = img.height;
    manipulate(iData, ascii, asciiCtx);
  };
}

// function getCharacterForGrayScale(grayScale) {
//   return grayRamp[Math.ceil(((grayRamp.length - 1) * grayScale) / 255)];
// }

function drawText(iData, pad, context) {
  context.fillStyle = "#000";
  context.fillRect(0, 0, pad.width, pad.height);
  context.fillStyle = "#fff";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = "4px monospace";
  for (let i = 0; i < iData.width; i += 4) {
    for (let j = 0; j < iData.height; j += 4) {
      let n = (j * iData.width + i) * 4;
      let value = iData.data[n];
      let str = brightnessChars[Math.floor(value / 32) + 1];
      context.fillText(str, i, j);
    }
  }
}

// function drawChar(char, { fontFamily = "monospace" } = {}) {
//   const { canvas, ctx } = createCanvas();

//   ctx.fillStyle = "#fff";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "#000";
//   ctx.textBaseline = "top";
//   ctx.textAlign = "left";
//   ctx.font = "20px " + fontFamily;

//   ctx.fillText(char, 0, 0);

//   return canvas;
// }

// function calculateBrightness(char, options) {
//   const canvas = drawChar(char, options);
//   const ctx = canvas.getContext("2d");
//   const idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const data32 = new Uint32Array(idata.data.buffer);

//   let brightness = 0;
//   let i = data32.length;
//   let r, g, b, pixel32;

//   while (i--) {
//     pixel32 = data32[i];

//     r = pixel32 & 0xff;
//     g = (pixel32 >> 8) & 0xff;
//     b = (pixel32 >> 16) & 0xff;

//     brightness += (r + g + b) / 3;
//   }

//   brightness /= canvas.width * canvas.height;

//   return brightness;
// }
