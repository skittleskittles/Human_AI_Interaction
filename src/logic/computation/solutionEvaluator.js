import { globalState } from "../../global/variable";
import { GAME_RADIUS } from "../../global/constant";
import { attemptIntercept } from "./interceptionSimulator";

/*
--------------------------------------------------------------------------------------

    Generate all possible permutations

--------------------------------------------------------------------------------------
*/
export function generatePermutations(arr, k) {
  const result = [];

  function helper(currentPermutation) {
    // If the current permutation is of length k, add it to the result
    if (currentPermutation.length === k) {
      result.push([...currentPermutation]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (currentPermutation.includes(arr[i])) continue; // Skip duplicates
      helper([...currentPermutation, arr[i]]); // Recursive call with new element added
    }
  }

  helper([]); // Start recursion with an empty permutation
  return result;
}

export function lookupInterceptionPaths() {
  for (let i = 0; i < globalState.NUM_SELECTIONS; i++) {
    console.log(`Object selected ${i} = ${globalState.selectedObjects[i]}`);
  }

  // Find the index of the matching permutation
  const matchingIndex = findMatchingPermutationIndex(
    globalState.permutations,
    globalState.selectedObjects
  );
  let playerSolution;

  console.log(`Matching index: ${matchingIndex}`);
  if (matchingIndex !== -1) {
    console.log(
      `Matching permutation:`,
      globalState.permutations[matchingIndex]
    );
    playerSolution = globalState.allSolutions[matchingIndex];
  } else {
    console.log(`No matching permutation found.`);
  }

  return playerSolution;
}

function findMatchingPermutationIndex(permutations, selectedObjects) {
  return permutations.findIndex(
    (permutation) =>
      permutation.length === selectedObjects.length &&
      permutation.every((value, index) => value === selectedObjects[index])
  );
}

/*
--------------------------------------------------------------------------------------

    Computing the Optimal Interception Paths

--------------------------------------------------------------------------------------
*/
export function enumerateAllSolutions() {
  const numSequences = globalState.permutations.length;
  let allSolutions = [];
  let bestSolutionIndex = -1;
  let maxValue = -Infinity;

  for (let i = 0; i < numSequences; i++) {
    let sequence = globalState.permutations[i];

    // Clone objects and player to simulate movement
    let copyObjects = structuredClone(globalState.objects);
    let copyPlayer = structuredClone(globalState.player);

    let totalValue = 0;
    let moves = [];
    let isInProgress = true; // Interception is still active

    for (let j = 0; j < globalState.NUM_SELECTIONS; j++) {
      const id = sequence[j];
      const objectNow = copyObjects[id];

      let [
        success,
        timeToIntercept,
        interceptPosX,
        interceptPosY,
        finalDistanceAtCircle,
      ] = attemptIntercept(
        isInProgress,
        copyPlayer.x,
        copyPlayer.y,
        copyPlayer.speed,
        objectNow.x,
        objectNow.y,
        objectNow.dX,
        objectNow.dY
      );

      // Move player and objects if still intercepting
      if (isInProgress) {
        let move = processMove(
          success,
          timeToIntercept,
          copyPlayer,
          interceptPosX,
          interceptPosY,
          copyObjects
        );
        moves.push(move);
      }

      // Compute score for this object
      let valueNow = computeObjectValue(
        objectNow,
        success,
        finalDistanceAtCircle,
        j,
        isInProgress
      );

      totalValue += valueNow;

      // If interception fails, mark as not in progress
      if (!success && isInProgress) isInProgress = false;
    }

    let solution = { sequence, totalValue, moves };
    allSolutions.push(solution);

    // Update best solution
    if (totalValue > maxValue) {
      bestSolutionIndex = i;
      maxValue = totalValue;
    }
  }

  // Normalize scores based on the best solution
  normalizeSolutionValues(allSolutions, maxValue);

  // Logging best solution
  logSolutions(allSolutions, bestSolutionIndex, maxValue);

  return [allSolutions, allSolutions[bestSolutionIndex]];
}

/**
 * Processes a move when interception is successful.
 */
function processMove(
  success,
  timeToIntercept,
  player,
  interceptPosX,
  interceptPosY,
  objects
) {
  let move = { success };

  // Round the time to intercept
  timeToIntercept = Math.round(timeToIntercept);
  move.timeToIntercept = timeToIntercept;

  // Compute movement step size
  move.dX = (interceptPosX - player.x) / timeToIntercept;
  move.dY = (interceptPosY - player.y) / timeToIntercept;

  // Move player
  player.x += timeToIntercept * move.dX;
  player.y += timeToIntercept * move.dY;

  move.interceptPosX = player.x;
  move.interceptPosY = player.y;

  // Move all objects
  for (let obj of objects) {
    obj.x += timeToIntercept * obj.dX;
    obj.y += timeToIntercept * obj.dY;
  }

  return move;
}

/**
 * Computes the value of the object based on whether interception was successful.
 */
function computeObjectValue(
  object,
  success,
  finalDistanceAtCircle,
  selectionIndex,
  isInProgress
) {
  if (success) return object.value;

  // Apply weight-based scoring for missed interceptions
  let weight = 0.5 * (globalState.NUM_SELECTIONS - selectionIndex);
  let scaledValue =
    ((GAME_RADIUS * 2 - finalDistanceAtCircle) / (GAME_RADIUS * 2)) *
    object.value *
    weight;

  return isInProgress ? scaledValue : 0; // If no longer in progress, weight is applied
}

/**
 * Normalizes all solution values relative to the maximum.
 */
function normalizeSolutionValues(solutions, maxValue) {
  for (let sol of solutions) {
    sol.totalValueProp = sol.totalValue / maxValue;
  }
}

/**
 * Logs all solutions and the best one.
 */
function logSolutions(solutions, bestSolutionIndex, maxValue) {
  console.log(`\n🔹 All Solutions Summary:`);

  solutions.forEach((sol, i) => {
    console.log(
      `${i}: Sequence ${sol.sequence}, Score: ${sol.totalValue.toFixed(2)}`
    );
    sol.moves.forEach((move, index) => {
      console.log(`   ↳ Move ${index}: success=${move.success}`);
    });
  });

  console.log(
    `\n🏆 Best solution = ${
      globalState.permutations[bestSolutionIndex]
    }, maxValue = ${maxValue.toFixed(2)}`
  );
}
