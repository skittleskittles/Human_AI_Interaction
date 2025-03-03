// Global Constants
export const refreshRate = 60; // Assumed refresh rate
export const OBSERVATION_FRAMES = Math.round(3000 * (refreshRate / 1000)); // 3000 ms for demo
export const INTERCEPTION_FRAMES = Math.round(2000 * (refreshRate / 1000)); // 2000 ms for interception
export const speedMultiplier = 1; // Multiplier to adjust speed based on refresh rate

export const MIN_SPEED = 60;
export const MAX_SPEED = 120;
export const alphaParam = 1;
export const betaParam = 2;
export const GAME_RADIUS = 400; // Radius of game circle
export const ARROW_FACTOR = 30;

export const randSeed = 12345; // Seed for random number generator

export const playerImage = new Image();
playerImage.src = new URL("../../assets/player.png", import.meta.url).href;
