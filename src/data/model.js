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
  experiments: [] // array of experiment
};

/**
 * @typedef {Object} Experiment
 * @property {number} experiment_id
 * @property {Date} create_time
 * @property {Date} end_time
 * @property {number} num_sequences
 * @property {Trial[]} results
 */

/**
 * @typedef {Object} Trial
 * @property {number} trial_id
 * @property {Date} create_time
 * @property {Date} end_time
 * @property {number} performance  // (user score / best score) * 100
 * @property {number} user_score
 * @property {number} best_score
 * @property {number} replay_num
 * @property {number} reselect_num
 * @property {number} think_time // seconds
 * @property {number} total_time // seconds
 * @property {ExperimentObject[]} best_choice
 * @property {ExperimentObject[]} user_choice
 */

/**
 * @typedef {Object} ExperimentObject
 * @property {number} object_index
 * @property {number} final_distance // final distance between user and player
 * @property {boolean} is_intercepted
 * @property {number} partial_value
 * @property {number} value
 */
