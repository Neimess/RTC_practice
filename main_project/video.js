const videoFile = document.getElementById('video-file');
const videoPlayer = document.getElementById('video-player');
videoFile.addEventListener('change', () => {
    const file = videoFile.files[0];
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
    videoPlayer.style.display = 'block';
});