import { globalState } from "../data/variable";

// Utility Functions
export function getUrlParameters() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

export function lcg(seed) {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  let current = seed;
  return function () {
    current = (a * current + c) % m;
    return current / m; // normalize to [0,1]
  };
}

export function sampleBeta(alpha, beta) {
  function sampleGamma(shape) {
    // Marsaglia and Tsang method for sampling Gamma(shape, 1)
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    let u, v;
    do {
      do {
        u = globalState.randomGenerator();
        v = globalState.randomGenerator() * 2 - 1; // Uniformly distributed in (-1, 1)
      } while (u <= 0);
      const x = Math.pow(1 + c * v, 3);
      if (x > 0 && Math.log(u) < 0.5 * v * v + d * (1 - x + Math.log(x))) {
        return d * x;
      }
    } while (true);
  }

  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y); // Transform Gamma samples to Beta
}

export function generateUID(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    uid += chars[array[i] % chars.length];
  }

  return uid;
}

export function getCurrentDate() {
  return new Date();
}

export function getOrdinalSuffix(n) {
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

// Function to measure the refresh rate
export function measureRefreshRate() {
  let lastTimestamp = null;
  let frameTimestamps = [];
  const measureDuration = 1000; // Measure over 1 second

  return new Promise((resolve) => {
    function measureFrame(timestamp) {
      if (lastTimestamp !== null) {
        const frameDuration = timestamp - lastTimestamp;
        frameTimestamps.push(frameDuration);
      }
      lastTimestamp = timestamp;

      if (frameTimestamps.length < measureDuration / 16.67) {
        requestAnimationFrame(measureFrame);
      } else {
        const avgFrameDuration =
          frameTimestamps.reduce((sum, time) => sum + time, 0) /
          frameTimestamps.length;
        const refreshRate = Math.round(1000 / avgFrameDuration) || 60;
        const speedMultiplier = refreshRate / 60;
        resolve({ refreshRate, speedMultiplier });
      }
    }

    requestAnimationFrame(measureFrame);
  });
}
