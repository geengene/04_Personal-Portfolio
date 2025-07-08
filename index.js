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

// var homeTyped = new Typed(".subHeaderText.home", {
//   strings: ["Gene."],
//   typeSpeed: 150,
//   loop: false,
//   onComplete: (self) => {
//     setTimeout(() => {
//       self.cursor.remove();
//     }, 2500);
//   },
// });

document.addEventListener("mousemove", (e) => {
  const glow = document.getElementById("cursor-glow");
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

var aboutTyped = new Typed(".subHeaderText.about", {
  strings: ["Driven.", "Passionate.", "Adaptive.", "Curious."],
  typeSpeed: 100,
  backSpeed: 50,
  smartBackspace: true,
  loop: true,
  backDelay: 3000,
});

var projectsTyped = new Typed(".subHeaderText.projects", {
  strings: ["An Overview."],
  typeSpeed: 150,
  loop: true,
  backDelay: 10000,
});

var experienceTyped = new Typed(".subHeaderText.experience", {
  strings: ["Work."],
  typeSpeed: 150,
  loop: true,
  backDelay: 10000,
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
const musicName = document.querySelector(".musicName");
const musicSubtitle = document.querySelector(".musicSubtitle");
const listItems = document.querySelectorAll(".songSelectionContainer ol li");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

document.querySelectorAll(".songSelectionContainer ol li").forEach((li) => {
  li.addEventListener("click", function () {
    const src = this.getAttribute("data-src");
    const audioSource = song.querySelector("source");
    if (audioSource.src.endsWith(src)) {
      console.log(src);
      song.currentTime = 0;
      song.play();
      return;
    }
    audioSource.src = src;
    song.load();
    song.play();
  });
});

function playSongByIndex(index) {
  const li = listItems[index];
  if (!li) return;

  const src = li.getAttribute("data-src");
  const audioSource = song.querySelector("source");

  if (audioSource.src.endsWith(src.replace("./", ""))) {
    song.currentTime = 0;
    song.play();
    return;
  }

  audioSource.src = src;
  song.load();
  song.play();
}

function getCurrentSongIndex() {
  const currentSrc = song.querySelector("source").src;
  const currentIndex = Array.from(listItems).findIndex((item) => {
    const dataSrc = item.getAttribute("data-src").replace("./", "");
    return currentSrc.endsWith(dataSrc);
  });
  return currentIndex > -1 ? currentIndex : 0;
}

nextBtn.addEventListener("click", () => {
  const currentIndex = getCurrentSongIndex();
  const nextIndex = (currentIndex + 1) % listItems.length;
  playSongByIndex(nextIndex);
});

prevBtn.addEventListener("click", () => {
  const currentIndex = getCurrentSongIndex();
  const prevIndex = (currentIndex - 1 + listItems.length) % listItems.length;
  playSongByIndex(prevIndex);
});

listItems.forEach((li, index) => {
  li.addEventListener("click", () => {
    playSongByIndex(index);
  });
});

song.addEventListener("playing", function () {
  const currentSrc = song.querySelector("source").src;
  listItems.forEach((item) => {
    const dataSrc = item.getAttribute("data-src");
    if (currentSrc.endsWith(dataSrc.replace("./", ""))) {
      item.classList.add("playing");
      musicName.textContent = item.textContent;
      musicSubtitle.textContent = "by Gene";
    } else {
      item.classList.remove("playing");
    }
  });
});

let audioContext, analyser, source, animationId;

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
  const barWidth = canvas.width / bufferLength + 8;
  for (let i = 0; i < bufferLength; i++) {
    ctx.fillStyle = "#bd00ff";
    const x = i * barWidth;
    const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
    ctx.fillRect(
      x,
      canvas.height - barHeight,
      barWidth, // use full barWidth for no gaps
      barHeight
    );
  }
  animationId = requestAnimationFrame(drawMusic);
}

function playPause() {
  if (song.paused) {
    song.play();
  } else {
    song.pause();
  }
}

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

document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Play" || e.key === "MediaPlayPause") {
    e.preventDefault();
    if (song.paused) {
      song.play();
    } else {
      song.pause();
    }
  }
});

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
