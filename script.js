// =====================
// MATCH STATE
// =====================

let innings = 1;

let totalOvers = 0;
let totalBalls = 0;

let score = 0;
let wickets = 0;
let legalBalls = 0;

let target = 0;

let currentOver = [];
let history = [];
let completedOvers = [];

// =====================
// TOSS SCREEN
// =====================

let selectedCall = null;

const headBtn = document.getElementById("headBtn");
const tailBtn = document.getElementById("tailBtn");
const flipBtn = document.getElementById("flipBtn");
const result = document.getElementById("result");
const selectedCallText =
  document.getElementById("selectedCall");
const continueBtn =
  document.getElementById("continueBtn");

headBtn.onclick = () => {
  selectedCall = "HEAD";
  selectedCallText.textContent =
    "Selected: HEAD";
};

tailBtn.onclick = () => {
  selectedCall = "TAIL";
  selectedCallText.textContent =
    "Selected: TAIL";
};

flipBtn.onclick = () => {

  if (!selectedCall) {
    alert("Select HEAD or TAIL first");
    return;
  }

  const toss =
    Math.random() < 0.5
      ? "HEAD"
      : "TAIL";

  result.innerHTML =
    `
    Captain Call: ${selectedCall}<br>
    Coin Result: ${toss}<br><br>
    ${
      selectedCall === toss
        ? "✅ WON TOSS"
        : "❌ LOST TOSS"
    }
  `;

  continueBtn.style.display = "block";
};

continueBtn.onclick = () => {

  document
    .getElementById("toss-screen")
    .classList.remove("active");

  document
    .getElementById("setup-screen")
    .classList.add("active");
};

// =====================
// MATCH START
// =====================

document
  .getElementById("startMatchBtn")
  .onclick = () => {

  totalOvers =
    parseInt(
      document.getElementById("overs").value
    );

  totalBalls = totalOvers * 6;

  document
    .getElementById("setup-screen")
    .classList.remove("active");

  document
    .getElementById("score-screen")
    .classList.add("active");

  refreshBoard();
};

// =====================
// SCOREBOARD REFRESH
// =====================

function refreshBoard() {

  document
    .getElementById("scoreDisplay")
    .textContent =
    score + "/" + wickets;

  const overs =
    Math.floor(legalBalls / 6);

  const ballsInOver =
    legalBalls % 6;

  document
    .getElementById("oversDisplay")
    .textContent =
    overs +
    "." +
    ballsInOver +
    " Overs";

  document
    .getElementById("ballsLeftDisplay")
    .textContent =
    "Balls Left: " +
    (totalBalls - legalBalls);

  document
    .getElementById("currentOverDisplay")
    .textContent =
    currentOver.length > 0
      ? currentOver.join(" | ")
      : "-";
let historyHtml = "";

completedOvers.forEach((over, index) => {

  historyHtml +=
    "Over " +
    (index + 1) +
    " = " +
    over.runs +
    " Runs<br>" +
    over.balls.join(" | ") +
    "<br><br>";

});

document
  .getElementById("overHistoryDisplay")
  .innerHTML =
  historyHtml || "No completed overs yet";

  if (innings === 2) {

    document
      .getElementById("targetDisplay")
      .style.display = "block";

    document
      .getElementById("needDisplay")
      .style.display = "block";

    const runsNeeded =
      Math.max(
        target - score,
        0
      );

    const ballsRemaining =
      totalBalls - legalBalls;

    document
      .getElementById("needDisplay")
      .textContent =
      "Need " +
      runsNeeded +
      " runs from " +
      ballsRemaining +
      " balls";
  }
}
// =====================
// RUNS
// =====================

function addRun(runs) {

  if (legalBalls >= totalBalls) {
    alert("Innings Complete");
    return;
  }

  history.push({
    type: "run",
    value: runs
  });

  score += runs;

  legalBalls++;

  currentOver.push(
    runs.toString()
  );

  handleOverReset();

  refreshBoard();

  checkMatchResult();
}

// =====================
// WICKET
// =====================

function addWicket() {

  if (legalBalls >= totalBalls) {
    alert("Innings Complete");
    return;
  }

  history.push({
    type: "wicket"
  });

  wickets++;

  legalBalls++;

  currentOver.push("W");

  handleOverReset();

  refreshBoard();

  checkMatchResult();
}

// =====================
// WIDE
// =====================

function addWide() {

  if (legalBalls >= totalBalls) {
    alert("Innings Complete");
    return;
  }

  history.push({
    type: "wide"
  });

  score++;

  currentOver.push("WD");

  refreshBoard();

  checkMatchResult();
}

// =====================
// NO BALL
// =====================

function addNoBall() {

  if (legalBalls >= totalBalls) {
    alert("Innings Complete");
    return;
  }

  let option = prompt(
`NO BALL

Enter:

0
1
2
3
4
6

RO0
RO1
RO2`
  );

  if (option === null) {
    return;
  }

  option = option.trim().toUpperCase();

  let runs = 0;
  let wicket = false;
  let display = "NB";

  switch(option) {

    case "0":
      runs = 1;
      display = "NB";
      break;

    case "1":
      runs = 2;
      display = "NB+1";
      break;

    case "2":
      runs = 3;
      display = "NB+2";
      break;

    case "3":
      runs = 4;
      display = "NB+3";
      break;

    case "4":
      runs = 5;
      display = "NB+4";
      break;

    case "6":
      runs = 7;
      display = "NB+6";
      break;

    case "RO0":
      runs = 1;
      wicket = true;
      display = "NB(RO0)";
      break;

    case "RO1":
      runs = 2;
      wicket = true;
      display = "NB+1(RO)";
      break;

    case "RO2":
      runs = 3;
      wicket = true;
      display = "NB+2(RO)";
      break;

    default:
      alert("Invalid Option");
      return;
  }

  score += runs;

  if (wicket) {
    wickets++;
  }

  history.push({
    type: "noball",
    runs: runs,
    wicket: wicket,
    display: display
  });

  currentOver.push(display);

  refreshBoard();

  checkMatchResult();
}
// =====================
// DEAD BALL
// =====================

function addDeadBall() {

  if (legalBalls >= totalBalls) {
    alert("Innings Complete");
    return;
  }

  history.push({
    type: "deadball"
  });

  currentOver.push("DB");

  refreshBoard();
}

// =====================
// OVER RESET
// =====================

function handleOverReset() {

  if (
    legalBalls > 0 &&
    legalBalls % 6 === 0
  ) {

    let overRuns = 0;

    currentOver.forEach(event => {

      if (!isNaN(event)) {
        overRuns += Number(event);
      }

      if (event === "WD") {
        overRuns += 1;
      }

      if (event === "NB") {
        overRuns += 1;
      }

    });

    completedOvers.push({
      runs: overRuns,
      balls: [...currentOver]
    });

    currentOver = [];

  }

}

// =====================
// UNDO
// =====================

function undoLastBall() {

  if (history.length === 0) {
    alert("Nothing to undo");
    return;
  }

  const last = history.pop();

  switch (last.type) {

    case "run":
      score -= last.value;
      legalBalls--;
      removeLastOverEvent();
      break;

    case "wicket":
      wickets--;
      legalBalls--;
      removeLastOverEvent();
      break;

    case "wide":
      score--;
      removeLastOverEvent();
      break;

    case "noball":
      score--;
      removeLastOverEvent();
      break;

    case "deadball":
      removeLastOverEvent();
      break;
  }

  document.getElementById(
    "resultDisplay"
  ).textContent = "";

  refreshBoard();
}

// =====================
// REMOVE LAST EVENT
// =====================

function removeLastOverEvent() {

  if (currentOver.length > 0) {

    currentOver.pop();

  }

}

// =====================
// END INNINGS
// =====================

function endInnings() {

  if (innings === 1) {

    target = score + 1;

    innings = 2;

    score = 0;
    wickets = 0;
    legalBalls = 0;

    history = [];
    currentOver = [];
    completedOvers = [];

    document
      .getElementById("inningsTitle")
      .textContent =
      "2nd Innings";

    document
      .getElementById("targetDisplay")
      .textContent =
      "Target: " + target;

    refreshBoard();

    return;
  }

  alert("Match already in 2nd innings");
}

// =====================
// RESULT CHECKING
// =====================

function checkMatchResult() {

  if (innings !== 2) {
    return;
  }

  const resultBox =
    document.getElementById(
      "resultDisplay"
    );

  if (score >= target) {

    resultBox.textContent =
      "🎉 Chase Completed";

    return;
  }

  if (legalBalls >= totalBalls) {

    resultBox.textContent =
      "❌ Chase Failed";

  }

}
