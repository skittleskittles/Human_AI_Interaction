import { globalState } from "../data/variable.js";
import {
  canvas,
  startButton,
  replayButton,
  interceptionButton,
  reselectButton,
  aiRequest,
  infoContent,
  experimentContainer,
  resultInfoContent,
  finishButton,
} from "../data/domElements.js";
import {
  showEndGame,
  showEnterMainGame,
  showEnterRetryTrials,
} from "../instructions.js";
import { redrawAll } from "./drawing.js";
import { animateObjects, animateInterception } from "./animation.js";
import { initializeObjects, initializePlayer } from "./initialize.js";
import { handleObjectSelection, handleMouseHover } from "./mouseEvents.js";
import { lookupInterceptionPaths } from "./computation/solutionEvaluator.js";
import { showFeedback } from "../feedback.js";
import { startTimer, stopTimer, getTimerValue } from "./timeTracker.js";
import {
  getCurrentTrialData,
  getCurrentExperimentData,
  updateTrialData,
  updateExperimentData,
  User,
} from "./collectData.js";
import {
  createNewExperimentData,
  createNewTrialData,
  addToCustomCount,
  recordUserChoiceData,
} from "./collectData.js";
import { getCurrentDate, getOrdinalSuffix } from "../utils/utils.js";

/*
--------------------------------------------------------------------------------------

    Start the trial

--------------------------------------------------------------------------------------
*/
export function startTrial() {
  recordPreviousTrialData();
  prepareNewTrial();

  console.log(`------curTrial: ${globalState.curTrial}---------`);

  if (!globalState.isEasyMode) {
    initializeTrialData();
  }

  prepareUIForTrial();
  initializeGameState();
  startTrialAnimation();
}

function recordPreviousTrialData() {
  const curExperiment = getCurrentExperimentData();
  const lastTrial = getCurrentTrialData();

  if (lastTrial && !globalState.isEasyMode) {
    const trialSec = getTimerValue("trial");
    updateTrialData(
      lastTrial,
      globalState.userSolution,
      globalState.bestSolution,
      trialSec,
      globalState.canShowAIAnswer
    );

    // Update experiment status based on attention checks and progress
    updateExperimentData(
      curExperiment,
      lastTrial,
      globalState.userSolution,
      globalState.bestSolution
    );
  }

  import("../firebase/saveData2Firebase.js").then((module) => {
    module.saveSingleTrial(curExperiment, lastTrial); // save the last trial data
    // (when click 'start next interception', last trial finishes)
    // if trial doesn't exist, only update user / experiment data
  });

  stopTimer("trial");
}

function prepareNewTrial() {
  if (globalState.needRetry) {
    globalState.retryCnt++;
  } else {
    globalState.curTrial++;
  }
  globalState.canShowAIAnswer = false;
  globalState.canShowRequestAI = false;
  globalState.demoPlayTimes = 0;

  startTimer("trial");
}

export function initializeExperimentData() {
  const newExperiment = createNewExperimentData(
    globalState.curExperiment,
    globalState.NUM_MAIN_TRIALS
  );
  User.experiments.push(newExperiment);
}

function initializeTrialData() {
  if (User.experiments.length === 0) {
    // Initialize experiment if it doesn't exist
    initializeExperimentData();
  }

  // Push new trial to the current experiment
  const newTrial = createNewTrialData(globalState.curTrial);
  User.experiments[globalState.curExperiment].trials.push(newTrial);
}

function prepareUIForTrial() {
  startButton.style.display = "none";
  startButton.blur();
  aiRequest.disabled = true;

  infoContent.innerHTML =
    "<p>Please observe object values and movements carefully.</p>";
  resultInfoContent.innerHTML = ``;
}

function initializeGameState() {
  initializeObjects(globalState.isEasyMode, globalState.needRetry);
  initializePlayer();
  globalState.totalFrames = 0;
}

function startTrialAnimation() {
  globalState.animationFrameId = requestAnimationFrame(animateObjects);
}

/*
--------------------------------------------------------------------------------------

    End Demo

--------------------------------------------------------------------------------------
*/
export function endDemo() {
  cancelAnimationFrame(globalState.animationFrameId);

  updateInfoPanel();
  showReplayButton();
  loadBestSolutions();
  updateAIRequestState();

  globalState.lastRoundObjects = structuredClone(globalState.objects); // Save object state for retry
  globalState.demoPlayTimes++;

  startThinkTimerIfFirstDemo();

  redrawAll();
}

function updateInfoPanel() {
  let educationInfo = `
    <p><center>OR</center></p>
    <p>Click on ${globalState.NUM_SELECTIONS} objects to set the interception order.</p>
    <p>Maximize scores by intercepting objects.</p>
  `;

  if (globalState.isEasyMode) {
    educationInfo += `<p>Scores are awarded based on how close you are to the selected objects and their values.</p>`;
  }

  if (globalState.AI_HELP === 1) {
    educationInfo += `<p>The suggested AI solution is shown in blue</p>`;
  }

  infoContent.innerHTML = educationInfo;

  canvas.addEventListener("click", handleObjectSelection);
  canvas.addEventListener("mousemove", handleMouseHover);
}

function showReplayButton() {
  replayButton.disabled = false;
  replayButton.style.display = "block";
  replayButton.addEventListener("click", replayDemo);
}

function loadBestSolutions() {
  import("./computation/solutionEvaluator.js")
    .then((module) => module.enumerateAllSolutions())
    .then(([allSolutions, bestSolution]) => {
      globalState.allSolutions = allSolutions;
      globalState.bestSolution = bestSolution;
    })
    .catch((error) => console.error("Error loading solutions:", error));
}

function updateAIRequestState() {
  if (globalState.AI_HELP === 2) {
    aiRequest.style.display = "block";
    aiRequest.disabled = false;
  }

  if (globalState.AI_HELP === 1) {
    globalState.canShowRequestAI = true;
  }
}

function startThinkTimerIfFirstDemo() {
  if (globalState.demoPlayTimes === 1) {
    startTimer("think");
  }
}

/*
--------------------------------------------------------------------------------------

    Replay Demo

--------------------------------------------------------------------------------------
*/
export function replayDemo() {
  globalState.canShowRequestAI = false;
  replayButton.disabled = true; // Disables the button
  //replayButton.style.display = 'none'; // Hide the button during replay
  //initializeObjects(); // Reinitialize objects for replay
  //initializePlayer();  // Reinitialize player for replay
  globalState.totalFrames = 0; // Reset frame counter
  globalState.animationFrameId = requestAnimationFrame(animateObjects);

  // record replay num
  if (!globalState.isEasyMode) {
    const currentTrial = getCurrentTrialData();
    addToCustomCount(currentTrial.replay_num, 1, globalState.canShowAIAnswer);
  }
}

/*
--------------------------------------------------------------------------------------

    Reselect Objects

--------------------------------------------------------------------------------------
*/
export function reselectObjects() {
  resetSelections();
  enableInteraction();
  restoreReplayUI();

  // record reselect num
  if (!globalState.isEasyMode) {
    const currentTrial = getCurrentTrialData();
    addToCustomCount(currentTrial.reselect_num, 1, globalState.canShowAIAnswer);
  }
}

function resetSelections() {
  for (let index of globalState.selectedObjects) {
    const object = globalState.objects.find((obj) => obj.index === index);
    if (object) {
      object.isSelected = false;
      delete object.selectionIndex;
    }
  }

  globalState.selectedObjects = [];
  globalState.hoverObjectIndex = -1;
}

function enableInteraction() {
  canvas.addEventListener("click", handleObjectSelection);
  canvas.addEventListener("mousemove", handleMouseHover);

  redrawAll();
}

function restoreReplayUI() {
  interceptionButton.style.display = "none";
  reselectButton.disabled = true;
  replayButton.disabled = false;
}

/*
--------------------------------------------------------------------------------------

    Start Interception

--------------------------------------------------------------------------------------
*/
export function startInterception() {
  hideInterceptionControls();
  computeUserSolution();
  resetInterceptionState();
  updateInterceptionInfo();
  startInterceptionAnimation();

  if (!globalState.isEasyMode) {
    recordTrialDataStartIntercept();
  }

  stopTimer("think");
}

function hideInterceptionControls() {
  reselectButton.style.display = "none";
  interceptionButton.style.display = "none";
  replayButton.style.display = "none";
  aiRequest.style.display = "none";
}

function computeUserSolution() {
  globalState.userSolution = lookupInterceptionPaths();
}

function resetInterceptionState() {
  globalState.interceptionCounter = 0;
  globalState.interceptionFrame = 0;
}

function updateInterceptionInfo() {
  infoContent.innerHTML = "<p>Interception sequence in progress...</p>";
  globalState.canShowRequestAI = false;
}

function startInterceptionAnimation() {
  globalState.animationFrameId = requestAnimationFrame(animateInterception);
}

function recordTrialDataStartIntercept() {
  const currentTrial = getCurrentTrialData();
  recordUserChoiceData(currentTrial, globalState.userSolution);

  const thinkTimeSec = getTimerValue("think");
  addToCustomCount(
    currentTrial.think_time,
    thinkTimeSec,
    globalState.canShowAIAnswer
  );
  console.log("think time: ", thinkTimeSec);
}

/*
--------------------------------------------------------------------------------------

    Finish the interception

--------------------------------------------------------------------------------------
*/
export function finishInterception() {
  console.log(`Finished interception sequence`);
  cancelAnimationFrame(globalState.animationFrameId);

  // Show correct button
  updateButtonVisibility();

  // Display final trial info
  displayTrialResults();

  if (globalState.isEasyMode) {
    handleEducationMode();
  } else {
    handleMainMode();
  }
}

function updateButtonVisibility() {
  if (globalState.curTrial === globalState.NUM_MAIN_TRIALS) {
    finishButton.style.display = "block";
  } else {
    startButton.style.display = "block";
  }
}

function displayTrialResults() {
  infoContent.innerHTML = `<p>Interception Complete</p>`;

  const { totalValueProp, rank, interceptedCnt } = globalState.userSolution;

  const valNow = Math.round(totalValueProp * 100);
  const rankNow = Math.round(rank);
  const intercepted = Math.round(interceptedCnt);

  let scoreText = `<p>Your score: ${valNow} (Range: 0-100)</p>
                   <p>Your choice: ${getOrdinalSuffix(
                     rankNow
                   )} best solution</p>`;

  if (intercepted === globalState.NUM_SELECTIONS) {
    scoreText =
      `<p>Successfully intercept both selected objects</p>` + scoreText;
  } else if (intercepted === 1) {
    scoreText = `<p>Miss Object 2: out of range</p>` + scoreText;
  } else {
    scoreText = `<p>Fail to intercept either selected object</p>` + scoreText;
  }

  resultInfoContent.innerHTML = scoreText;
}

function handleEducationMode() {
  if (globalState.userSolution == globalState.bestSolution) {
    globalState.needRetry = false;
    globalState.retryCnt = 0;

    if (globalState.curTrial === globalState.NUM_EDUCATION_TRIALS) {
      globalState.isEasyMode = false;
      globalState.curTrial = 0;
      globalState.retryCnt = 0;
      showEnterMainGame();
      initializeExperimentData();

      User.is_passed_education = true;
      import("../firebase/saveData2Firebase.js").then((module) => {
        module.saveOrUpdateUser(getCurrentDate());
      });
    }
  } else {
    if (globalState.retryCnt < 1) {
      globalState.needRetry = true;
      showEnterRetryTrials();
    } else {
      globalState.needRetry = false;
      showEndGame();
      finishGame();
    }
  }
}

function handleMainMode() {}

/*
--------------------------------------------------------------------------------------

    Other Events

--------------------------------------------------------------------------------------
*/
export function revealAISolution() {
  if (globalState.AI_HELP == 2) {
    globalState.canShowRequestAI = true;

    redrawAll();
  }
}

export function finishGame() {
  console.log("Game finished");

  cancelAnimationFrame(globalState.animationFrameId);

  // Hide the main game container
  experimentContainer.style.display = "none";

  // Record data
  recordPreviousTrialData();

  stopTimer("think");
  stopTimer("trial");

  if (globalState.curTrial == globalState.NUM_MAIN_TRIALS) {
    // finish all trials
    showFeedback();
  } else {
    setTimeout(() => {
      window.location.href =
        "https://app.prolific.com/submissions/complete?cc=C1A9WJ8O";
    }, 3000);

    return;
  }
}
