import { GAME_RADIUS } from "../data/constant.js";
import { globalState } from "../data/variable.js";
import { redrawAll } from "./drawing.js";
import { endDemo } from "./gameEvents.js";

import { finishInterception } from "./gameEvents.js";

export function animateObjects() {
  // Update positions and redraw
  updateObjectPositions(globalState.totalFrames);
  redrawAll();

  // Increment frame counter
  globalState.totalFrames++;

  // Continue animation or end demo
  if (globalState.totalFrames < globalState.OBSERVATION_FRAMES) {
    globalState.animationFrameId = requestAnimationFrame(animateObjects);
  } else {
    endDemo();
  }
}

export function animateInterception() {
  // Update positions and redraw
  updateObjectPositions(globalState.totalFrames);
  let status = updatePlayerPosition();
  redrawAll();

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
    finishInterception();
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
    globalState.userSolution.moves[globalState.interceptionCounter]; // object that contains all information for intercepting the current object
  let currentObject =
    globalState.userSolution.sequence[globalState.interceptionCounter];
  globalState.interceptionFrame += 1;

  let status = "in progress";
  if (globalState.interceptionFrame == currentMove.timeToIntercept) {
    globalState.objects[currentObject].isIntercepted = currentMove.success;
    globalState.interceptionFrame = 0; // reset counter for the next object
    globalState.interceptionCounter += 1;

    if (
      globalState.interceptionCounter < globalState.userSolution.moves.length
    ) {
      currentMove =
        globalState.userSolution.moves[globalState.interceptionCounter];
    } else {
      status = "finished";
      return status;
    }
  }

  globalState.player.x += currentMove.dX;
  globalState.player.y += currentMove.dY;

  return status;
}
