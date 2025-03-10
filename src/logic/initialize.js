import {
  MAX_SPEED,
  MIN_SPEED,
  GAME_RADIUS,
  refreshRate,
  speedMultiplier,
  OBSERVATION_FRAMES,
  alphaParam,
  betaParam,
} from "../data/constant.js";
import { globalState } from "../data/variable.js";
import { sampleBeta } from "../utils/utils.js";

export function initializeObjects(isEasyMode, needRetry) {
  globalState.selectedObjects = []; // Reset selections
  globalState.hoverObjectIndex = -1; // Reset hover index

  if (isEasyMode && needRetry && globalState.lastRoundObjects.length > 0) {
    globalState.objects = structuredClone(globalState.lastRoundObjects);
  } else {
    globalState.objects = [];

    const numObjects = globalState.NUM_OBJECTS;
    const specialSpeed =
      ((MAX_SPEED - MIN_SPEED) * speedMultiplier) / refreshRate;
    const offset = GAME_RADIUS - GAME_RADIUS / 5; // Position special objects near the edge
    const specialFinalRadius = Math.abs(
      globalState.centerX - (offset - specialSpeed * OBSERVATION_FRAMES)
    );

    // Create two special objects (Left & Right, moving toward the center)
    if (isEasyMode) {
      createSpecialObjects(specialSpeed, offset);
    }

    // Create remaining random objects (far from the center, low value)
    for (let i = isEasyMode ? 2 : 0; i < numObjects; i++) {
      let newObject = generateRandomObject(isEasyMode, specialFinalRadius);
      globalState.objects.push(newObject);
    }
  }
}

/**
 * Creates two special objects that move toward the center.
 */
function createSpecialObjects(specialSpeed, offset) {
  const specialObjectsX = [
    {
      x0: globalState.centerX - offset,
      dX: specialSpeed,
      y0: globalState.centerY,
      dY: 0,
    },
    {
      x0: globalState.centerX + offset,
      dX: -specialSpeed,
      y0: globalState.centerY,
      dY: 0,
    },
  ];

  const specialObjectsY = [
    {
      x0: globalState.centerX,
      dX: 0,
      y0: globalState.centerY - offset,
      dY: specialSpeed,
    },
    {
      x0: globalState.centerX,
      dX: 0,
      y0: globalState.centerY + offset,
      dY: -specialSpeed,
    },
  ];

  for (let i = 0; i < 2; i++) {
    let x0, y0, dX, dY;
    if (globalState.curTrial == 1) {
      ({ x0, y0, dX, dY } = specialObjectsX[i]);
    } else {
      ({ x0, y0, dX, dY } = specialObjectsY[i]);
    }

    globalState.objects.push({
      x0,
      y0,
      x: x0,
      y: y0,
      radius: 15,
      speed: specialSpeed,
      dX,
      dY,
      value: 0.7, // High priority objects
      isSelected: false,
      selectionIndex: NaN,
      isIntercepted: false,
      index: i,
    });
  }
}

/**
 * Generates a random object positioned far from the center.
 */
function generateRandomObject(isEasyMode, specialFinalRadius) {
  let x0, y0, dx, dy, speed;
  let isValid = false;

  do {
    let randomDirection = globalState.randomGenerator() * Math.PI * 2;
    let randomSpeed =
      globalState.randomGenerator() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    let randomRadius =
      globalState.randomGenerator() * (GAME_RADIUS * 0.6) + GAME_RADIUS / 3;
    let randomStartAngle = globalState.randomGenerator() * Math.PI * 2;
    speed = (randomSpeed * speedMultiplier) / refreshRate;

    x0 = globalState.centerX + Math.cos(randomStartAngle) * randomRadius;
    y0 = globalState.centerY + Math.sin(randomStartAngle) * randomRadius;

    dx = speed * Math.cos(randomDirection);
    dy = speed * Math.sin(randomDirection);

    // Predict final position to ensure it stays inside bounds
    const finalx = x0 + dx * OBSERVATION_FRAMES;
    const finaly = y0 + dy * OBSERVATION_FRAMES;
    const finalRadius = Math.sqrt(
      (finalx - globalState.centerX) ** 2 + (finaly - globalState.centerY) ** 2
    );

    isValid = isEasyMode
      ? finalRadius > specialFinalRadius + 50 && finalRadius < GAME_RADIUS - 50
      : finalRadius > 100 && finalRadius < GAME_RADIUS - 50;
  } while (!isValid);

  let value = sampleBeta(alphaParam, betaParam); // Random value between 0 and 1
  if (isEasyMode) value *= 0.5; // Ensure value < 0.5 for easy mode

  return {
    x0,
    y0,
    x: x0,
    y: y0,
    radius: 15,
    speed,
    dX: dx,
    dY: dy,
    value,
    isSelected: false,
    selectionIndex: NaN,
    isIntercepted: false,
    index: globalState.objects.length, // Assign index dynamically
  };
}

// Function to initialize the player
export function initializePlayer() {
  let randomDirection;
  let randomSpeed, randomRadius, randomStartAngle;
  let x0, y0, dx, dy, speed, finalx, finaly;
  x0 = globalState.centerX;
  y0 = globalState.centerY;
  //randomSpeed = randomGenerator() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED; // Speed between 50 and 100
  randomSpeed = MAX_SPEED;
  speed = (randomSpeed * speedMultiplier) / refreshRate;
  dx = 0;
  dy = 0;
  globalState.player = {
    x0: x0,
    y0: y0,
    radius: 15, // Radius of each animated object
    speed: speed,
    dX: dx,
    dY: dy,
    x: x0,
    y: y0,
  };
}
