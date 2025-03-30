import {
  aiInfo,
  aiInfoContent,
  startButton,
  infoContent,
  reselectButton,
  interceptionButton,
  aiRequest,
  finishButton,
  experimentContainer,
} from "./data/domElements";
import { randSeed } from "./data/constant";
import { globalState } from "./data/variable";
import { User } from "./logic/collectData";
import {
  getUrlParameters,
  lcg,
  generateUID,
  getCurrentDate,
  measureRefreshRate,
} from "./utils/utils";
import { generatePermutations } from "./logic/computation/solutionEvaluator";
import {
  startTrial,
  reselectObjects,
  startInterception,
  revealAISolution,
  finishGame,
} from "./logic/gameEvents";
import { clearCanvas, drawGameCircle } from "./logic/drawing";
import { showConsent } from "./consent";
import { showEnterEducationTrials } from "./instructions";

if (window.location.hostname === "localhost") {
  const url = new URL(window.location.href);
  url.searchParams.set("DEBUG", "true");
  window.history.replaceState({}, "", url);
}

let urlParams = getUrlParameters();

if (urlParams.NUM_SELECTIONS !== undefined) {
  globalState.NUM_SELECTIONS = Number(urlParams.NUM_SELECTIONS);
}
if (urlParams.NUM_TRIALS !== undefined) {
  globalState.NUM_MAIN_TRIALS = Number(urlParams.NUM_TRIALS);
}
if (urlParams.NUM_OBJECTS !== undefined) {
  globalState.NUM_OBJECTS = Number(urlParams.NUM_OBJECTS);
}
if (urlParams.AI_HELP !== undefined) {
  globalState.AI_HELP = Number(urlParams.AI_HELP);
}
if (urlParams.DEBUG !== undefined) {
  globalState.isDebugMode = urlParams.DEBUG;
}

User.prolific_pid = generateUID();
if (urlParams.PROLIFIC_PID !== undefined) {
  User.prolific_pid = Number(urlParams.PROLIFIC_PID);
}

// Initial setup
function initGame(seed) {
  //
  if (globalState.AI_HELP == 0) {
    aiInfo.style.display = "none";
    aiInfoContent.innerHTML = `<p>AI assistance will not be available in this session. </p>`;
  } else if (globalState.AI_HELP == 1) {
    aiInfoContent.innerHTML = `<p>AI assistance will be available in this session. </p>`;
  } else if (globalState.AI_HELP == 2) {
    aiInfoContent.innerHTML = `<p>AI assistance is available on request in this session. </p>`;
  }

  // Enumerate all possible interception sequences of length NUM_SELECTIONS
  const indices = Array.from({ length: globalState.NUM_OBJECTS }, (_, i) => i); // [0, 1, ..., N-1]
  globalState.permutations = generatePermutations(
    indices,
    globalState.NUM_SELECTIONS
  );

  globalState.randomGenerator = lcg(seed); // Initialize random generator with the provided seed
  //infoContent.innerHTML = '<p>Measuring display refresh rate...</p>';
  //infoContent.innerHTML = `<p>Refresh rate detected: ${refreshRate} Hz. Press the button to start the game.</p>`;
  infoContent.innerHTML = `<p>Press the button to start. Please observe the sequence carefully.</p>`;
  clearCanvas();
  drawGameCircle();
  startButton.style.display = "block";
  //startButton.blur();
}

/*
--------------------------------------------------------------------------------------

    Start the Experiment

--------------------------------------------------------------------------------------
*/
measureRefreshRate().then(({ refreshRate, speedMultiplier }) => {
  globalState.refreshRate = refreshRate;
  globalState.speedMultiplier = speedMultiplier;
  globalState.OBSERVATION_FRAMES = Math.round(3000 * (refreshRate / 1000));
  globalState.INTERCEPTION_FRAMES = Math.round(2000 * (refreshRate / 1000));
  startExperiment(false, false);
});

function startExperiment(skipConsent = false, skipEducation = false) {
  User.create_time = getCurrentDate();

  if (!skipConsent) {
    showConsent();
    return;
  }

  if (!skipEducation) {
    globalState.isEasyMode = true;
    showEnterEducationTrials();
  }
  experimentContainer.style.display = "block";
  startGame();
}

/*
--------------------------------------------------------------------------------------

    Starting the game

--------------------------------------------------------------------------------------
*/

// Start initialization on page load with a seed
export function startGame() {
  initGame(randSeed); // Replace 12345 with any desired seed

  // Add event listeners to buttons
  startButton.addEventListener("click", startTrial);
  reselectButton.addEventListener("click", reselectObjects);
  interceptionButton.addEventListener("click", startInterception);
  aiRequest.addEventListener("click", revealAISolution);
  finishButton.addEventListener("click", () => {
    finishGame(true);
  });
}
