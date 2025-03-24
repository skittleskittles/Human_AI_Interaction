const activeTimers = {
  trial: { seconds: 0, interval: null },
  think: { seconds: 0, interval: null },
};

/**
 * Starts a timer for a given mode
 * @param {"trial" | "think"} mode
 */
export function startTimer(mode) {
  const timer = activeTimers[mode];
  if (!timer || timer.interval) return; // already running

  timer.seconds = 0;
  timer.interval = setInterval(() => {
    if (document.visibilityState === "visible") {
      timer.seconds++;
    }
  }, 1000);
}

/**
 * Stops a timer for the given mode
 * @param {"trial" | "think"} mode
 */
export function stopTimer(mode) {
  const timer = activeTimers[mode];
  if (timer?.interval) {
    clearInterval(timer.interval);
    timer.interval = null;
  }
}

/**
 * Gets current recorded value in seconds
 * @param {"trial" | "think"} mode
 * @returns {number}
 */
export function getTimerValue(mode) {
  return activeTimers[mode]?.seconds ?? 0;
}

/**
 * Resets timer value for the given mode
 * @param {"trial" | "think"} mode
 */
export function resetTimerValue(mode) {
  if (activeTimers[mode]) {
    activeTimers[mode].seconds = 0;
  }
}
