// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"gLLPy":[function(require,module,exports,__globalThis) {
var _domElements = require("./global/domElements");
var _constant = require("./global/constant");
var _variable = require("./global/variable");
var _utils = require("./utils/utils");
var _solutionEvaluator = require("./logic/computation/solutionEvaluator");
var _gameEvents = require("./logic/gameEvents");
var _drawing = require("./logic/drawing");
let urlParams = (0, _utils.getUrlParameters)();
if (urlParams.NUM_SELECTIONS !== undefined) (0, _variable.globalState).NUM_SELECTIONS = Number(urlParams.NUM_SELECTIONS);
if (urlParams.NUM_OBJECTS !== undefined) (0, _variable.globalState).NUM_OBJECTS = Number(urlParams.NUM_OBJECTS);
if (urlParams.AI_HELP !== undefined) (0, _variable.globalState).AI_HELP = Number(urlParams.AI_HELP);
// Initial setup
function initGame(seed) {
    //
    if ((0, _variable.globalState).AI_HELP == 0) (0, _domElements.aiinfo).innerHTML = `<p>AI assistance will not be available in this session. </p>`;
    else if ((0, _variable.globalState).AI_HELP == 1) (0, _domElements.aiinfo).innerHTML = `<p>AI assistance will be available in this session. </p>`;
    else if ((0, _variable.globalState).AI_HELP == 2) (0, _domElements.aiinfo).innerHTML = `<p>AI assistance is available on request in this session. </p>`;
    // Enumerate all possible interception sequences of length NUM_SELECTIONS
    const indices = Array.from({
        length: (0, _variable.globalState).NUM_OBJECTS
    }, (_, i)=>i); // [0, 1, ..., N-1]
    (0, _variable.globalState).permutations = (0, _solutionEvaluator.generatePermutations)(indices, (0, _variable.globalState).NUM_SELECTIONS);
    (0, _variable.globalState).randomGenerator = (0, _utils.lcg)(seed); // Initialize random generator with the provided seed
    //infocontent.innerHTML = '<p>Measuring display refresh rate...</p>';
    //infocontent.innerHTML = `<p>Refresh rate detected: ${refreshRate} Hz. Press the button to start the game.</p>`;
    (0, _domElements.infocontent).innerHTML = `<p>Press the button to start. Please observe the sequence carefully.</p>`;
    (0, _drawing.clearCanvas)();
    (0, _drawing.drawGameCircle)();
    (0, _domElements.startButton).style.display = "block";
//startButton.blur();
}
/*
--------------------------------------------------------------------------------------

    Starting the game

--------------------------------------------------------------------------------------
*/ // Start initialization on page load with a seed
initGame((0, _constant.randSeed)); // Replace 12345 with any desired seed
// Add event listeners to buttons
(0, _domElements.startButton).addEventListener("click", (0, _gameEvents.startTrail));
(0, _domElements.reselectButton).addEventListener("click", (0, _gameEvents.reselectObjects));
(0, _domElements.interceptionButton).addEventListener("click", (0, _gameEvents.startInterceptionSequence));
(0, _domElements.aiRequest).addEventListener("click", (0, _gameEvents.revealAISolution));
(0, _domElements.finishButton).style.display = "block";
(0, _domElements.finishButton).addEventListener("click", (0, _gameEvents.finishGame));

},{"./global/domElements":"iD4j1","./global/constant":"hlnpD","./global/variable":"aywHw","./utils/utils":"5sJZc","./logic/computation/solutionEvaluator":"7Gapw","./logic/gameEvents":"6fMdc","./logic/drawing":"4xh0b"}],"iD4j1":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "canvas", ()=>canvas);
parcelHelpers.export(exports, "ctx", ()=>ctx);
parcelHelpers.export(exports, "info", ()=>info);
parcelHelpers.export(exports, "aiinfo", ()=>aiinfo);
parcelHelpers.export(exports, "infocontent", ()=>infocontent);
parcelHelpers.export(exports, "startButton", ()=>startButton);
parcelHelpers.export(exports, "replayButton", ()=>replayButton);
parcelHelpers.export(exports, "reselectButton", ()=>reselectButton);
parcelHelpers.export(exports, "interceptionButton", ()=>interceptionButton);
parcelHelpers.export(exports, "finishButton", ()=>finishButton);
parcelHelpers.export(exports, "aiRequest", ()=>aiRequest);
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");
const aiinfo = document.getElementById("aiinfo");
const infocontent = document.getElementById("infocontent");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const reselectButton = document.getElementById("reselectButton");
const interceptionButton = document.getElementById("interceptionButton");
const finishButton = document.getElementById("finishButton");
const aiRequest = document.getElementById("aiRequest");

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"hlnpD":[function(require,module,exports,__globalThis) {
// Global Constants
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "refreshRate", ()=>refreshRate);
parcelHelpers.export(exports, "OBSERVATION_FRAMES", ()=>OBSERVATION_FRAMES);
parcelHelpers.export(exports, "INTERCEPTION_FRAMES", ()=>INTERCEPTION_FRAMES);
parcelHelpers.export(exports, "speedMultiplier", ()=>speedMultiplier);
parcelHelpers.export(exports, "MIN_SPEED", ()=>MIN_SPEED);
parcelHelpers.export(exports, "MAX_SPEED", ()=>MAX_SPEED);
parcelHelpers.export(exports, "alphaParam", ()=>alphaParam);
parcelHelpers.export(exports, "betaParam", ()=>betaParam);
parcelHelpers.export(exports, "GAME_RADIUS", ()=>GAME_RADIUS);
parcelHelpers.export(exports, "ARROW_FACTOR", ()=>ARROW_FACTOR);
parcelHelpers.export(exports, "randSeed", ()=>randSeed);
parcelHelpers.export(exports, "playerImage", ()=>playerImage);
const refreshRate = 60; // Assumed refresh rate
const OBSERVATION_FRAMES = Math.round(3000 * (refreshRate / 1000)); // 3000 ms for demo
const INTERCEPTION_FRAMES = Math.round(2000 * (refreshRate / 1000)); // 2000 ms for interception
const speedMultiplier = 1; // Multiplier to adjust speed based on refresh rate
const MIN_SPEED = 60;
const MAX_SPEED = 120;
const alphaParam = 1;
const betaParam = 2;
const GAME_RADIUS = 400; // Radius of game circle
const ARROW_FACTOR = 30;
const randSeed = 12345; // Seed for random number generator
const playerImage = new Image();
playerImage.src = new URL(require("2863af52f5c6f948")).href;

},{"2863af52f5c6f948":"17M0c","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"17M0c":[function(require,module,exports,__globalThis) {
module.exports = require("3497a3675a8e62ce").getBundleURL('kLM7g') + "player.9326ee9c.png";

},{"3497a3675a8e62ce":"lgJ39"}],"lgJ39":[function(require,module,exports,__globalThis) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ('' + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return '/';
}
function getBaseURL(url) {
    return ('' + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ('' + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error('Origin not found');
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"aywHw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "globalState", ()=>globalState);
const globalState = {
    NUM_SELECTIONS: 2,
    NUM_OBJECTS: 5,
    AI_HELP: 0,
    curTrial: 0,
    totalTrials: 1,
    randomGenerator: null,
    centerX: 0,
    centerY: 0,
    totalFrames: 0,
    animationFrameId: 0,
    animationStartTime: 0,
    objects: [],
    selectedObjects: [],
    hoverObjectIndex: -1,
    speedMultiplier: 1,
    player: {
        x0: 0,
        y0: 0,
        radius: 15,
        speed: 0,
        dX: 0,
        dY: 0,
        x: 0,
        y: 0
    },
    permutations: [],
    allSolutions: null,
    bestSolution: null,
    playerSolution: null,
    interceptionCounter: 0,
    interceptionFrame: 0,
    canshowRequestAI: false
}; /*
allSolutions = [
  {
    sequence: [...],       // 序列（对象的索引列表）
    totalValue: number,    // 该序列获得的总分数
    moves: [               // 追踪玩家的拦截行动
      {
        success: boolean,       // 该拦截是否成功
        value: number,          // 如果在圆内，拦截目标的得分
        timeToIntercept: number,// 需要的帧数
        dX: number,             // 玩家在 X 方向的移动速度
        dY: number,             // 玩家在 Y 方向的移动速度
        interceptPosX: number,  // 拦截点 X 坐标
        interceptPosY: number,  // 拦截点 Y 坐标
      },
      ...
    ]
  },
  ...
];*/ 

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5sJZc":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Utility Functions
parcelHelpers.export(exports, "getUrlParameters", ()=>getUrlParameters);
parcelHelpers.export(exports, "lcg", ()=>lcg);
parcelHelpers.export(exports, "sampleBeta", ()=>sampleBeta);
var _variable = require("../global/variable");
function getUrlParameters() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries())params[key] = value;
    return params;
}
function lcg(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let current = seed;
    return function() {
        current = (a * current + c) % m;
        return current / m; // normalize to [0,1]
    };
}
function sampleBeta(alpha, beta) {
    function sampleGamma(shape) {
        // Marsaglia and Tsang method for sampling Gamma(shape, 1)
        const d = shape - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);
        let u, v;
        do {
            do {
                u = (0, _variable.globalState).randomGenerator();
                v = (0, _variable.globalState).randomGenerator() * 2 - 1; // Uniformly distributed in (-1, 1)
            }while (u <= 0);
            const x = Math.pow(1 + c * v, 3);
            if (x > 0 && Math.log(u) < 0.5 * v * v + d * (1 - x + Math.log(x))) return d * x;
        }while (true);
    }
    const x = sampleGamma(alpha);
    const y = sampleGamma(beta);
    return x / (x + y); // Transform Gamma samples to Beta
}

},{"../global/variable":"aywHw","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7Gapw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/*
--------------------------------------------------------------------------------------

    Generate all possible permutations

--------------------------------------------------------------------------------------
*/ parcelHelpers.export(exports, "generatePermutations", ()=>generatePermutations);
parcelHelpers.export(exports, "lookupInterceptionPaths", ()=>lookupInterceptionPaths);
/*
--------------------------------------------------------------------------------------

    Computing the Optimal Interception Paths

--------------------------------------------------------------------------------------
*/ parcelHelpers.export(exports, "enumerateAllSolutions", ()=>enumerateAllSolutions);
var _variable = require("../../global/variable");
var _constant = require("../../global/constant");
var _interceptionSimulator = require("./interceptionSimulator");
function generatePermutations(arr, k) {
    const result = [];
    function helper(currentPermutation) {
        // If the current permutation is of length k, add it to the result
        if (currentPermutation.length === k) {
            result.push([
                ...currentPermutation
            ]);
            return;
        }
        for(let i = 0; i < arr.length; i++){
            if (currentPermutation.includes(arr[i])) continue; // Skip duplicates
            helper([
                ...currentPermutation,
                arr[i]
            ]); // Recursive call with new element added
        }
    }
    helper([]); // Start recursion with an empty permutation
    return result;
}
function lookupInterceptionPaths() {
    for(let i = 0; i < (0, _variable.globalState).NUM_SELECTIONS; i++)console.log(`Object selected ${i} = ${(0, _variable.globalState).selectedObjects[i]}`);
    // Find the index of the matching permutation
    const matchingIndex = findMatchingPermutationIndex((0, _variable.globalState).permutations, (0, _variable.globalState).selectedObjects);
    let playerSolution;
    console.log(`Matching index: ${matchingIndex}`);
    if (matchingIndex !== -1) {
        console.log(`Matching permutation:`, (0, _variable.globalState).permutations[matchingIndex]);
        playerSolution = (0, _variable.globalState).allSolutions[matchingIndex];
    } else console.log(`No matching permutation found.`);
    return playerSolution;
}
function findMatchingPermutationIndex(permutations, selectedObjects) {
    return permutations.findIndex((permutation)=>permutation.length === selectedObjects.length && permutation.every((value, index)=>value === selectedObjects[index]));
}
function enumerateAllSolutions() {
    const numSequences = (0, _variable.globalState).permutations.length;
    let allSolutions = [];
    let bestSolutionIndex = -1;
    let maxValue = -Infinity;
    for(let i = 0; i < numSequences; i++){
        let sequence = (0, _variable.globalState).permutations[i];
        // Clone objects and player to simulate movement
        let copyObjects = structuredClone((0, _variable.globalState).objects);
        let copyPlayer = structuredClone((0, _variable.globalState).player);
        let totalValue = 0;
        let moves = [];
        let isInProgress = true; // Interception is still active
        for(let j = 0; j < (0, _variable.globalState).NUM_SELECTIONS; j++){
            const id = sequence[j];
            const objectNow = copyObjects[id];
            let [success, timeToIntercept, interceptPosX, interceptPosY, finalDistanceAtCircle] = (0, _interceptionSimulator.attemptIntercept)(isInProgress, copyPlayer.x, copyPlayer.y, copyPlayer.speed, objectNow.x, objectNow.y, objectNow.dX, objectNow.dY);
            // Move player and objects if still intercepting
            if (isInProgress) {
                let move = processMove(success, timeToIntercept, copyPlayer, interceptPosX, interceptPosY, copyObjects);
                moves.push(move);
            }
            // Compute score for this object
            let valueNow = computeObjectValue(objectNow, success, finalDistanceAtCircle, j, isInProgress);
            totalValue += valueNow;
            // If interception fails, mark as not in progress
            if (!success && isInProgress) isInProgress = false;
        }
        let solution = {
            sequence,
            totalValue,
            moves
        };
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
    return [
        allSolutions,
        allSolutions[bestSolutionIndex]
    ];
}
/**
 * Processes a move when interception is successful.
 */ function processMove(success, timeToIntercept, player, interceptPosX, interceptPosY, objects) {
    let move = {
        success
    };
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
    for (let obj of objects){
        obj.x += timeToIntercept * obj.dX;
        obj.y += timeToIntercept * obj.dY;
    }
    return move;
}
/**
 * Computes the value of the object based on whether interception was successful.
 */ function computeObjectValue(object, success, finalDistanceAtCircle, selectionIndex, isInProgress) {
    if (success) return object.value;
    // Apply weight-based scoring for missed interceptions
    let weight = 0.5 * ((0, _variable.globalState).NUM_SELECTIONS - selectionIndex);
    let scaledValue = ((0, _constant.GAME_RADIUS) * 2 - finalDistanceAtCircle) / ((0, _constant.GAME_RADIUS) * 2) * object.value * weight;
    return isInProgress ? scaledValue : 0; // If no longer in progress, weight is applied
}
/**
 * Normalizes all solution values relative to the maximum.
 */ function normalizeSolutionValues(solutions, maxValue) {
    for (let sol of solutions)sol.totalValueProp = sol.totalValue / maxValue;
}
/**
 * Logs all solutions and the best one.
 */ function logSolutions(solutions, bestSolutionIndex, maxValue) {
    console.log(`
\u{1F539} All Solutions Summary:`);
    solutions.forEach((sol, i)=>{
        console.log(`${i}: Sequence ${sol.sequence}, Score: ${sol.totalValue.toFixed(2)}`);
        sol.moves.forEach((move, index)=>{
            console.log(`   \u{21B3} Move ${index}: success=${move.success}`);
        });
    });
    console.log(`
\u{1F3C6} Best solution = ${(0, _variable.globalState).permutations[bestSolutionIndex]}, maxValue = ${maxValue.toFixed(2)}`);
}

},{"../../global/variable":"aywHw","../../global/constant":"hlnpD","./interceptionSimulator":"lpYXz","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lpYXz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "attemptIntercept", ()=>attemptIntercept);
var _variable = require("../../global/variable");
var _constant = require("../../global/constant");
function attemptIntercept(isInProgress, playerPosX, playerPosY, playerSpeed, objectPosX, objectPosY, objectVelX, objectVelY) {
    let success = false;
    let travelTime = Infinity;
    let interceptPosX = NaN, interceptPosY = NaN;
    // let totalDistanceTraveled = Infinity;
    let finalDistanceAtCircle, timeToCircle, circleBoundaryX, circleBoundaryY;
    // If interception is already over, compute final distance at the circle boundary
    if (!isInProgress) return computeNoInterceptCase(playerPosX, playerPosY, objectPosX, objectPosY, objectVelX, objectVelY);
    // Compute interception time using quadratic formula
    let [hasSolution, t1, t2] = solveQuadraticEquation(objectVelX ** 2 + objectVelY ** 2 - playerSpeed ** 2, 2 * ((objectPosX - playerPosX) * objectVelX + (objectPosY - playerPosY) * objectVelY), (objectPosX - playerPosX) ** 2 + (objectPosY - playerPosY) ** 2);
    // If no valid interception time exists, handle failure case
    if (!hasSolution) return computeNoInterceptCase(playerPosX, playerPosY, objectPosX, objectPosY, objectVelX, objectVelY);
    // Select the smallest valid interception time
    travelTime = t1 >= 0 && (t1 < t2 || t2 < 0) ? t1 : t2 >= 0 ? t2 : Infinity;
    if (travelTime === Infinity) return computeNoInterceptCase(playerPosX, playerPosY, objectPosX, objectPosY, objectVelX, objectVelY);
    // Compute interception position
    interceptPosX = objectPosX + travelTime * objectVelX;
    interceptPosY = objectPosY + travelTime * objectVelY;
    // totalDistanceTraveled = travelTime * playerSpeed;
    // Compute final distance at the circle boundary
    [finalDistanceAtCircle, timeToCircle, circleBoundaryX, circleBoundaryY] = computeFinalDistanceAtCircleBoundary(playerPosX, playerPosY, (interceptPosX - playerPosX) / Math.round(travelTime), (interceptPosY - playerPosY) / Math.round(travelTime), objectPosX, objectPosY, objectVelX, objectVelY);
    // Check if interception is within the circle
    success = isWithinCircle(interceptPosX, interceptPosY);
    // Adjust return values based on interception success
    if (!success) {
        interceptPosX = circleBoundaryX;
        interceptPosY = circleBoundaryY;
        travelTime = timeToCircle;
    } else finalDistanceAtCircle = 0;
    return [
        success,
        travelTime,
        interceptPosX,
        interceptPosY,
        finalDistanceAtCircle
    ];
}
/**
 * Handles the case where interception is impossible.
 */ function computeNoInterceptCase(playerPosX, playerPosY, objectPosX, objectPosY, objectVelX, objectVelY) {
    return computeFinalDistanceAtCircleBoundary(playerPosX, playerPosY, 0, 0, objectPosX, objectPosY, objectVelX, objectVelY);
}
/**
 * Computes whether a point is inside the circle.
 */ function isWithinCircle(x, y) {
    return Math.sqrt((x - (0, _variable.globalState).centerX) ** 2 + (y - (0, _variable.globalState).centerY) ** 2) <= (0, _constant.GAME_RADIUS);
}
/**
 * Computes player's movement to the circle boundary and final distance to object.
 */ function computeFinalDistanceAtCircleBoundary(playerPosX, playerPosY, playerVelX, playerVelY, objectPosX, objectPosY, objectVelX, objectVelY) {
    if (Math.abs(playerVelX) < 1e-6 && Math.abs(playerVelY) < 1e-6) [playerVelX, playerVelY] = computeDirectionVector(playerPosX, playerPosY, objectPosX, objectPosY);
    let [timeToCircle, circleBoundaryX, circleBoundaryY] = computePlayerDistanceToCircleBoundary(playerPosX, playerPosY, playerVelX, playerVelY);
    let objectFutureX = objectPosX + timeToCircle * objectVelX;
    let objectFutureY = objectPosY + timeToCircle * objectVelY;
    let finalDistanceAtCircle = Math.sqrt((objectFutureX - circleBoundaryX) ** 2 + (objectFutureY - circleBoundaryY) ** 2);
    return [
        finalDistanceAtCircle,
        timeToCircle,
        circleBoundaryX,
        circleBoundaryY
    ];
}
/**
 * Computes a normalized direction vector from (startX, startY) to (targetX, targetY).
 */ function computeDirectionVector(startX, startY, targetX, targetY) {
    let dirX = targetX - startX;
    let dirY = targetY - startY;
    let magnitude = Math.sqrt(dirX ** 2 + dirY ** 2);
    return magnitude > 1e-6 ? [
        dirX / magnitude,
        dirY / magnitude
    ] : [
        0,
        0
    ];
}
/**
 * Computes the player's distance to the circle boundary using quadratic intersection.
 */ function computePlayerDistanceToCircleBoundary(playerPosX, playerPosY, playerVelX, playerVelY) {
    let centerX = (0, _variable.globalState).centerX;
    let centerY = (0, _variable.globalState).centerY;
    let playerDistToCenter = Math.sqrt((playerPosX - centerX) ** 2 + (playerPosY - centerY) ** 2);
    if (Math.abs(playerDistToCenter - (0, _constant.GAME_RADIUS)) < 1e-6) return [
        0,
        playerPosX,
        playerPosY
    ];
    let [hasSolution, t1, t2] = solveQuadraticEquation(playerVelX ** 2 + playerVelY ** 2, 2 * ((playerPosX - centerX) * playerVelX + (playerPosY - centerY) * playerVelY), (playerPosX - centerX) ** 2 + (playerPosY - centerY) ** 2 - (0, _constant.GAME_RADIUS) ** 2);
    if (!hasSolution) {
        console.warn("\uD83D\uDEA8 Player's movement does not reach the circle boundary.");
        return [
            Infinity,
            NaN,
            NaN
        ];
    }
    let timeToCircle = t1 >= 0 && (t1 < t2 || t2 < 0) ? t1 : t2 >= 0 ? t2 : Infinity;
    if (timeToCircle === Infinity) {
        console.warn("\uD83D\uDEA8 Player is moving away from the circle.");
        return [
            Infinity,
            NaN,
            NaN
        ];
    }
    return [
        timeToCircle,
        playerPosX + timeToCircle * playerVelX,
        playerPosY + timeToCircle * playerVelY
    ];
}
/**
 * Solves a quadratic equation Ax^2 + Bx + C = 0 and returns [hasSolution, t1, t2].
 */ function solveQuadraticEquation(A, B, C) {
    let discriminant = B ** 2 - 4 * A * C;
    if (discriminant < 0) return [
        false,
        NaN,
        NaN
    ];
    let sqrtD = Math.sqrt(discriminant);
    return [
        true,
        (-B + sqrtD) / (2 * A),
        (-B - sqrtD) / (2 * A)
    ];
}

},{"../../global/variable":"aywHw","../../global/constant":"hlnpD","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6fMdc":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "startTrail", ()=>startTrail);
parcelHelpers.export(exports, "reselectObjects", ()=>reselectObjects);
parcelHelpers.export(exports, "startInterceptionSequence", ()=>startInterceptionSequence);
parcelHelpers.export(exports, "endDemo", ()=>endDemo);
parcelHelpers.export(exports, "replayDemo", ()=>replayDemo);
parcelHelpers.export(exports, "revealAISolution", ()=>revealAISolution);
parcelHelpers.export(exports, "finishGame", ()=>finishGame);
var _variableJs = require("../global/variable.js");
var _domElementsJs = require("../global/domElements.js");
var _drawingJs = require("./drawing.js");
var _animationJs = require("./animation.js");
var _initializeJs = require("./initialize.js");
var _mouseEventsJs = require("./mouseEvents.js");
var _solutionEvaluatorJs = require("./computation/solutionEvaluator.js");
function startTrail() {
    (0, _variableJs.globalState).curTrial++;
    console.log(`------curTrail: ${(0, _variableJs.globalState).curTrial}---------`);
    // Hide the start round button
    (0, _domElementsJs.startButton).style.display = "none";
    (0, _domElementsJs.startButton).blur();
    (0, _domElementsJs.aiRequest).disabled = true;
    // Update the info div
    (0, _domElementsJs.infocontent).innerHTML = "<p>Example sequence in progress...</p>";
    (0, _variableJs.globalState).canshowRequestAI = false;
    // Initialize the objects and the player positions, direction and speed
    (0, _initializeJs.initializeObjects)((0, _variableJs.globalState).curTrial === 1);
    (0, _initializeJs.initializePlayer)();
    // Reset frame counter for the demo
    (0, _variableJs.globalState).totalFrames = 0;
    // Start the animation
    (0, _variableJs.globalState).animationFrameId = requestAnimationFrame((0, _animationJs.animateObjects));
}
function reselectObjects() {
    for (let index of (0, _variableJs.globalState).selectedObjects){
        let object = (0, _variableJs.globalState).objects.find((obj)=>obj.index === index);
        if (object) {
            object.isSelected = false;
            delete object.selectionIndex;
        }
    }
    (0, _variableJs.globalState).hoverObjectIndex = -1;
    (0, _variableJs.globalState).selectedObjects = [];
    (0, _domElementsJs.canvas).addEventListener("click", (0, _mouseEventsJs.handleObjectSelection));
    (0, _domElementsJs.canvas).addEventListener("mousemove", (0, _mouseEventsJs.handleMouseHover));
    (0, _drawingJs.clearCanvas)();
    (0, _drawingJs.drawGameCircle)();
    (0, _drawingJs.drawObjects)();
    (0, _drawingJs.drawPlayer)();
    (0, _domElementsJs.interceptionButton).style.display = "none";
    (0, _domElementsJs.reselectButton).disabled = true;
    (0, _domElementsJs.replayButton).disabled = false;
}
function startInterceptionSequence() {
    (0, _domElementsJs.reselectButton).style.display = "none";
    (0, _domElementsJs.interceptionButton).style.display = "none"; // Hide the interception button
    (0, _domElementsJs.replayButton).style.display = "none";
    (0, _domElementsJs.aiRequest).style.display = "none";
    //aiRequest.disabled = true; // Disables the button
    (0, _variableJs.globalState).playerSolution = (0, _solutionEvaluatorJs.lookupInterceptionPaths)();
    (0, _variableJs.globalState).interceptionCounter = 0; // the index of the interception path
    (0, _variableJs.globalState).interceptionFrame = 0;
    (0, _domElementsJs.infocontent).innerHTML = "<p>Interception sequence in progress...</p>";
    (0, _variableJs.globalState).canshowRequestAI = false;
    // Start the interception animation
    (0, _variableJs.globalState).animationFrameId = requestAnimationFrame((0, _animationJs.animateInterception));
}
function endDemo() {
    cancelAnimationFrame((0, _variableJs.globalState).animationFrameId);
    (0, _domElementsJs.infocontent).innerHTML = `<p><center>OR</center></p><p>When ready, click on ${(0, _variableJs.globalState).NUM_SELECTIONS} objects to determine the order of interception. The goal is to maximize the point value across successfully intercepted objects</p>`;
    if ((0, _variableJs.globalState).AI_HELP == 1) (0, _domElementsJs.infocontent).innerHTML += `<p>The suggested AI solution is shown in blue </p>`;
    (0, _domElementsJs.canvas).addEventListener("click", (0, _mouseEventsJs.handleObjectSelection));
    (0, _domElementsJs.canvas).addEventListener("mousemove", (0, _mouseEventsJs.handleMouseHover));
    // Show the replay button
    (0, _domElementsJs.replayButton).disabled = false; // enables the button
    (0, _domElementsJs.replayButton).style.display = "block";
    (0, _domElementsJs.replayButton).addEventListener("click", replayDemo);
    [(0, _variableJs.globalState).allSolutions, (0, _variableJs.globalState).bestSolution] = (0, _solutionEvaluatorJs.enumerateAllSolutions)();
    if ((0, _variableJs.globalState).AI_HELP == 2) {
        (0, _domElementsJs.aiRequest).style.display = "block";
        (0, _domElementsJs.aiRequest).disabled = false;
    }
    if ((0, _variableJs.globalState).AI_HELP == 1) (0, _variableJs.globalState).canshowRequestAI = true;
    (0, _drawingJs.clearCanvas)();
    (0, _drawingJs.drawGameCircle)();
    (0, _drawingJs.drawObjects)();
    (0, _drawingJs.drawPlayer)();
}
function replayDemo() {
    (0, _variableJs.globalState).canshowRequestAI = false;
    (0, _domElementsJs.replayButton).disabled = true; // Disables the button
    //replayButton.style.display = 'none'; // Hide the button during replay
    //initializeObjects(); // Reinitialize objects for replay
    //initializePlayer();  // Reinitialize player for replay
    (0, _variableJs.globalState).totalFrames = 0; // Reset frame counter
    (0, _variableJs.globalState).animationFrameId = requestAnimationFrame((0, _animationJs.animateObjects));
}
function revealAISolution() {
    if ((0, _variableJs.globalState).AI_HELP == 2) {
        (0, _variableJs.globalState).canshowRequestAI = true;
        (0, _drawingJs.clearCanvas)();
        (0, _drawingJs.drawGameCircle)();
        (0, _drawingJs.drawObjects)();
        (0, _drawingJs.drawPlayer)();
    }
}
function finishGame() {
    cancelAnimationFrame((0, _variableJs.globalState).animationFrameId);
    (0, _drawingJs.clearCanvas)();
    (0, _domElementsJs.canvas).removeEventListener("click", (0, _mouseEventsJs.handleObjectSelection));
    (0, _domElementsJs.canvas).removeEventListener("mousemove", (0, _mouseEventsJs.handleMouseHover));
    console.log("jump to feedback");
    window.location.href = "/feedback.html";
}

},{"../global/variable.js":"aywHw","../global/domElements.js":"iD4j1","./drawing.js":"4xh0b","./animation.js":"bRKlk","./initialize.js":"lsRQu","./mouseEvents.js":"aDgsz","./computation/solutionEvaluator.js":"7Gapw","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4xh0b":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Function to draw arrows indicating direction and speed
parcelHelpers.export(exports, "drawArrows", ()=>drawArrows);
parcelHelpers.export(exports, "drawPlayerArrow", ()=>drawPlayerArrow);
// Function to draw all animated objects
parcelHelpers.export(exports, "drawObjects", ()=>drawObjects);
parcelHelpers.export(exports, "drawPlayer", ()=>drawPlayer);
// Function to draw the main circle
parcelHelpers.export(exports, "drawGameCircle", ()=>drawGameCircle);
// Function to clear the canvas
parcelHelpers.export(exports, "clearCanvas", ()=>clearCanvas);
var _constantJs = require("../global/constant.js");
var _variableJs = require("../global/variable.js");
var _domElementsJs = require("../global/domElements.js");
function drawArrows() {
    (0, _variableJs.globalState).objects.forEach((object)=>{
        if (!object.isIntercepted) {
            const arrowLength = Math.sqrt(object.dX ** 2 + object.dY ** 2) * (0, _constantJs.ARROW_FACTOR); // Scale speed for arrow length
            const angle = Math.atan2(object.dY, object.dX);
            const startX = object.x;
            const startY = object.y;
            const endX = startX + arrowLength * Math.cos(angle);
            const endY = startY + arrowLength * Math.sin(angle);
            // Draw the main arrow line
            (0, _domElementsJs.ctx).beginPath();
            (0, _domElementsJs.ctx).moveTo(startX, startY);
            (0, _domElementsJs.ctx).lineTo(endX, endY);
            (0, _domElementsJs.ctx).lineWidth = 2;
            (0, _domElementsJs.ctx).strokeStyle = "gray";
            (0, _domElementsJs.ctx).stroke();
            // Draw the arrowhead
            const arrowheadLength = 12;
            const arrowheadAngle = Math.PI / 6;
            const leftX = endX - arrowheadLength * Math.cos(angle - arrowheadAngle);
            const leftY = endY - arrowheadLength * Math.sin(angle - arrowheadAngle);
            const rightX = endX - arrowheadLength * Math.cos(angle + arrowheadAngle);
            const rightY = endY - arrowheadLength * Math.sin(angle + arrowheadAngle);
            (0, _domElementsJs.ctx).beginPath();
            (0, _domElementsJs.ctx).moveTo(endX, endY);
            (0, _domElementsJs.ctx).lineTo(leftX, leftY);
            (0, _domElementsJs.ctx).lineTo(rightX, rightY);
            (0, _domElementsJs.ctx).closePath();
            (0, _domElementsJs.ctx).fillStyle = "gray";
            (0, _domElementsJs.ctx).fill();
        }
    });
}
function drawPlayerArrow() {
    // Draw the player arrow
    const arrowLength = Math.sqrt((0, _variableJs.globalState).player.dX ** 2 + (0, _variableJs.globalState).player.dY ** 2) * (0, _constantJs.ARROW_FACTOR); // Scale speed for arrow length
    const angle = Math.atan2((0, _variableJs.globalState).player.dY, (0, _variableJs.globalState).player.dX);
    const startX = (0, _variableJs.globalState).player.x;
    const startY = (0, _variableJs.globalState).player.y;
    const endX = startX + arrowLength * Math.cos(angle);
    const endY = startY + arrowLength * Math.sin(angle);
    // Draw the main arrow line
    (0, _domElementsJs.ctx).beginPath();
    (0, _domElementsJs.ctx).moveTo(startX, startY);
    (0, _domElementsJs.ctx).lineTo(endX, endY);
    (0, _domElementsJs.ctx).lineWidth = 2;
    (0, _domElementsJs.ctx).strokeStyle = "gray";
    (0, _domElementsJs.ctx).stroke();
    // Draw the arrowhead
    const arrowheadLength = 12;
    const arrowheadAngle = Math.PI / 6;
    const leftX = endX - arrowheadLength * Math.cos(angle - arrowheadAngle);
    const leftY = endY - arrowheadLength * Math.sin(angle - arrowheadAngle);
    const rightX = endX - arrowheadLength * Math.cos(angle + arrowheadAngle);
    const rightY = endY - arrowheadLength * Math.sin(angle + arrowheadAngle);
    (0, _domElementsJs.ctx).beginPath();
    (0, _domElementsJs.ctx).moveTo(endX, endY);
    (0, _domElementsJs.ctx).lineTo(leftX, leftY);
    (0, _domElementsJs.ctx).lineTo(rightX, rightY);
    (0, _domElementsJs.ctx).closePath();
    (0, _domElementsJs.ctx).fillStyle = "gray";
    (0, _domElementsJs.ctx).fill();
}
function drawObjects() {
    (0, _variableJs.globalState).objects.forEach((object, index)=>{
        if (!object.isIntercepted) {
            // Highlight object if hovered
            if (index === (0, _variableJs.globalState).hoverObjectIndex) {
                (0, _domElementsJs.ctx).beginPath();
                (0, _domElementsJs.ctx).arc(object.x, object.y, object.radius + 5, 0, Math.PI * 2);
                (0, _domElementsJs.ctx).fillStyle = "rgba(255, 0, 0, 0.3)"; // Glow effect
                (0, _domElementsJs.ctx).fill();
            }
            // Draw the object's filled area
            (0, _domElementsJs.ctx).beginPath();
            (0, _domElementsJs.ctx).arc(object.x, object.y, object.radius * object.value, 0, Math.PI * 2);
            (0, _domElementsJs.ctx).fillStyle = "red";
            (0, _domElementsJs.ctx).fill();
            // Set text alignment and baseline for centering
            (0, _domElementsJs.ctx).textAlign = "center"; // Aligns text horizontally to the center
            (0, _domElementsJs.ctx).textBaseline = "middle"; // Aligns text vertically to the center
            (0, _domElementsJs.ctx).fillStyle = "rgb(0, 0, 0)";
            let fontSize = 20;
            (0, _domElementsJs.ctx).font = `${fontSize}px Arial`;
            (0, _domElementsJs.ctx).fillText(index, object.x, object.y);
            // Draw the object's border
            (0, _domElementsJs.ctx).beginPath();
            (0, _domElementsJs.ctx).arc(object.x, object.y, object.radius, 0, Math.PI * 2);
            (0, _domElementsJs.ctx).lineWidth = 3;
            //ctx.fillStyle = 'rgba(14, 13, 13, 0.3)'; // Glow effect
            (0, _domElementsJs.ctx).strokeStyle = "red";
            (0, _domElementsJs.ctx).stroke();
            //ctx.fill();
            // Draw selection number if selected
            if (object.isSelected) {
                const selectionIndex = object.selectionIndex;
                (0, _domElementsJs.ctx).fillStyle = "black";
                (0, _domElementsJs.ctx).font = "24px Arial";
                (0, _domElementsJs.ctx).fillText(selectionIndex + 1, object.x + object.radius + 14, object.y + 8);
            }
            if ((0, _variableJs.globalState).canshowRequestAI) {
                let AISelectionIndex = (0, _variableJs.globalState).bestSolution.sequence.indexOf(index);
                if (AISelectionIndex !== -1) {
                    (0, _domElementsJs.ctx).fillStyle = "blue";
                    (0, _domElementsJs.ctx).font = "24px Arial";
                    (0, _domElementsJs.ctx).fillText(AISelectionIndex + 1, object.x - object.radius - 20, object.y + 8);
                }
            }
        }
    });
    // Draw arrows for all objects
    drawArrows();
}
function drawPlayer() {
    // Draw the player image
    if ((0, _constantJs.playerImage).complete && (0, _constantJs.playerImage).naturalWidth !== 0) {
        // Ensure the image is loaded before drawing
        const imageWidth = 60; // Adjust the size of the image
        const imageHeight = 60;
        (0, _domElementsJs.ctx).drawImage((0, _constantJs.playerImage), (0, _variableJs.globalState).player.x - imageWidth / 2, (0, _variableJs.globalState).player.y - imageHeight / 2, imageWidth, imageHeight);
    } else {
        // Fallback in case the image hasn't loaded yet
        (0, _domElementsJs.ctx).beginPath();
        (0, _domElementsJs.ctx).arc((0, _variableJs.globalState).player.x, (0, _variableJs.globalState).player.y, (0, _variableJs.globalState).player.radius, 0, Math.PI * 2);
        (0, _domElementsJs.ctx).fillStyle = "blue";
        (0, _domElementsJs.ctx).fill();
    }
}
function drawGameCircle() {
    (0, _variableJs.globalState).centerX = (0, _domElementsJs.canvas).width / 2;
    (0, _variableJs.globalState).centerY = (0, _domElementsJs.canvas).height / 2;
    (0, _domElementsJs.ctx).save(); // Save the current canvas state
    (0, _domElementsJs.ctx).beginPath();
    (0, _domElementsJs.ctx).arc((0, _variableJs.globalState).centerX, (0, _variableJs.globalState).centerY, (0, _constantJs.GAME_RADIUS), 0, Math.PI * 2); // Define the clipping path
    (0, _domElementsJs.ctx).clip(); // Apply clipping to restrict drawings to this area
    // Draw the main circle
    (0, _domElementsJs.ctx).beginPath();
    (0, _domElementsJs.ctx).arc((0, _variableJs.globalState).centerX, (0, _variableJs.globalState).centerY, (0, _constantJs.GAME_RADIUS), 0, Math.PI * 2);
    (0, _domElementsJs.ctx).fillStyle = "white";
    (0, _domElementsJs.ctx).fill();
    (0, _domElementsJs.ctx).lineWidth = 5;
    (0, _domElementsJs.ctx).strokeStyle = "black";
    (0, _domElementsJs.ctx).stroke();
}
function clearCanvas() {
    (0, _domElementsJs.ctx).restore(); // Restore to the original canvas state
    (0, _domElementsJs.ctx).clearRect(0, 0, (0, _domElementsJs.canvas).width, (0, _domElementsJs.canvas).height);
}

},{"../global/constant.js":"hlnpD","../global/variable.js":"aywHw","../global/domElements.js":"iD4j1","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bRKlk":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "animateObjects", ()=>animateObjects);
parcelHelpers.export(exports, "animateInterception", ()=>animateInterception);
var _constantJs = require("../global/constant.js");
var _variableJs = require("../global/variable.js");
var _domElementsJs = require("../global/domElements.js");
var _drawingJs = require("./drawing.js");
var _gameEventsJs = require("./gameEvents.js");
function animateObjects() {
    // Update positions and redraw
    updateObjectPositions((0, _variableJs.globalState).totalFrames);
    (0, _drawingJs.clearCanvas)();
    (0, _drawingJs.drawGameCircle)();
    (0, _drawingJs.drawObjects)();
    (0, _drawingJs.drawPlayer)();
    // Increment frame counter
    (0, _variableJs.globalState).totalFrames++;
    // Continue animation or end demo
    if ((0, _variableJs.globalState).totalFrames < (0, _constantJs.OBSERVATION_FRAMES)) (0, _variableJs.globalState).animationFrameId = requestAnimationFrame(animateObjects);
    else (0, _gameEventsJs.endDemo)();
}
function animateInterception() {
    // Update positions and redraw
    updateObjectPositions((0, _variableJs.globalState).totalFrames);
    let [status, success] = updatePlayerPosition();
    (0, _drawingJs.clearCanvas)();
    (0, _drawingJs.drawGameCircle)();
    (0, _drawingJs.drawObjects)();
    (0, _drawingJs.drawPlayer)(); // temp
    // Increment frame counter
    (0, _variableJs.globalState).totalFrames++;
    // Is the player still within the game area?
    let isInCircle = Math.sqrt(((0, _variableJs.globalState).player.x - (0, _variableJs.globalState).centerX) ** 2 + ((0, _variableJs.globalState).player.y - (0, _variableJs.globalState).centerY) ** 2) <= (0, _constantJs.GAME_RADIUS);
    // Continue animation or end interception sequence
    if (isInCircle && status == "in progress") (0, _variableJs.globalState).animationFrameId = requestAnimationFrame(animateInterception);
    else finishTrial(isInCircle, success);
}
function finishTrial(isInCircle, success) {
    console.log(`Finished interception sequence`);
    cancelAnimationFrame((0, _variableJs.globalState).animationFrameId);
    if ((0, _variableJs.globalState).curTrial === (0, _variableJs.globalState).totalTrials) (0, _domElementsJs.finishButton).style.display = "block";
    else (0, _domElementsJs.startButton).style.display = "block";
    let valNow = Math.round((0, _variableJs.globalState).playerSolution.totalValueProp * 100);
    if (!isInCircle || !success) (0, _domElementsJs.infocontent).innerHTML = `<p>Reached outside of the circle</p><p>Point value achieved: ${valNow}% of the best AI solution.</p>`;
    else (0, _domElementsJs.infocontent).innerHTML = `<p>Finished interception sequence</p><p>Point value achieved: ${valNow}% of the best AI solution.</p>`;
}
// Function to update object positions
function updateObjectPositions(frame) {
    (0, _variableJs.globalState).objects.forEach((object)=>{
        // Update object's position based on its speed
        object.x = object.x0 + frame * object.dX;
        object.y = object.y0 + frame * object.dY;
    });
}
function updatePlayerPosition() {
    let currentMove = (0, _variableJs.globalState).playerSolution.moves[(0, _variableJs.globalState).interceptionCounter]; // object that contains all information for intercepting the current object
    let currentObject = (0, _variableJs.globalState).playerSolution.sequence[(0, _variableJs.globalState).interceptionCounter];
    (0, _variableJs.globalState).interceptionFrame += 1;
    let status = "in progress";
    let success = false;
    if ((0, _variableJs.globalState).interceptionFrame == currentMove.timeToIntercept) {
        success = currentMove.success;
        (0, _variableJs.globalState).objects[currentObject].isIntercepted = currentMove.success;
        (0, _variableJs.globalState).interceptionFrame = 0; // reset counter for the next object
        (0, _variableJs.globalState).interceptionCounter += 1;
        if ((0, _variableJs.globalState).interceptionCounter < (0, _variableJs.globalState).playerSolution.moves.length) currentMove = (0, _variableJs.globalState).playerSolution.moves[(0, _variableJs.globalState).interceptionCounter];
        else {
            console.log("Finished with interception sequence");
            status = "finished";
            return [
                status,
                success
            ];
        }
    }
    (0, _variableJs.globalState).player.x += currentMove.dX;
    (0, _variableJs.globalState).player.y += currentMove.dY;
    return [
        status,
        success
    ];
}

},{"../global/constant.js":"hlnpD","../global/variable.js":"aywHw","../global/domElements.js":"iD4j1","./drawing.js":"4xh0b","./gameEvents.js":"6fMdc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lsRQu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "initializeObjects", ()=>initializeObjects);
// Function to initialize the player
parcelHelpers.export(exports, "initializePlayer", ()=>initializePlayer);
var _constantJs = require("../global/constant.js");
var _variableJs = require("../global/variable.js");
var _utilsJs = require("../utils/utils.js");
function initializeObjects(isEasyMode) {
    (0, _variableJs.globalState).objects = [];
    (0, _variableJs.globalState).selectedObjects = []; // Reset selections
    (0, _variableJs.globalState).hoverObjectIndex = -1; // Reset hover index
    const numObjects = (0, _variableJs.globalState).NUM_OBJECTS;
    const specialSpeed = ((0, _constantJs.MAX_SPEED) - (0, _constantJs.MIN_SPEED)) * (0, _constantJs.speedMultiplier) / (0, _constantJs.refreshRate);
    const offsetX = (0, _constantJs.GAME_RADIUS) - (0, _constantJs.GAME_RADIUS) / 5; // Position special objects near the edge
    const specialFinalRadius = Math.abs((0, _variableJs.globalState).centerX - (offsetX - specialSpeed * (0, _constantJs.OBSERVATION_FRAMES)));
    // 1️⃣ **Create two special objects (Left & Right, moving toward the center)**
    if (isEasyMode) createSpecialObjects(specialSpeed, offsetX);
    // 2️⃣ **Create remaining random objects (far from the center, low value)**
    for(let i = isEasyMode ? 2 : 0; i < numObjects; i++){
        let newObject = generateRandomObject(isEasyMode, specialFinalRadius);
        (0, _variableJs.globalState).objects.push(newObject);
    }
}
/**
 * Creates two special objects that move toward the center.
 */ function createSpecialObjects(specialSpeed, offsetX) {
    const specialObjects = [
        {
            x0: (0, _variableJs.globalState).centerX - offsetX,
            dX: specialSpeed,
            y0: (0, _variableJs.globalState).centerY,
            dY: 0
        },
        {
            x0: (0, _variableJs.globalState).centerX + offsetX,
            dX: -specialSpeed,
            y0: (0, _variableJs.globalState).centerY,
            dY: 0
        }
    ];
    for(let i = 0; i < specialObjects.length; i++){
        const { x0, y0, dX, dY } = specialObjects[i];
        (0, _variableJs.globalState).objects.push({
            x0,
            y0,
            radius: 15,
            speed: specialSpeed,
            dX,
            dY,
            value: 0.7,
            isSelected: false,
            selectionIndex: NaN,
            isIntercepted: false,
            index: i
        });
    }
}
/**
 * Generates a random object positioned far from the center.
 */ function generateRandomObject(isEasyMode, specialFinalRadius) {
    let x0, y0, dx, dy, speed;
    let isValid = false;
    do {
        let randomDirection = (0, _variableJs.globalState).randomGenerator() * Math.PI * 2;
        let randomSpeed = (0, _variableJs.globalState).randomGenerator() * ((0, _constantJs.MAX_SPEED) - (0, _constantJs.MIN_SPEED)) + (0, _constantJs.MIN_SPEED);
        let randomRadius = (0, _variableJs.globalState).randomGenerator() * ((0, _constantJs.GAME_RADIUS) * 0.6) + (0, _constantJs.GAME_RADIUS) / 3;
        let randomStartAngle = (0, _variableJs.globalState).randomGenerator() * Math.PI * 2;
        speed = randomSpeed * (0, _constantJs.speedMultiplier) / (0, _constantJs.refreshRate);
        x0 = (0, _variableJs.globalState).centerX + Math.cos(randomStartAngle) * randomRadius;
        y0 = (0, _variableJs.globalState).centerY + Math.sin(randomStartAngle) * randomRadius;
        dx = speed * Math.cos(randomDirection);
        dy = speed * Math.sin(randomDirection);
        // Predict final position to ensure it stays inside bounds
        const finalx = x0 + dx * (0, _constantJs.OBSERVATION_FRAMES);
        const finaly = y0 + dy * (0, _constantJs.OBSERVATION_FRAMES);
        const finalRadius = Math.sqrt((finalx - (0, _variableJs.globalState).centerX) ** 2 + (finaly - (0, _variableJs.globalState).centerY) ** 2);
        isValid = isEasyMode ? finalRadius > specialFinalRadius + 50 && finalRadius < (0, _constantJs.GAME_RADIUS) - 50 : finalRadius > 100 && finalRadius < (0, _constantJs.GAME_RADIUS) - 50;
    }while (!isValid);
    let value = (0, _utilsJs.sampleBeta)((0, _constantJs.alphaParam), (0, _constantJs.betaParam)); // Random value between 0 and 1
    if (isEasyMode) value *= 0.5; // Ensure value < 0.5 for easy mode
    return {
        x0,
        y0,
        radius: 15,
        speed,
        dX: dx,
        dY: dy,
        value,
        isSelected: false,
        selectionIndex: NaN,
        isIntercepted: false,
        index: (0, _variableJs.globalState).objects.length
    };
}
function initializePlayer() {
    let randomDirection;
    let randomSpeed, randomRadius, randomStartAngle;
    let x0, y0, dx, dy, speed, finalx, finaly;
    x0 = (0, _variableJs.globalState).centerX;
    y0 = (0, _variableJs.globalState).centerY;
    //randomSpeed = randomGenerator() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED; // Speed between 50 and 100
    randomSpeed = (0, _constantJs.MAX_SPEED);
    speed = randomSpeed * (0, _constantJs.speedMultiplier) / (0, _constantJs.refreshRate);
    dx = 0;
    dy = 0;
    (0, _variableJs.globalState).player = {
        x0: x0,
        y0: y0,
        radius: 15,
        speed: speed,
        dX: dx,
        dY: dy,
        x: x0,
        y: y0
    };
}

},{"../global/constant.js":"hlnpD","../global/variable.js":"aywHw","../utils/utils.js":"5sJZc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aDgsz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// Function to handle mouse hover
parcelHelpers.export(exports, "handleMouseHover", ()=>handleMouseHover);
// Function to handle object selection
parcelHelpers.export(exports, "handleObjectSelection", ()=>handleObjectSelection);
var _variable = require("../global/variable");
var _drawing = require("./drawing");
var _domElements = require("../global/domElements");
var _gameEvents = require("./gameEvents");
function handleMouseHover(event) {
    const rect = (0, _domElements.canvas).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    (0, _variable.globalState).hoverObjectIndex = (0, _variable.globalState).objects.findIndex((object)=>Math.hypot(mouseX - object.x, mouseY - object.y) <= object.radius);
    (0, _drawing.clearCanvas)();
    (0, _drawing.drawGameCircle)();
    (0, _drawing.drawObjects)();
    (0, _drawing.drawPlayer)();
}
function handleObjectSelection(event) {
    const rect = (0, _domElements.canvas).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    for (let object of (0, _variable.globalState).objects){
        const distance = Math.hypot(mouseX - object.x, mouseY - object.y);
        if (distance <= object.radius && !object.isSelected && (0, _variable.globalState).selectedObjects.length < (0, _variable.globalState).NUM_SELECTIONS) {
            object.isSelected = true;
            object.selectionIndex = (0, _variable.globalState).selectedObjects.length;
            (0, _variable.globalState).selectedObjects.push(object.index); // store the index of the object
            (0, _drawing.drawObjects)();
            (0, _domElements.replayButton).disabled = true; // Disables the button
            (0, _domElements.reselectButton).style.display = "block";
            (0, _domElements.reselectButton).disabled = false;
            if ((0, _variable.globalState).selectedObjects.length === (0, _variable.globalState).NUM_SELECTIONS) {
                (0, _domElements.canvas).removeEventListener("click", handleObjectSelection);
                (0, _domElements.canvas).removeEventListener("mousemove", handleMouseHover);
                (0, _domElements.interceptionButton).style.display = "block";
            }
            break;
        }
    }
}

},{"../global/variable":"aywHw","./drawing":"4xh0b","../global/domElements":"iD4j1","./gameEvents":"6fMdc","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["gLLPy"], "gLLPy", "parcelRequire94c2")

//# sourceMappingURL=index.cbb1cd4b.js.map
