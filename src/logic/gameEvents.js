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
} from "../data/domElements.js";
import {
  clearCanvas,
  drawGameCircle,
  drawObjects,
  drawPlayer,
} from "./drawing.js";
import { animateObjects, animateInterception } from "./animation.js";
import { initializeObjects, initializePlayer } from "./initialize.js";
import { handleObjectSelection, handleMouseHover } from "./mouseEvents.js";
import { lookupInterceptionPaths } from "./computation/solutionEvaluator.js";
import { showFeedback } from "../feedback.js";

export function startTrail() {
  globalState.curTrial++;
  console.log(`------curTrail: ${globalState.curTrial}---------`);

  // Hide the start round button
  startButton.style.display = "none";
  startButton.blur();
  aiRequest.disabled = true;

  // Update the info div
  infoContent.innerHTML = "<p>Example sequence in progress...</p>";
  resultInfoContent.innerHTML = `<p>Your score: (Range: 0-100)</p><p>Your choice:</p>`;
  globalState.canshowRequestAI = false;

  // Initialize the objects and the player positions, direction and speed
  initializeObjects(globalState.curTrial === 1);
  initializePlayer();

  // Reset frame counter for the demo
  globalState.totalFrames = 0;

  // Start the animation
  globalState.animationFrameId = requestAnimationFrame(animateObjects);
}

export function reselectObjects() {
  for (let index of globalState.selectedObjects) {
    let object = globalState.objects.find((obj) => obj.index === index);
    if (object) {
      object.isSelected = false;
      delete object.selectionIndex;
    }
  }

  globalState.hoverObjectIndex = -1;
  globalState.selectedObjects = [];

  canvas.addEventListener("click", handleObjectSelection);
  canvas.addEventListener("mousemove", handleMouseHover);

  clearCanvas();
  drawGameCircle();
  drawObjects();
  drawPlayer();

  interceptionButton.style.display = "none";
  reselectButton.disabled = true;
  replayButton.disabled = false;
}

export function startInterceptionSequence() {
  reselectButton.style.display = "none";
  interceptionButton.style.display = "none"; // Hide the interception button
  replayButton.style.display = "none";
  aiRequest.style.display = "none";
  //aiRequest.disabled = true; // Disables the button

  globalState.playerSolution = lookupInterceptionPaths();
  globalState.interceptionCounter = 0; // the index of the interception path
  globalState.interceptionFrame = 0;

  infoContent.innerHTML = "<p>Interception sequence in progress...</p>";
  globalState.canshowRequestAI = false;

  // Start the interception animation
  globalState.animationFrameId = requestAnimationFrame(animateInterception);
}

export function endDemo() {
  cancelAnimationFrame(globalState.animationFrameId);
  infoContent.innerHTML = `<p><center>OR</center></p><p>Click on ${globalState.NUM_SELECTIONS} objects to set the interception order.</p><p>Maximize scores by intercepting objects.</p>`;
  if (globalState.AI_HELP == 1) {
    infoContent.innerHTML += `<p>The suggested AI solution is shown in blue </p>`;
  }
  canvas.addEventListener("click", handleObjectSelection);
  canvas.addEventListener("mousemove", handleMouseHover);

  // Show the replay button
  replayButton.disabled = false; // enables the button
  replayButton.style.display = "block";
  replayButton.addEventListener("click", replayDemo);

  import("./computation/solutionEvaluator.js")
    .then((module) => module.enumerateAllSolutions())
    .then(([allSolutions, bestSolution]) => {
      globalState.allSolutions = allSolutions;
      globalState.bestSolution = bestSolution;
    })
    .catch((error) => console.error("Error loading solutions:", error));

  if (globalState.AI_HELP == 2) {
    aiRequest.style.display = "block";
    aiRequest.disabled = false;
  }

  if (globalState.AI_HELP == 1) {
    globalState.canshowRequestAI = true;
  }

  clearCanvas();
  drawGameCircle();
  drawObjects();
  drawPlayer();
}

export function replayDemo() {
  globalState.canshowRequestAI = false;
  replayButton.disabled = true; // Disables the button
  //replayButton.style.display = 'none'; // Hide the button during replay
  //initializeObjects(); // Reinitialize objects for replay
  //initializePlayer();  // Reinitialize player for replay
  globalState.totalFrames = 0; // Reset frame counter
  globalState.animationFrameId = requestAnimationFrame(animateObjects);
}

export function revealAISolution() {
  if (globalState.AI_HELP == 2) {
    globalState.canshowRequestAI = true;

    clearCanvas();
    drawGameCircle();
    drawObjects();
    drawPlayer();
  }
}

export function finishGame() {
  console.log("Game finished, redirecting to feedback...");

  // save data to firebase
  import("../firebase/dataProcessor.js").then((module) =>
    module.saveTrialData()
  );

  cancelAnimationFrame(globalState.animationFrameId);

  // Hide the main game container
  experimentContainer.style.display = "none";

  showFeedback();
}
