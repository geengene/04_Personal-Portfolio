let progress = document.getElementById("progress");
let song = document.getElementById("song");
let play = document.getElementById("play");

song.onloadedmetadata = function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
};

function playPause() {
  if (play.classList.contains("fa-circle-pause")) {
    song.pause();
    play.classList.remove("fa-circle-pause");
    play.classList.add("fa-circle-play");
  } else {
    song.play();
    setInterval(() => {
      progress.value = song.currentTime;
    }, 500);
    play.classList.remove("fa-circle-play");
    play.classList.add("fa-circle-pause");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Play" || e.key === "MediaPlayPause") {
    // Toggle the play/pause button
    play.classList.toggle("fa-circle-pause");
    play.classList.toggle("fa-circle-play");
    if (song.paused()) {
      song.play();
      setInterval(() => {
        progress.value = song.currentTime;
      }, 500);
    } else {
      song.pause();
    }
  }
});

progress.onchange = function () {
  song.play();
  song.currentTime = progress.value;
  play.classList.remove("fa-circle-play");
  play.classList.add("fa-circle-pause");
};

song.addEventListener("change", (e) => {
  console.log(e);
  const audioFile = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", (e) => {
    const arrayBuffer = e.target.result;
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      visualise(audioBuffer);
    });
  });
  reader.readAsArrayBuffer(audioFile);
});

function visualise(audioBuffer) {
  const canvas = document.getElementById("canvas");
  canvas.width = 600;
  canvas.height = 200;
  const canvasContext = canvas.getContext("2d");
  const channelData = audioBuffer.getChannelData(0);
  const numberOfChunks = 400;
  const chunkSize = Math.ceil(channelData.length / numberOfChunks);

  canvasContext.fillStyle = "white";
  // canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numberOfChunks; i++) {
    // all items from 0 to chunkSize will be in the first chunk
    // all items from chunkSize to 2*chunkSize will be in the second chunk
    const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);
    const min = Math.min(...chunk);
    const max = Math.max(...chunk);
    console.log(min, max);
  }
}
