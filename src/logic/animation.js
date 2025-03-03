import { OBSERVATION_FRAMES, GAME_RADIUS } from "../global/constant.js";
import { globalState } from "../global/variable.js";
import { startButton, infocontent, finishButton } from "../global/domElements.js";
import {
  clearCanvas,
  drawGameCircle,
  drawObjects,
  drawPlayer,
} from "./drawing.js";
import { endDemo } from "./gameEvents.js";

export function animateObjects() {
  // Update positions and redraw
  updateObjectPositions(globalState.totalFrames);
  clearCanvas();
  drawGameCircle();
  drawObjects();
  drawPlayer();

  // Increment frame counter
  globalState.totalFrames++;

  // Continue animation or end demo
  if (globalState.totalFrames < OBSERVATION_FRAMES) {
    globalState.animationFrameId = requestAnimationFrame(animateObjects);
  } else {
    endDemo();
  }
}

export function animateInterception() {
  // Update positions and redraw
  updateObjectPositions(globalState.totalFrames);
  let [status, success] = updatePlayerPosition();
  clearCanvas();
  drawGameCircle();
  drawObjects();
  drawPlayer(); // temp

  // Increment frame counter
  globalState.totalFrames++;

  // Is the player still within the game area?
  let isInCircle =
    Math.sqrt(
      (globalState.player.x - globalState.centerX) ** 2 +
        (globalState.player.y - globalState.centerY) ** 2
    ) <= GAME_RADIUS;

  // Continue animation or end interception sequence
  if (isInCircle && status == "in progress") {
    globalState.animationFrameId = requestAnimationFrame(animateInterception);
  } else {
    finishTrial(isInCircle, success);
  }
}

function finishTrial(isInCircle, success) {
  console.log(`Finished interception sequence`);
  cancelAnimationFrame(globalState.animationFrameId);
  if (globalState.curTrial === globalState.totalTrials) {
    finishButton.style.display = "block";
  } else {
    startButton.style.display = "block";
  }
    
  let valNow = Math.round(globalState.playerSolution.totalValueProp * 100);
  if (!isInCircle || !success) {
    infocontent.innerHTML = `<p>Reached outside of the circle</p><p>Point value achieved: ${valNow}% of the best AI solution.</p>`;
  } else {
    infocontent.innerHTML = `<p>Finished interception sequence</p><p>Point value achieved: ${valNow}% of the best AI solution.</p>`;
  }
}

// Function to update object positions
function updateObjectPositions(frame) {
  globalState.objects.forEach((object) => {
    // Update object's position based on its speed
    object.x = object.x0 + frame * object.dX;
    object.y = object.y0 + frame * object.dY;
  });
}

function updatePlayerPosition() {
  let currentMove =
    globalState.playerSolution.moves[globalState.interceptionCounter]; // object that contains all information for intercepting the current object
  let currentObject =
    globalState.playerSolution.sequence[globalState.interceptionCounter];
  globalState.interceptionFrame += 1;

  let status = "in progress";
  let success = false;
  if (globalState.interceptionFrame == currentMove.timeToIntercept) {
    success = currentMove.success;
    globalState.objects[currentObject].isIntercepted = currentMove.success;
    globalState.interceptionFrame = 0; // reset counter for the next object
    globalState.interceptionCounter += 1;

    if (
      globalState.interceptionCounter < globalState.playerSolution.moves.length
    ) {
      currentMove =
        globalState.playerSolution.moves[globalState.interceptionCounter];
    } else {
      console.log("Finished with interception sequence");
      status = "finished";
      return [status, success];
    }
  }

  globalState.player.x += currentMove.dX;
  globalState.player.y += currentMove.dY;

  return [status, success];
}
