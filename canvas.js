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
  
  // устанавливаем размеры canvas равными размерам видео
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // переменная для хранения текущего кадра
  let currentFrame = null
  
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
    });
  })
