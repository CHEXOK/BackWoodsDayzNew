const stages = [
  "Инициализация...",
  "Проверка контента...",
  "Загрузка ресурсов...",
  "Подключение к серверу...",
  "Синхронизация...",
];

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressSub = document.getElementById("progressSub");
const clock = document.getElementById("clock");
const copyBtns = document.querySelectorAll(".copy");

let progress = 0;
let stageIndex = 0;

const setStage = () => {
  progressSub.textContent = stages[stageIndex % stages.length];
  stageIndex += 1;
};

const tickProgress = () => {
  const delta = Math.random() * 6 + 2;
  progress = Math.min(progress + delta, 100);
  progressFill.style.width = `${progress.toFixed(1)}%`;
  progressText.textContent = `${Math.floor(progress)}%`;

  if (progress >= 100) {
    progressSub.textContent = "Готово. Почти на сервере.";
  }
};

const updateClock = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${h}:${m}`;
};

if (progressSub) {
  setStage();
  setInterval(setStage, 8000);
}

if (progressFill) {
  tickProgress();
  setInterval(() => {
    if (progress < 100) tickProgress();
  }, 1200);
}

if (clock) {
  updateClock();
  setInterval(updateClock, 1000 * 15);
}

if (copyBtns.length) {
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.copy || btn.textContent;
      navigator.clipboard.writeText(value).then(() => {
        const prev = btn.textContent;
        btn.textContent = "Скопировано";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1200);
      });
    });
  });
}
