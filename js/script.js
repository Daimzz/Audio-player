const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close"),
  volumeControl = document.querySelector("#volume");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//Функция запуска музыкального трека
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//Функция паузы музыкального трека
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//Функция выбрать предыдущий муз.трек
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//Функция next для выбора следующего трека
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// play или pause эвент'
playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //если isPlayMusic равен true тогда вызывается функция pauseMusic иначе playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//Прев эвент
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//Некст эвент
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// Апдейтим длину прогресс бара в соответствии со временем отсчета трека
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //Получаем данные о текущем времени трека
  const duration = e.target.duration; //Получаем данные об общем времени трека
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    // // Обновляем общую продолжительность трека
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      //Если продолжительность трека меньше 10 сек то ставим 0 вначале(Пример: если трек 8 сек то будет ->08 а не 8)
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // Обновляем продолжительность трека в текущий момент
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //Если продолжительность трека меньше 10 сек то ставим 0 вначале(Пример: если трек 8 сек то будет ->08 а не 8)
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//Обновленяем текущее время currentTime трека в соответствии с шириной прогресс бара

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //Получаем ширину прогресс бара
  let clickedOffsetX = e.offsetX; //получаем offset x value
  let songDuration = mainAudio.duration; //получаем общую продолжительность аудио

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //вызываем playMusic функцию
  playingSong();
});

//Опции change loop, shuffle, repeat icon  по клику
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//Код ниже о том что делать после того как трек закончится
mainAudio.addEventListener("ended", () => {
  //Тут мы работаем с иконкой "Playlist looped" и при нажатии на нее получаем разные состояния трека
  let getText = repeatBtn.innerText; //получаем tag у иконки с  innerText
  switch (getText) {
    case "repeat":
      nextMusic(); //вызов nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //устанавливаем трек в значение 0 сек (как бы запуская его снова типа loop)
      loadMusic(musicIndex); //вызываем loadMusic function с аргументом, где аргумент это и есть индекс текущей песни
      playMusic(); //запускаем playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1); //генерируем рандомный index/numb с макс значение которое равно длине массива
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //будем генерировать рандомные индекс до того момента пока musicIndex == randIndex, чтобы правильно "перемешать" треки и начать с другого трека
      musicIndex = randIndex; //передаем randomIndex в musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//показываем список треков по клику на иконку
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});
wrapper.addEventListener("click", (e) => {
  if (musicList.classList.contains("show")) {
    if (musicList.contains(e.target)) {
      musicList.classList.remove("show");
    }
  }
});

const ulTag = wrapper.querySelector("ul");
// создаем li tags в соответствии с длиной массива для листа
for (let i = 0; i < allMusic.length; i++) {
  //передаем данные по треку, имя артиста, название песни и тд
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //инсертим litag в ultag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //добавляем 0 перед секундами если кол-во секунд в треке меньше 10
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //передаем данные о продолжительности муз трека
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //добавляем t-duration атрибут с данными по времени трека
  });
}

//находим иконку звука

const volumeIcon = document.querySelector("#volume-icon");

//делаем дефолтное значение громкости трека

mainAudio.volume = 0.3; //дефолтное значение ставим в 0.3 (макс это 1.0)

volumeControl.addEventListener("input", () => {
  mainAudio.volume = volumeControl.value;
});
mainAudio.addEventListener("volumechange", () => {
  volumeControl.value = mainAudio.volume;

  //если значение mainAudio равно 0 то меняем иконку звука и соответственно наоборот
  if (mainAudio.volume == 0) {
    volumeIcon.classList.add("volume-off");
    volumeIcon.textContent = "volume_off";
  } else {
    volumeIcon.classList.remove("volume-off");
    volumeIcon.classList.add("volume-on");
    volumeIcon.textContent = "volume_up";
  }
});

//создаем временную переменную, в которой будет хранится значение громкости до выключения звука
//ставим пока в дефолт 0, потом все равно поменяется

let tempVolume = 0;

//меняем иконки звука по клику и меняем tempVolume на значение "до" выключения музыки, чтобы потом вернутся к нему если нажать на иконку еще раз

volumeIcon.addEventListener("click", () => {
  if (volumeIcon.classList.contains("volume-on")) {
    volumeIcon.classList.remove("volume-on");
    volumeIcon.classList.add("volume-off");
    volumeIcon.textContent = "volume_off";
    tempVolume = mainAudio.volume;
    mainAudio.volume = 0;
  } else {
    volumeIcon.classList.remove("volume-off");
    volumeIcon.classList.add("volume-on");
    volumeIcon.textContent = "volume_up";
    mainAudio.volume = tempVolume;
  }
});

//запустить определенную песню из листа песен по клику
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //если li tag index равен musicIndex тогда добавить класс 'playing'
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//Функция для работы по клику с tag li. По клику на песню в списке песен вызывается данная функция
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
