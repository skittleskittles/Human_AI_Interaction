import { OBSERVATION_FRAMES, GAME_RADIUS } from "../data/constant.js";
import { globalState } from "../data/variable.js";
import {
  startButton,
  resultInfoContent,
  finishButton,
  infoContent,
} from "../data/domElements.js";
import {
  clearCanvas,
  drawGameCircle,
  drawObjects,
  drawPlayer,
} from "./drawing.js";
import { endDemo, finishGame } from "./gameEvents.js";
import {
  showEndGame,
  showEnterMainGame,
  showEnterRetryTrials,
} from "../instructions.js";

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
  let status = updatePlayerPosition();
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
    finishTrial();
  }
}

function finishTrial() {
  console.log(`Finished interception sequence`);
  cancelAnimationFrame(globalState.animationFrameId);

  if (globalState.curTrial === globalState.NUM_MAIN_TRIALS) {
    finishButton.style.display = "block";
  } else {
    startButton.style.display = "block";
  }

  infoContent.innerHTML = `<p>Finished interception sequence</p>`;

  let valNow = Math.round(globalState.playerSolution.totalValueProp * 100);
  let rankNow = Math.round(globalState.playerSolution.rank);
  let interceptedCnt = Math.round(globalState.playerSolution.interceptedCnt);
  let scoreText = `<p>Your score: ${valNow} (Range: 0-100)</p>
                 <p>Your choice: ${getOrdinalSuffix(
                   rankNow
                 )} best solution</p>`;
  if (interceptedCnt == globalState.NUM_SELECTIONS) {
    scoreText =
      `<p>Successfully intercept both selected objects</p>` + scoreText;
  } else if (interceptedCnt == 1) {
    scoreText = `<p>Miss Object 2 due to being out of range</p>` + scoreText;
  } else if (interceptedCnt == 0) {
    scoreText = `<p>Fail to intercept either selected object</p>` + scoreText;
  }
  resultInfoContent.innerHTML = scoreText;

  if (globalState.isEasyMode) {
    if (valNow == 100) {
      // Correct answer selected
      globalState.needRetry = false;
      globalState.retryCnt = 0;

      // If this is the last trial in the educational phase, switch to main game mode
      if (globalState.curTrial == globalState.NUM_EDUCATION_TRIALS) {
        globalState.isEasyMode = false; // Exit easy mode
        globalState.needRetry = false; // No retries needed
        globalState.curTrial = 0; // Reset trial counter
        globalState.retryCnt = 0; // Reset retry counter
        showEnterMainGame(); // Proceed to main game
      }
    } else {
      // Incorrect answer selected
        if (globalState.retryCnt < 1) {
        // Allow only one retry for incorrect answers
        globalState.needRetry = true;
        showEnterRetryTrials();
      } else {
        // Player failed even after retry → End game
        globalState.needRetry = false;
        showEndGame();
        finishGame(false);
        // TODO: Implement game-ending logic
      }
    }
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
  if (globalState.interceptionFrame == currentMove.timeToIntercept) {
    globalState.objects[currentObject].isIntercepted = currentMove.success;
    globalState.interceptionFrame = 0; // reset counter for the next object
    globalState.interceptionCounter += 1;

    if (
      globalState.interceptionCounter < globalState.playerSolution.moves.length
    ) {
      currentMove =
        globalState.playerSolution.moves[globalState.interceptionCounter];
    } else {
      status = "finished";
      return status;
    }
  }

  globalState.player.x += currentMove.dX;
  globalState.player.y += currentMove.dY;

  return status;
}

function getOrdinalSuffix(n) {
  if (n >= 11 && n <= 13) {
    return `${n}th`; // Special case for 11th, 12th, 13th
  }
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
