import {
  aiinfo,
  startButton,
  infocontent,
  reselectButton,
  interceptionButton,
  aiRequest,
  finishButton,
} from "./global/domElements";
import { randSeed } from "./global/constant";
import { globalState } from "./global/variable";
import { getUrlParameters, lcg } from "./utils/utils";
import { generatePermutations } from "./logic/computation/solutionEvaluator";
import {
  startTrail,
  reselectObjects,
  startInterceptionSequence,
  revealAISolution,
  finishGame,
} from "./logic/gameEvents";
import { clearCanvas, drawGameCircle } from "./logic/drawing";

let urlParams = getUrlParameters();
if (urlParams.NUM_SELECTIONS !== undefined) {
  globalState.NUM_SELECTIONS = Number(urlParams.NUM_SELECTIONS);
}
if (urlParams.NUM_OBJECTS !== undefined) {
  globalState.NUM_OBJECTS = Number(urlParams.NUM_OBJECTS);
}
if (urlParams.AI_HELP !== undefined) {
  globalState.AI_HELP = Number(urlParams.AI_HELP);
}

// Initial setup
function initGame(seed) {
  //
  if (globalState.AI_HELP == 0) {
    aiinfo.innerHTML = `<p>AI assistance will not be available in this session. </p>`;
  } else if (globalState.AI_HELP == 1) {
    aiinfo.innerHTML = `<p>AI assistance will be available in this session. </p>`;
  } else if (globalState.AI_HELP == 2) {
    aiinfo.innerHTML = `<p>AI assistance is available on request in this session. </p>`;
  }

  // Enumerate all possible interception sequences of length NUM_SELECTIONS
  const indices = Array.from({ length: globalState.NUM_OBJECTS }, (_, i) => i); // [0, 1, ..., N-1]
  globalState.permutations = generatePermutations(
    indices,
    globalState.NUM_SELECTIONS
  );

  globalState.randomGenerator = lcg(seed); // Initialize random generator with the provided seed
  //infocontent.innerHTML = '<p>Measuring display refresh rate...</p>';
  //infocontent.innerHTML = `<p>Refresh rate detected: ${refreshRate} Hz. Press the button to start the game.</p>`;
  infocontent.innerHTML = `<p>Press the button to start. Please observe the sequence carefully.</p>`;
  clearCanvas();
  drawGameCircle();
  startButton.style.display = "block";
  //startButton.blur();
}

/*
--------------------------------------------------------------------------------------

    Starting the game

--------------------------------------------------------------------------------------
*/

// Start initialization on page load with a seed
initGame(randSeed); // Replace 12345 with any desired seed

// Add event listeners to buttons
startButton.addEventListener("click", startTrail);
reselectButton.addEventListener("click", reselectObjects);
interceptionButton.addEventListener("click", startInterceptionSequence);
aiRequest.addEventListener("click", revealAISolution);

finishButton.style.display = "block";
finishButton.addEventListener("click", finishGame);
