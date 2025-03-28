/**
 * Data Structures:
 *   - https://docs.google.com/document/d/1bmtTgm39KQYB385JB6DSbq2pWNm6omMeQpxw29AaBP0/edit?tab=t.twrrqelzi8cm
 */

import { globalState } from "../data/variable.js";
import { getCurrentDate } from "../utils/utils.js";

/**
 * @typedef {Object} User
 * @property {string} prolific_pid
 * @property {Date} create_time
 * @property {Date} end_time
 * @property {number} feedback
 * @property {Experiment[]} experiments
 */
export const User = {
  prolific_pid: "",
  create_time: new Date(),
  end_time: new Date(),
  feedback: 0,
  experiments: [], // Experiment
};

/**
 * @typedef {Object} Experiment
 * @property {number} experiment_id
 * @property {Date} create_time
 * @property {Date} end_time
 * @property {number} num_trials
 * @property {Trial[]} trials
 */
export function createNewExperimentData(experiment_id, num_trials) {
  return {
    experiment_id,
    create_time: getCurrentDate(),
    end_time: getCurrentDate(), // will be updated at the end
    num_trials,
    trials: [], // will be populated with Trial objects
  };
}

/**
 * @typedef {Object} Trial
 * @property {number} trial_id
 * @property {Date} create_time
 * @property {Date} end_time
 * @property {number} performance  // (user score / best score) * 100
 * @property {number} user_score
 * @property {number} best_score
 * @property {Choice[]} ai_choice
 * @property {Choice[]} best_choice
 * @property {Choice[]} user_choice
 * @property {CustomCount} replay_num
 * @property {CustomCount} reselect_num
 * @property {CustomCount} think_time // seconds, 第一次动画结束到开始拦截
 * @property {CustomCount} total_time // seconds, 每一轮trial总时间
 */
/**
 * Creates a new Trial object with default values
 * @param {number} trial_id
 * @returns {Trial}
 */
export function createNewTrialData(trial_id) {
  return {
    trial_id,
    create_time: getCurrentDate(),
    end_time: getCurrentDate(),
    performance: 0,
    user_score: 0,
    best_score: 0,
    ai_choice: [], // []Choice
    best_choice: [], // []Choice
    user_choice: [], // []Choice
    replay_num: { ai_before: 0, ai_after: 0, total: 0 }, // CustomCount
    reselect_num: { ai_before: 0, ai_after: 0, total: 0 }, // CustomCount
    think_time: { ai_before: 0, ai_after: 0, total: 0 }, // CustomCount
    total_time: { ai_before: 0, ai_after: 0, total: 0 }, // CustomCount
  };
}

/**
 * Updates the end info for the current trial
 * @param {Trial} trial - the current trial object
 * @param {Object} scores - { userScore: number, bestScore: number }
 */
export function updateTrialDataEnd(trial, userSolution, bestSolution) {
  trial.end_time = getCurrentDate();
  trial.user_score = userSolution.totalValue;
  trial.best_score = bestSolution.totalValue;
  trial.performance = userSolution.totalValueProp * 100;

  recordBestChoiceData(trial, bestSolution);

  // todo fsy
  const durationSec = Math.round((trial.end_time - trial.create_time) / 1000);
  trial.total_time.total = durationSec;
}

/**
 * Returns the current Trial object from User based on globalState.
 * @returns {Trial}
 */
export function getCurrentTrialData() {
  if (
    User.experiments.length === 0 ||
    User.experiments[globalState.curExperiment].trials.length === 0
  ) {
    return null;
  }
  const currentExperiment = User.experiments[globalState.curExperiment];
  return currentExperiment?.trials[globalState.curTrial - 1];
}

/**
 * @typedef {CustomCount}
 * @property {number} ai_before
 * @property {number} ai_after
 * @property {number} total
 */
/**
 * Adds a numeric value to a CustomCount field.
 * @param {CustomCount} countObj
 * @param {number} value - Value to add (in seconds)
 * @param {boolean} isAfterAI
 */
export function addToCustomCount(countObj, value, isAfterAI) {
  if (!countObj || typeof value !== "number") return;

  if (isAfterAI) {
    countObj.ai_after += value;
  } else {
    countObj.ai_before += value;
  }
  countObj.total += value;
}

/**
 * @typedef {Object} Choice
 * @property {ExperimentObject[]} selected_objects
 * @property {number} score
 * @property {'no_ai' | 'ai_before' | 'ai_after'} ai_assisted_flag
 * @property {number} rank
 */

/**
 * Creates a Choice object from a given solution.
 * @param {Object} solution - userSolution or bestSolution
 * @param {'no_ai' | 'ai_before' | 'ai_after'} ai_assisted_flag
 * @returns {Choice}
 */
export function createChoiceFromSolution(solution, ai_assisted_flag = "no_ai") {
  const selected_objects = solution.objDetails.map((obj) => ({
    object_index: obj.objIndex,
    final_distance: obj.finalDistance ?? 0,
    is_intercepted: obj.isIntercepted ?? false,
    final_value: obj.finalValue ?? 0,
    total_value: obj.totalValue ?? 0,
  }));

  return {
    selected_objects,
    score: solution.totalValueProp ? solution.totalValueProp * 100 : 0,
    ai_assisted_flag,
    rank: solution.rank ?? -1,
  };
}

export function recordUserChoiceData(trial, userSolution) {
  let ai_assisted_flag = "no_ai";
  if (globalState.AI_HELP > 0) {
    ai_assisted_flag = globalState.canShowAIAnswer ? "ai_after" : "ai_before";
  }

  const userChoice = createChoiceFromSolution(userSolution, ai_assisted_flag);
  trial.user_choice.push(userChoice);
}

export function recordBestChoiceData(trial, bestSolution) {
  const bestChoice = createChoiceFromSolution(bestSolution);
  trial.best_choice.push(bestChoice);
}

/**
 * @typedef {Object} ExperimentObject
 * @property {number} object_index
 * @property {number} final_distance // final distance between user and player
 * @property {boolean} is_intercepted
 * @property {number} final_value
 * @property {number} total_value
 */
