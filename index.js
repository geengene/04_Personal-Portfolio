document.addEventListener("mousemove", (e) => {
  const glow = document.getElementById("cursor-glow");
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

var aboutTyped = new Typed(".subHeaderText.about", {
  strings: ["Driven.", "Adaptive.", "Curious.", "Unemployed."],
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
  spaceBetween: 10,
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
    300: {
      slidesPerView: 1,
    },
    320: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3,
    },
    1440: {
      slidesPerView: 3
    },
    2560: {
      slidesPerView: 5
    }

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
      musicSubtitle.textContent = "by me";
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

const volumeRange = document.getElementById("volumeRange");
const volumeRangeContainer = document.getElementById("volumeRangeContainer");
const volumeIcon = document.getElementById("volumeIcon");

window.onload = function () {
  song.volume = volumeRange.value;
};

volumeIcon.addEventListener("click", () => {
  if (song.muted) {
    song.muted = false;
    volumeIcon.className = "fa-solid fa-volume-high fa-xl";
  } else {
    song.muted = true;
    volumeIcon.className = "fa-solid fa-volume-mute fa-xl";
  }
});

volumeRange.addEventListener("input", (e) => {
  const volume = e.target.value;
  if (volume < 0.5 && volume > 0) {
    volumeIcon.className = "fa-solid fa-volume-low fa-xl";
  } else if (volume >= 0.5) {
    volumeIcon.className = "fa-solid fa-volume-high fa-xl";
  } else if (volume == 0) {
    volumeIcon.className = "fa-solid fa-volume-mute fa-xl";
  }
  song.muted = false;
  song.volume = volume;
});

let volumeHideTimeout;

const showVolumeSlider = () => {
  clearTimeout(volumeHideTimeout);
  volumeRangeContainer.classList.add("show");
};

const hideVolumeSlider = () => {
  volumeHideTimeout = setTimeout(() => {
    volumeRangeContainer.classList.remove("show");
  }, 1000); // A short delay to allow moving the cursor to the slider
};

volumeIcon.addEventListener("mouseenter", showVolumeSlider);
volumeIcon.addEventListener("mouseleave", hideVolumeSlider);

volumeRangeContainer.addEventListener("mouseenter", showVolumeSlider);
volumeRangeContainer.addEventListener("mouseleave", hideVolumeSlider);

const rightContainer = document.querySelector(".rightContainer");
const sections = document.querySelectorAll(".rightContainer .container");
const navigationLinks = document.querySelectorAll(
  ".navigationContainer ul li a"
);

function updateActiveNavOnScroll() {
  let currentSectionId = "about"; // Default to 'about'
  const threshold = window.innerHeight / 2;

  sections.forEach((section) => {
    const h1 = section.querySelector("h1.glitchText");
    // If the h1's top is above the viewport's vertical middle, it's a candidate
    if (h1 && h1.getBoundingClientRect().top < threshold) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navigationLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSectionId) {
      link.classList.add("active");
    }
  });
}

rightContainer.addEventListener("scroll", updateActiveNavOnScroll);
navigationLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    // navigationLinks.forEach((l) => l.classList.remove("active"));
    // this.classList.add("active");
    const href = this.getAttribute("href");
    const section = document.querySelector(href);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });
});
