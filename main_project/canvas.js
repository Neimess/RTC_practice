document.getElementById("CanvasButton").addEventListener("click", () => {
  document.getElementById("CanvasButton").innerHTML = "Restart Canvas"
  // получаем элементы video и canvas
  const video = document.getElementById('video-player')
  const canvas = document.getElementById('canvas')
  
  const stopVideo = document.getElementById("StopVideo")
  stopVideo.style.display = "inline-block"
  stopVideo.addEventListener("click", () => {video.pause()})
  
  const playVideo = document.getElementById("PlayVideo")
  playVideo.style.display = "inline-block"
  playVideo.addEventListener("click", () => {video.play()})
  
  const saveButton = document.getElementById("DownloadFrame")
  saveButton.style.display = "inline-block"
  // получаем контекст рисования для canvas
  const ctx = canvas.getContext('2d');

  const canvas2 = document.getElementById('canvas_black_white'); 
  const ctx2 = canvas2.getContext('2d');
  canvas2.width = 500;
  canvas2.height = 300; 
  // устанавливаем размеры canvas равными размерам видео
  canvas.width = 500;
  canvas.height = 300;
  
  // переменная для хранения текущего кадра
  let currentFrame = null
  let tempImageData = null
  // обработчик события "play" для видео
  video.addEventListener('play', function() {
    // запускаем цикл анимации
    requestAnimationFrame(draw);
  });
  
  // функция для разбиения видео на кадры и отображения их в canvas
  function draw() {
    // проверяем, проигрывается ли видео
    if (video.paused || video.ended) {
      return;
    }
  
    // рисуем текущий кадр видео на canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // получаем текущий кадр видео в виде ImageData
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
    // сохраняем текущий кадр в переменную
    currentFrame = imageData
    
    // продолжаем цикл анимации
    requestAnimationFrame(draw);
  }
  // обработчик события клика на кнопке сохранения
  saveButton.addEventListener("click", () => {
      // проверяем, есть ли текущий кадр
      if (currentFrame) {
        // сохраняем текущий кадр в формате PNG
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "frame.png";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    })
  document.getElementById("BlackWhite").addEventListener("click", () => {
    if (currentFrame) { 
      // очищаем второй canvas 
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
      // создаем временный canvas для обработки текущего кадра 
    const tempCanvas = document.createElement('canvas'); 
    tempCanvas.width = canvas2.width; 
    tempCanvas.height = canvas2.height; 
    const tempCtx = tempCanvas.getContext('2d'); 
    // рисуем текущий кадр на временный canvas 
    tempCtx.putImageData(currentFrame, 0, 0); 
    // получаем ImageData для временного canvas 
    tempImageData = tempCtx.getImageData(0, 0, canvas2.width, canvas2.height); 
    // обрабатываем каждый пиксель, превращая его в черно-белый 
    for (let i = 0; i < tempImageData.data.length; i += 4) { 
      const r = tempImageData.data[i]; 
      const g = tempImageData.data[i + 1]; 
      const b = tempImageData.data[i + 2]; 
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
      tempImageData.data[i] = gray; 
      tempImageData.data[i + 1] = gray; 
      tempImageData.data[i + 2] = gray; 
    } 
    // отображаем черно-белый кадр на втором canvas 
    ctx2.putImageData(tempImageData, 0, 0); 
  } 
  })
  document.getElementById("morphologi").addEventListener("click", () => {
    const canvas = document.getElementById('morphological_canvas')
    canvas.width = 500
    canvas.height = 300
    const ctx = canvas.getContext("2d");
    ctx.putImageData(tempImageData, 0, 0);

    // Convert the canvas to an OpenCV mat
    const src = cv.imread(canvas);

    // Perform morphological optimization (erosion)
    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    const dst = new cv.Mat();
    cv.erode(src, dst, kernel);

    // Display the result
    cv.imshow(canvas, dst);

    // Release memory
    src.delete();
    dst.delete();
  }); 
  })
