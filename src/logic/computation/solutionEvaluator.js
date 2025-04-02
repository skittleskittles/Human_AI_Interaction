import { globalState } from "../../data/variable";
import { GAME_RADIUS } from "../../data/constant";
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
  let userSolution;

  console.log(`Matching index: ${matchingIndex}`);
  if (matchingIndex !== -1) {
    console.log(
      `Matching permutation:`,
      globalState.permutations[matchingIndex]
    );
    userSolution = globalState.allSolutions[matchingIndex];
  } else {
    console.log(`No matching permutation found.`);
  }

  return userSolution;
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

  for (let i = 0; i < numSequences; i++) {
    let sequence = globalState.permutations[i];

    // Clone objects and player to simulate movement
    let copyObjects = structuredClone(globalState.objects);
    let copyPlayer = structuredClone(globalState.player);

    let totalValue = 0;
    let moves = [];
    let objDetails = [];
    let isInProgress = true; // Interception is still active
    let interceptedCnt = 0;

    // console.log("===", sequence[0], ",", sequence[1], "===");
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
      if (success) interceptedCnt++;

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
        interceptedCnt
      );
      // console.log(
      //   "id:",
      //   id,
      //   "valueNow:",
      //   valueNow,
      //   "objectScore:",
      //   objectNow.value,
      //   "success:",
      //   success,
      //   "finalDistanceAtCircle:",
      //   finalDistanceAtCircle
      // );
      totalValue += valueNow;

      // If interception fails, mark as not in progress
      if (!success && isInProgress) isInProgress = false;

      let objDetail = {
        objIndex: id,
        finalDistance: finalDistanceAtCircle,
        isIntercepted: success,
        finalValue: valueNow,
        totalValue: objectNow.value,
      };
      objDetails.push(objDetail);
    }

    let totalValueProp = 0,
      rank = 0;

    let solution = {
      sequence,
      totalValue,
      moves,
      rank,
      interceptedCnt,
      totalValueProp,
      objDetails,
    };
    allSolutions.push(solution);
  }

  sortAndNormalizeSolutionValues(allSolutions);

  if (globalState.isDebugMode) {
    logSolutions(allSolutions);
  }

  return [allSolutions, allSolutions[0]];
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
  interceptedCnt
) {
  if (success) return object.value;

  // Apply weight-based scoring for missed interceptions
  let weight = selectionIndex - interceptedCnt == 0 ? 0.75 : 0.25;
  let scaledValue =
    ((GAME_RADIUS * 2 - finalDistanceAtCircle) / (GAME_RADIUS * 2)) *
    object.value *
    weight;

  return scaledValue;
}

/**
 * Sorts the solutions by totalValue in descending order and assigns ranks.
 * Normalizes totalValue relative to maxValue to get totalValueProp.
 *
 * @param {Array} solutions - An array of solution objects, each containing totalValue.
 * @param {number} maxValue - The maximum totalValue among all solutions, used for normalization.
 */
function sortAndNormalizeSolutionValues(solutions) {
  // Step 1: Attach index references for tracking original order
  solutions.forEach((solution, index) => (solution.originalIndex = index));

  // Step 2: Sort solutions by totalValue in descending order
  solutions.sort((a, b) => b.totalValue - a.totalValue);

  let maxValue = solutions[0].totalValue;
  let rank = 1;
  for (let i = 0; i < solutions.length; i++) {
    solutions[i].totalValueProp = solutions[i].totalValue / maxValue;

    // Assign rank, ensuring tied values share the same rank
    if (i > 0 && solutions[i].totalValue === solutions[i - 1].totalValue) {
      solutions[i].rank = solutions[i - 1].rank;
    } else {
      solutions[i].rank = rank;
    }
    rank++;
  }

  // Step 3: Reorder globalState.permutations based on the new order
  globalState.permutations = solutions.map(
    (solution) => globalState.permutations[solution.originalIndex]
  );

  // Step 4: Remove originalIndex as it's no longer needed
  solutions.forEach((solution) => delete solution.originalIndex);
}

/**
 * Logs all solutions and the best one.
 */
function logSolutions(solutions) {
  console.log(`\n🔹 All Solutions Summary:`);

  let maxValue = solutions[0].totalValue;
  solutions.forEach((sol, i) => {
    console.log(
      `${i}: Sequence ${sol.sequence}, Score: ${sol.totalValue.toFixed(
        3
      )}, Rank:${sol.rank}, Intercepted Cnt:${sol.interceptedCnt}`
    );
    // sol.moves.forEach((move, index) => {
    //   console.log(`   ↳ Move ${index}: success=${move.success}`);
    // });
  });

  console.log(
    `\n🏆 Best solution = ${
      solutions[0].sequence
    }, maxValue = ${maxValue.toFixed(3)}`
  );
}
