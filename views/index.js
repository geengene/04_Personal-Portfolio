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
    play.classList.remove("fa-circle-play");
    play.classList.add("fa-circle-pause");
  }
}

if (song.play()) {
  setInterval(() => {
    progress.value = song.currentTime;
  }, 500);
}

progress.onchange = function () {
  song.play();
  song.currentTime = progress.value;
  play.classList.remove("fa-circle-play");
  play.classList.add("fa-circle-pause");
};
