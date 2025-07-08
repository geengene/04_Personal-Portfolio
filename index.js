// let progress = document.getElementById("progress");
// let song = document.getElementById("song");
// let play = document.getElementById("play");

// document.getElementById("gif").hidden = false;
// document.getElementById("musicCanvas").hidden = true;
// song.onloadedmetadata = function () {
//   progress.max = song.duration;
//   progress.value = song.currentTime;
// };

// song.onpause = function () {
//   document.getElementById("gif").hidden = false;
//   document.getElementById("musicCanvas").hidden = true;
//   document.getElementById("gif").src = "./public/assets/coding.gif";
// };
// song.onplay = function () {
//   document.getElementById("gif").hidden = true;
//   document.getElementById("musicCanvas").hidden = false;
// };

// function playPause() {
//   if (play.classList.contains("fa-circle-pause")) {
//     song.pause();
//     play.classList.remove("fa-circle-pause");
//     play.classList.add("fa-circle-play");
//   } else {
//     song.play();
//     setInterval(() => {
//       progress.value = song.currentTime;
//     }, 1000);
//     play.classList.remove("fa-circle-play");
//     play.classList.add("fa-circle-pause");
//   }
// }

// document.addEventListener("keydown", (e) => {
//   if (e.key === " " || e.key === "Play" || e.key === "MediaPlayPause") {
//     play.classList.toggle("fa-circle-pause");
//     play.classList.toggle("fa-circle-play");
//     if (song.paused) {
//       song.play();
//       setInterval(() => {
//         progress.value = song.currentTime;
//       }, 1000);
//     } else {
//       song.pause();
//     }
//   }
// });

// progress.onchange = function () {
//   song.play();
//   song.currentTime = progress.value;
//   play.classList.remove("fa-circle-play");
//   play.classList.add("fa-circle-pause");
// };

// song.addEventListener("playing", async () => {
//   const audioSrc = song.querySelector("source").src;

//   try {
//     const response = await fetch(audioSrc);
//     const audioBlob = await response.blob();

//     const reader = new FileReader();
//     reader.addEventListener("load", (e) => {
//       const arrayBuffer = e.target.result;
//       const audioContext = new (window.AudioContext ||
//         window.webkitAudioContext)();

//       // convert arrayBuffer to audioBuffer using decodeAudioData
//       audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
//         console.log(audioBuffer);
//         visualise(audioBuffer, audioContext, song);
//       });
//     });
//     reader.readAsArrayBuffer(audioBlob);
//   } catch (error) {
//     console.error("Error fetching and reading audio file:", error);
//   }
// });

// function visualise(audioBuffer, audioContext, song) {
//   const canvas = document.getElementById("musicCanvas");
//   // canvas.width = 200;
//   // canvas.height = 100;

//   const analyser = audioContext.createAnalyser();
//   analyser.fftSize = 64;
//   const frequencyBufferLength = analyser.frequencyBinCount;
//   const frequencyData = new Uint8Array(frequencyBufferLength);

//   const source = audioContext.createMediaElementSource(song);
//   source.connect(analyser);
//   analyser.connect(audioContext.destination);
//   const canvasContext = canvas.getContext("2d");

//   canvasContext.fillStyle = "pink";
//   canvasContext.fillRect(0, 0, canvas.width, canvas.height);
//   console.log(canvas.width, canvas.height);
//   const barWidth = canvas.width / frequencyBufferLength;

//   function drawMusic() {
//     requestAnimationFrame(drawMusic);
//     canvasContext.clearRect(0, 0, canvas.width, canvas.height);
//     analyser.getByteFrequencyData(frequencyData);
//     // console.log(frequencyData);
//     for (let i = 0; i < frequencyBufferLength; i++) {
//       canvasContext.fillStyle = "purple";
//       canvasContext.fillRect(
//         i * barWidth,
//         canvas.height - frequencyData[i] / 2,
//         barWidth - 1,
//         frequencyData[i]
//       );
//     }
//   }
//   drawMusic();
// }

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
  typeSpeed: 150,
  loop: true,
});

let swiperCards = new Swiper(".cardContent", {
  loop: true,
  spaceBetween: 20,
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

const song = document.getElementById("song");
const play = document.getElementById("play");
const progress = document.getElementById("progress");
const gif = document.getElementById("gif");
const canvas = document.getElementById("musicCanvas");
const ctx = canvas.getContext("2d");

let audioContext, analyser, source, animationId;

// Setup visualizer once
function setupVisualizer() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source = audioContext.createMediaElementSource(song);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function drawMusic() {
  if (!analyser) return;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  analyser.getByteFrequencyData(dataArray);
  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    ctx.fillStyle = "#2196f3";
    ctx.fillRect(
      i * barWidth,
      canvas.height - dataArray[i] / 2,
      barWidth - 1,
      dataArray[i]
    );
  }
  animationId = requestAnimationFrame(drawMusic);
}

// Play/Pause logic
function playPause() {
  if (song.paused) {
    song.play();
  } else {
    song.pause();
  }
}

// Progress bar update
song.onloadedmetadata = function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
};
song.ontimeupdate = function () {
  progress.value = song.currentTime;
};
progress.oninput = function () {
  song.currentTime = progress.value;
};

// Visualizer and GIF toggle
song.onplay = function () {
  gif.hidden = true;
  canvas.hidden = false;
  setupVisualizer();
  drawMusic();
  play.className = "fa-solid fa-circle-pause fa-3x";
};
song.onpause = function () {
  gif.hidden = false;
  canvas.hidden = true;
  play.className = "fa-solid fa-circle-play fa-3x";
  cancelAnimationFrame(animationId);
};

document.querySelectorAll(".navigationContainer ul li a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelectorAll(".navigationContainer ul li a")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
    const href = this.getAttribute("href");
    const section = document.querySelector(href);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });
});
