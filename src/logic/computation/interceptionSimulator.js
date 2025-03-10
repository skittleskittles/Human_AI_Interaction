import { globalState } from "../../data/variable";
import { GAME_RADIUS } from "../../data/constant";

export function attemptIntercept(
  isInProgress,
  playerPosX,
  playerPosY,
  playerSpeed,
  objectPosX,
  objectPosY,
  objectVelX,
  objectVelY
) {
  let success = false;
  let travelTime = Infinity;
  let interceptPosX = NaN,
    interceptPosY = NaN;
  // let totalDistanceTraveled = Infinity;
  let timeToCircle, circleBoundaryX, circleBoundaryY, finalDistanceAtCircle;

  // If interception is already over, compute final distance at the circle boundary
  if (!isInProgress) {
    [timeToCircle, circleBoundaryX, circleBoundaryY, finalDistanceAtCircle] =
      computeNoInterceptCase(
        playerPosX,
        playerPosY,
        objectPosX,
        objectPosY,
        objectVelX,
        objectVelY
      );
    return [
      success,
      timeToCircle,
      circleBoundaryX,
      circleBoundaryY,
      finalDistanceAtCircle,
    ];
  }

  // Compute interception time using quadratic formula
  let [hasSolution, t1, t2] = solveQuadraticEquation(
    objectVelX ** 2 + objectVelY ** 2 - playerSpeed ** 2,
    2 *
      ((objectPosX - playerPosX) * objectVelX +
        (objectPosY - playerPosY) * objectVelY),
    (objectPosX - playerPosX) ** 2 + (objectPosY - playerPosY) ** 2
  );

  // If no valid interception time exists, handle failure case
  if (!hasSolution) {
    [timeToCircle, circleBoundaryX, circleBoundaryY, finalDistanceAtCircle] =
      computeNoInterceptCase(
        playerPosX,
        playerPosY,
        objectPosX,
        objectPosY,
        objectVelX,
        objectVelY
      );
    return [
      success,
      timeToCircle,
      circleBoundaryX,
      circleBoundaryY,
      finalDistanceAtCircle,
    ];
  }

  // Select the smallest valid interception time
  travelTime = t1 >= 0 && (t1 < t2 || t2 < 0) ? t1 : t2 >= 0 ? t2 : Infinity;

  if (travelTime === Infinity) {
    [timeToCircle, circleBoundaryX, circleBoundaryY, finalDistanceAtCircle] =
      computeNoInterceptCase(
        playerPosX,
        playerPosY,
        objectPosX,
        objectPosY,
        objectVelX,
        objectVelY
      );
    return [
      success,
      timeToCircle,
      circleBoundaryX,
      circleBoundaryY,
      finalDistanceAtCircle,
    ];
  }

  // Compute interception position
  interceptPosX = objectPosX + travelTime * objectVelX;
  interceptPosY = objectPosY + travelTime * objectVelY;
  // totalDistanceTraveled = travelTime * playerSpeed;

  // Compute final distance at the circle boundary
  [timeToCircle, circleBoundaryX, circleBoundaryY, finalDistanceAtCircle] =
    computeFinalDistanceAtCircleBoundary(
      playerPosX,
      playerPosY,
      (interceptPosX - playerPosX) / Math.round(travelTime),
      (interceptPosY - playerPosY) / Math.round(travelTime),
      objectPosX,
      objectPosY,
      objectVelX,
      objectVelY
    );

  // Check if interception is within the circle
  success = isWithinCircle(interceptPosX, interceptPosY);

  // Adjust return values based on interception success
  if (!success) {
    interceptPosX = circleBoundaryX;
    interceptPosY = circleBoundaryY;
    travelTime = timeToCircle;
  } else {
    finalDistanceAtCircle = 0;
  }

  return [
    success,
    travelTime,
    interceptPosX,
    interceptPosY,
    finalDistanceAtCircle,
  ];
}

/**
 * Handles the case where interception is impossible.
 */
function computeNoInterceptCase(
  playerPosX,
  playerPosY,
  objectPosX,
  objectPosY,
  objectVelX,
  objectVelY
) {
  return computeFinalDistanceAtCircleBoundary(
    playerPosX,
    playerPosY,
    0,
    0,
    objectPosX,
    objectPosY,
    objectVelX,
    objectVelY
  );
}

/**
 * Computes whether a point is inside the circle.
 */
function isWithinCircle(x, y) {
  return (
    Math.sqrt(
      (x - globalState.centerX) ** 2 + (y - globalState.centerY) ** 2
    ) <= GAME_RADIUS
  );
}

/**
 * Computes player's movement to the circle boundary and final distance to object.
 */
function computeFinalDistanceAtCircleBoundary(
  playerPosX,
  playerPosY,
  playerVelX,
  playerVelY,
  objectPosX,
  objectPosY,
  objectVelX,
  objectVelY
) {
  if (Math.abs(playerVelX) < 1e-6 && Math.abs(playerVelY) < 1e-6) {
    [playerVelX, playerVelY] = computeDirectionVector(
      playerPosX,
      playerPosY,
      objectPosX,
      objectPosY
    );
  }

  let [timeToCircle, circleBoundaryX, circleBoundaryY] =
    computePlayerDistanceToCircleBoundary(
      playerPosX,
      playerPosY,
      playerVelX,
      playerVelY
    );

  let objectFutureX = objectPosX + timeToCircle * objectVelX;
  let objectFutureY = objectPosY + timeToCircle * objectVelY;

  let finalDistanceAtCircle = Math.sqrt(
    (objectFutureX - circleBoundaryX) ** 2 +
      (objectFutureY - circleBoundaryY) ** 2
  );

  return [
    timeToCircle,
    circleBoundaryX,
    circleBoundaryY,
    finalDistanceAtCircle,
  ];
}

/**
 * Computes a normalized direction vector from (startX, startY) to (targetX, targetY).
 */
function computeDirectionVector(startX, startY, targetX, targetY) {
  let dirX = targetX - startX;
  let dirY = targetY - startY;
  let magnitude = Math.sqrt(dirX ** 2 + dirY ** 2);
  return magnitude > 1e-6 ? [dirX / magnitude, dirY / magnitude] : [0, 0];
}

/**
 * Computes the player's distance to the circle boundary using quadratic intersection.
 */
function computePlayerDistanceToCircleBoundary(
  playerPosX,
  playerPosY,
  playerVelX,
  playerVelY
) {
  let centerX = globalState.centerX;
  let centerY = globalState.centerY;
  let playerDistToCenter = Math.sqrt(
    (playerPosX - centerX) ** 2 + (playerPosY - centerY) ** 2
  );

  if (Math.abs(playerDistToCenter - GAME_RADIUS) < 1e-6) {
    return [0, playerPosX, playerPosY];
  }

  let [hasSolution, t1, t2] = solveQuadraticEquation(
    playerVelX ** 2 + playerVelY ** 2,
    2 *
      ((playerPosX - centerX) * playerVelX +
        (playerPosY - centerY) * playerVelY),
    (playerPosX - centerX) ** 2 + (playerPosY - centerY) ** 2 - GAME_RADIUS ** 2
  );

  if (!hasSolution) {
    console.warn("🚨 Player's movement does not reach the circle boundary.");
    return [Infinity, NaN, NaN];
  }

  let timeToCircle =
    t1 >= 0 && (t1 < t2 || t2 < 0) ? t1 : t2 >= 0 ? t2 : Infinity;
  if (timeToCircle === Infinity) {
    console.warn("🚨 Player is moving away from the circle.");
    return [Infinity, NaN, NaN];
  }

  return [
    timeToCircle,
    playerPosX + timeToCircle * playerVelX,
    playerPosY + timeToCircle * playerVelY,
  ];
}

/**
 * Solves a quadratic equation Ax^2 + Bx + C = 0 and returns [hasSolution, t1, t2].
 */
function solveQuadraticEquation(A, B, C) {
  let discriminant = B ** 2 - 4 * A * C;
  if (discriminant < 0) return [false, NaN, NaN];
  let sqrtD = Math.sqrt(discriminant);
  return [true, (-B + sqrtD) / (2 * A), (-B - sqrtD) / (2 * A)];
}
