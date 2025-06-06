(() => {
  const file = document.getElementById("file");
  const canvas = document.getElementById("canvas");
  const ascii = document.getElementById("ascii-canvas");
  const changeButton = document.getElementById("change-img-button");
  const brightnessChars = " .:-=+*#%@";
  let video = document.createElement("video");
  video.width = 100;
  video.height = 200;
  video.controls = true;
  video.crossOrigin = "anonymous";
  document.querySelector("body").appendChild(video);
  let ctx = canvas.getContext("2d");
  let img = new Image();
  img.crossOrigin = "anonymous";
  const url = document.getElementById("imgurl");
  url.value = "https://i.postimg.cc/2yXR6LDB/89bfdg7w8xf61.jpg";
  img.src = url.value;
  ctx.imageSmoothingEnabled = false;
  getImage(img, ctx);


  file.addEventListener("change", (e) => {
    let [fileType, ext] = e.target.files[0].type.split("/");
    if (fileType === "image") {
      video.pause();
      img.src = URL.createObjectURL(e.target.files[0]);
      ctx.imageSmoothingEnabled = false;
      getImage(img, ctx);
    }
    if (fileType === "video") {
      ascii.width = 800;
      ascii.height = 600;
      video.setAttribute("src", URL.createObjectURL(e.target.files[0]));
      video.controls = true;
      getVideo(video, ctx);
    }
  });

  changeButton.addEventListener("click", () => {
    if (url.value) img.src = url.value;
    ctx.imageSmoothingEnabled = false;
    getImage(img, ctx);
    url.value = "";
  });


  function manipulate(iData, pad, context) {
    grayScale(iData);
    context.imageSmoothingEnabled = false;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      let iData = ctx.getImageData(0, 0, img.width, img.height);
      let asciiCtx = ascii.getContext("2d");
      ascii.width = img.width;
      ascii.height = img.height;
      manipulate(iData, ascii, asciiCtx);
    };
  }

  function getVideo(vid, ctx) {
    canvas.width = 800;
    canvas.height = 600;
    vid.onplay = function step() {
      if (vid.paused || vid.ended) return;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      let iData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let asciiCtx = ascii.getContext("2d");
      manipulate(iData, ascii, asciiCtx);
      requestAnimationFrame(step);
    };
  }

  function drawText(iData, pad, context) {
    context.fillStyle = "#000";
    context.fillRect(0, 0, pad.width, pad.height);
    context.fillStyle = "#fff";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.font = `8px monospace`;
    for (let i = 0; i < iData.width; i += 8) {
      for (let j = 0; j < iData.height; j += 8) {
        let n = (j * iData.width + i) * 4;
        let value = iData.data[n];
        let str = brightnessChars[Math.floor(value / 32)];
        context.fillText(str, i, j);
      }
    }
  }
})();

