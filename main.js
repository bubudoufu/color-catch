"use strict";

const board = document.getElementById("board");
const levelDisplay = document.getElementById("levelDisplay");
const timer = document.getElementById("timer");
const point = document.getElementById("point");
let count = 0;
let level = 0;
let score = 0;
let bonusTime = 0;
let corrent; // 正解の色を保持
let timeLimit = 10; // 制限時間
let timeoutId;

let split = [
  [1, 24],
  [1, 12, 12],
  [1, 6, 6, 12],
  [1, 6, 6, 6, 6],
  [1, 3, 3, 6, 6, 6],
  [1, 3, 3, 3, 3, 6, 6],
  [1, 3, 3, 3, 3, 3, 3, 6],
  [1, 3, 3, 3, 3, 3, 3, 3, 3],
  [1, 2, 2, 2, 3, 3, 3, 3, 3, 3],
  [1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const colors = [
  "rgb(204, 204, 153)",
  "rgb(102, 102, 102)",
  "rgb(51, 153, 102)",
  "rgb(102, 204, 153)",
  "rgb(255, 153, 51)",
  "rgb(255, 204, 0)",
  "rgb(204, 204, 204)",
  "rgb(204, 0, 102)",
  "rgb(153, 51, 102)",
  "rgb(0, 204, 255)",
  "rgb(255, 204, 255)",
  "rgb(51, 51, 255)",
  "rgb(153, 255, 51)",
];

// スタート画面の色をランダムで変える
document.querySelector(".start").style.background =
  colors[Math.floor(Math.random() * colors.length)];

// スタートボタン
document.getElementById("startBtn").addEventListener("click", () => {
  makeQuiz();
  document.querySelector(".start").style.background = "none";
  board.classList.remove("start");
});

// Fisher–Yates shuffleアルゴリズムでシャッフル
function shuffle(array) {
  let a = array.length;
  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = array[--a];
    array[a] = array[j];
    array[j] = t;
  }
  return array;
}

// クイズ作成・表示
function makeQuiz() {
  let a = shuffle(colors);
  let b = [];

  board.innerHTML = "";
  for (let i = 0; i < split[level].length; i++) {
    for (let j = 0; j < split[level][i]; j++) {
      b.push(a[i]);
    }
  }

  corrent = a[0];
  b = shuffle(b);

  for (let i = 0; i < b.length; i++) {
    const cell = document.createElement("div");
    cell.onclick = is_same;
    cell.className = "cell";
    cell.style.background = b[i];
    board.appendChild(cell);
  }

  timeoutId = setInterval(countDown, 1000);
}

// 正解か判定
function is_same() {
  // 正解の処理
  if (this.style.background === corrent) {
    score += timeLimit;
    count++;
    if (count % 3 === 0) {
      level++;
      if (level === 12) {
        updata();
        gameClear();
        levelDisplay.textContent = `level: end`;
        return;
      }
    }
    timeLimit = 10 + Math.floor(score / 100) * 5;
    clearInterval(timeoutId);
    updata();
    makeQuiz();
  }
  // 不正解の処理
  else {
    const heart = document.querySelectorAll(".heart");
    if (heart.length === 1) {
      heart[0].remove();
      gameOver();
      return;
    } else {
      heart[0].remove();
    }
    document.querySelectorAll(".cell").forEach((index) => {
      if (this.style.background === index.style.background) {
        index.animate({ opacity: [0, 1] }, { duration: 400, iterations: 2 });
      }
    });
  }
}

// 表示更新
function updata() {
  point.textContent = `${score}`;
  point.animate({ opacity: [1, 0, 1] }, { duration: 1000, fill: "forwards" });
  levelDisplay.textContent = `level: ${level}`;
  timer.textContent = `time: ${timeLimit}`;
}

// 制限時間
function countDown() {
  timeLimit--;
  timer.textContent = `time: ${timeLimit}`;
  if (timeLimit === 0) {
    gameOver();
  }
}

// ゲームオーバー
function gameOver() {
  clearInterval(timeoutId);
  board.style.pointerEvents = "none";
  document.getElementById("end").style.display = "block";
  document.getElementById("retryBtn").addEventListener("click", () => {
    location.reload();
  });
  document.querySelectorAll(".cell").forEach((index) => {
    if (corrent === index.style.background) {
      index.classList.add("correctCell");
      index
        .animate(
          { borderColor: ["white", "red"] },
          { duration: 2500, iterations: 3 }
        )
        .finished.then(() => {
          index.classList.remove("correctCell");
        });
    }
  });
}

// ゲームクリア
function gameClear() {
  board.style.pointerEvents = "none";
  document.getElementById("end").style.display = "block";
  document.querySelector("#end > h3").textContent = "Congratulation!!";
  document.getElementById("retryBtn").addEventListener("click", () => {
    location.reload();
  });
  clearInterval(timeoutId);
  const heart2 = document.querySelectorAll(".cell");
  const index = [1, 3, 5, 7, 9, 10, 14, 16, 18, 22];
  for (let i = 0; i < index.length; i++) {
    heart2[index[i]].classList.add("heart2");
  }
}
