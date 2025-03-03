import { globalState } from "../global/variable";

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
