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
    }, 1000);
    play.classList.remove("fa-circle-play");
    play.classList.add("fa-circle-pause");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Play" || e.key === "MediaPlayPause") {
    play.classList.toggle("fa-circle-pause");
    play.classList.toggle("fa-circle-play");
    if (song.paused) {
      song.play();
      setInterval(() => {
        progress.value = song.currentTime;
      }, 1000);
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

// Fetch and read audio file as ArrayBuffer when the song starts playing
song.addEventListener("playing", async () => {
  const audioSrc = song.querySelector("source").src;

  try {
    const response = await fetch(audioSrc);
    const audioBlob = await response.blob();

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      // console.log(e);
      const arrayBuffer = e.target.result;
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // convert arrayBuffer to audioBuffer using decodeAudioData
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        console.log(audioBuffer);
        visualise(audioBuffer, audioContext, song);
      });
    });
    reader.readAsArrayBuffer(audioBlob);
  } catch (error) {
    console.error("Error fetching and reading audio file:", error);
  }
});

function visualise(audioBuffer, audioContext, song) {
  const canvas = document.getElementById("musicCanvas");
  // canvas.width = 200;
  // canvas.height = 100;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;
  const frequencyBufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(frequencyBufferLength);

  const source = audioContext.createMediaElementSource(song);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  const canvasContext = canvas.getContext("2d");

  canvasContext.fillStyle = "pink";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  console.log(canvas.width, canvas.height);
  const barWidth = canvas.width / frequencyBufferLength;

  function drawMusic() {
    requestAnimationFrame(drawMusic);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(frequencyData);
    // console.log(frequencyData);
    for (let i = 0; i < frequencyBufferLength; i++) {
      canvasContext.fillStyle = "purple";
      canvasContext.fillRect(
        i * barWidth,
        canvas.height - frequencyData[i] / 2,
        barWidth - 1,
        frequencyData[i]
      );
    }
  }
  drawMusic();
}

var homeTyped = new Typed(".subHeaderText.home", {
  strings: ["Gene."],
  typeSpeed: 150,
  loop: false,
  onComplete: (self) => {
    setTimeout(() => {
      self.cursor.remove();
    }, 2500);
  },
});

var aboutTyped = new Typed(".subHeaderText.about", {
  strings: ["Driven.", "Passionate.", "Adaptive.", "Open-minded.", "Curious."],
  typeSpeed: 100,
  backSpeed: 50,
  smartBackspace: true,
  loop: true,
});

var projectsTyped = new Typed(".subHeaderText.projects", {
  strings: ["An Overview."],
  typeSpeed: 100,
  loop: true,
});

let swiperCards = new Swiper(".cardContent", {
  loop: true,
  spaceBetween: 32,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  mousewheel: {
    enabled: true,
    invert: false,
    forceToAxis: true,
    sensitivity: 0.5,
  },

  breakpoints: {
    600: {
      slidesPerView: 2,
    },
    968: {
      slidesPerView: 3,
    },
  },
});
