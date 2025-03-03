import { globalState } from "../global/variable.js";
import {
  canvas,
  startButton,
  replayButton,
  interceptionButton,
  reselectButton,
  aiRequest,
  infocontent,
} from "../global/domElements.js";
import {
  clearCanvas,
  drawGameCircle,
  drawObjects,
  drawPlayer,
} from "./drawing.js";
import { animateObjects, animateInterception } from "./animation.js";
import { initializeObjects, initializePlayer } from "./initialize.js";
import { handleObjectSelection, handleMouseHover } from "./mouseEvents.js";
import {
  lookupInterceptionPaths,
  enumerateAllSolutions,
} from "./computation/solutionEvaluator.js";

export function startTrail() {
  globalState.curTrial++;
  console.log(`------curTrail: ${globalState.curTrial}---------`);

  // Hide the start round button
  startButton.style.display = "none";
  startButton.blur();
  aiRequest.disabled = true;

  // Update the info div
  infocontent.innerHTML = "<p>Example sequence in progress...</p>";
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

  infocontent.innerHTML = "<p>Interception sequence in progress...</p>";
  globalState.canshowRequestAI = false;

  // Start the interception animation
  globalState.animationFrameId = requestAnimationFrame(animateInterception);
}

export function endDemo() {
  cancelAnimationFrame(globalState.animationFrameId);
  infocontent.innerHTML = `<p><center>OR</center></p><p>When ready, click on ${globalState.NUM_SELECTIONS} objects to determine the order of interception. The goal is to maximize the point value across successfully intercepted objects</p>`;
  if (globalState.AI_HELP == 1) {
    infocontent.innerHTML += `<p>The suggested AI solution is shown in blue </p>`;
  }
  canvas.addEventListener("click", handleObjectSelection);
  canvas.addEventListener("mousemove", handleMouseHover);

  // Show the replay button
  replayButton.disabled = false; // enables the button
  replayButton.style.display = "block";
  replayButton.addEventListener("click", replayDemo);

  [globalState.allSolutions, globalState.bestSolution] =
    enumerateAllSolutions();

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
  cancelAnimationFrame(globalState.animationFrameId);

  const isLocal = window.location.hostname === "localhost";
  const feedbackPath = isLocal
    ? "/feedback.html"
    : "/Human_AI_Interaction/feedback.html";
  setTimeout(() => {
    window.location.href = feedbackPath;
  }, 100);
}
