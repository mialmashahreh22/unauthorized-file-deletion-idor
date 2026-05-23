const missions = [
  {
    "question": "What is the dangerous HTTP method here?",
    "snippet": "DELETE /files/f8e3d3c74ce54fbaa5088e313952f225",
    "choices": [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "answer": "DELETE",
    "hint": "This method removes resources."
  },
  {
    "question": "What security check is missing?",
    "snippet": "if (resource_id) delete_file(resource_id);",
    "choices": [
      "Authorization check",
      "CSS minification",
      "Image resize",
      "DNS lookup"
    ],
    "answer": "Authorization check",
    "hint": "Knowing an ID should not equal permission."
  },
  {
    "question": "What makes the issue worse?",
    "snippet": "file id looks like md5(filename)",
    "choices": [
      "Predictable identifiers",
      "Long CSS names",
      "Dark mode",
      "Verbose comments"
    ],
    "answer": "Predictable identifiers",
    "hint": "Guessable IDs can turn one deletion into many."
  }
];
const flag = "FLAG{DESTRUCTIVE_METHODS_REQUIRE_AUTHORIZATION}";
let index = 0;
let score = 0;
let lives = 3;
let answered = false;

const ui = {
  terminal: document.querySelector("#terminal-code"),
  score: document.querySelector("#score"),
  lives: document.querySelector("#lives"),
  mission: document.querySelector("#mission"),
  question: document.querySelector("#question"),
  snippet: document.querySelector("#snippet"),
  choices: document.querySelector("#choices"),
  hint: document.querySelector("#hint"),
  next: document.querySelector("#next"),
  feedback: document.querySelector("#feedback"),
  flag: document.querySelector("#flag")
};

function updateHud() {
  ui.score.textContent = score;
  ui.lives.textContent = lives;
  ui.mission.textContent = Math.min(index + 1, missions.length);
}

function render() {
  const mission = missions[index];
  answered = false;
  ui.terminal.textContent = mission.snippet;
  ui.question.textContent = mission.question;
  ui.snippet.textContent = mission.snippet;
  ui.feedback.textContent = "";
  ui.next.disabled = true;
  ui.choices.innerHTML = "";

  mission.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => answer(choice, button));
    ui.choices.appendChild(button);
  });

  updateHud();
}

function answer(choice, selected) {
  if (answered) return;
  answered = true;
  const mission = missions[index];
  const buttons = [...document.querySelectorAll(".choice")];
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === mission.answer) button.classList.add("correct");
  });

  if (choice === mission.answer) {
    selected.classList.add("correct");
    score += 10;
    ui.feedback.textContent = "Correct. Keep going.";
  } else {
    selected.classList.add("wrong");
    lives = Math.max(0, lives - 1);
    ui.feedback.textContent = "Not quite. " + mission.hint;
  }

  if (index === missions.length - 1 && score >= missions.length * 10) {
    ui.flag.textContent = flag;
    ui.flag.classList.remove("hidden");
    ui.feedback.textContent = "CTF complete. Flag unlocked.";
  }

  if (lives === 0) {
    ui.feedback.textContent = "Game over. Restart and review the report.";
    ui.next.textContent = "Restart";
  }

  ui.next.disabled = false;
  updateHud();
}

function next() {
  if (lives === 0 || index === missions.length - 1) {
    index = 0;
    score = 0;
    lives = 3;
    ui.next.textContent = "Next";
    ui.flag.classList.add("hidden");
    render();
    return;
  }
  index += 1;
  ui.next.textContent = index === missions.length - 1 ? "Finish" : "Next";
  render();
}

ui.hint.addEventListener("click", () => {
  ui.feedback.textContent = "Hint: " + missions[index].hint;
});
ui.next.addEventListener("click", next);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

render();
