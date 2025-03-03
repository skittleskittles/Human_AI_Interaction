// To do:
// Drop the arrows. Instead, replay the demonstration sequence but in faded colors. Player should be able 
// to select stationary objects that show the last position of the objects

// Get references to the canvas, context, info div, and start buttons
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const startButton = document.getElementById('startButton');
const interceptionButton = document.getElementById('interceptionButton'); // Reference to interception button

// Global variables for random generator (implements deterministic sequence that can be recreated in other languages)
let randomGenerator;

// Global settings
const ROUND_DURATION = 2000; // Duration of the round in milliseconds
const INTERCEPTION_DURATION = 2000; // Interception sequence duration in milliseconds
const NUM_OBJECTS = 10; // Number of animated objects
const MAX_SELECTIONS = 4; // Maximum number of objects to select
const GAME_RADIUS = 400; // Radius of game circle
let animationFrameId;
let animationStartTime;
let objects = []; // Array to hold object properties
let selectedObjects = []; // Tracks selected objects for interception sequence
let hoverObjectIndex = -1; // Tracks which object is being hovered over
let refreshRate = 60; // Default refresh rate
let speedMultiplier = 1; // Multiplier to adjust speed based on refresh rate

// Function to initialize the animated objects
function initializeObjects() {
    objects = [];
    selectedObjects = []; // Reset selections
    hoverObjectIndex = -1; // Reset hover index
    for (let i = 0; i < NUM_OBJECTS; i++) {
        const randomAngle = randomGenerator() * Math.PI * 2;
        const randomSpeed = randomGenerator() * 50 + 50; // Speed between 50 and 100
        const fillValue = randomGenerator(); // Random value between 0 and 1
        objects.push({
            x: canvas.width / 2 + Math.cos(randomAngle) * 200, // Random starting position within the circle
            y: canvas.height / 2 + Math.sin(randomAngle) * 200,
            radius: 20, // Radius of each animated object
            speedX: (randomGenerator() < 0.5 ? -1 : 1) * randomSpeed,
            speedY: (randomGenerator() < 0.5 ? -1 : 1) * randomSpeed,
            fillValue: fillValue, // Determines the fraction of the object to fill
            isSelected: false, // Tracks if this object has been selected
        });
    }
}


// Function to animate the objects during the main round
function animateObjects(timestamp) {
    if (!animationStartTime) {
        animationStartTime = timestamp;
    }
    const elapsed = timestamp - animationStartTime;

    // Update positions of objects
    updateObjectPositions();

    // Clear and redraw canvas
    clearCanvas();
    drawGameCircle();
    drawObjects();

    // Continue animating if the round duration has not elapsed
    if (elapsed < ROUND_DURATION) {
        animationFrameId = requestAnimationFrame(animateObjects);
    } else {
        // End the animation and allow user to select objects
        endRound();
    }
}
// Function to start the round
function startRound() {
    // Hide the start round button
    startButton.style.display = 'none';
    startButton.blur();

    // Update the info div
    info.innerHTML = '<p>Example sequence in progress...</p>';

    // Initialize the objects
    initializeObjects();

    // Start the animation
    animationStartTime = null; // Reset the start time
    animationFrameId = requestAnimationFrame(animateObjects);
}

// Function to start the interception sequence
function startInterceptionSequence() {
    interceptionButton.style.display = 'none'; // Hide the interception button

    info.innerHTML = '<p>Interception sequence in progress...</p>';

    // Reset animation start time and resume animation
    animationStartTime = null;
    animationFrameId = requestAnimationFrame((timestamp) => {
        animateInterception(timestamp, INTERCEPTION_DURATION);
    });
}


// Function to handle the interception animation
function animateInterception(timestamp, duration) {
    if (!animationStartTime) {
        animationStartTime = timestamp;
    }
    const elapsed = timestamp - animationStartTime;

    // Update positions of objects
    updateObjectPositions();

    // Clear and redraw canvas
    clearCanvas();
    drawGameCircle();
    drawObjects();

    // Continue animating if duration not yet elapsed
    if (elapsed < duration) {
        animationFrameId = requestAnimationFrame((ts) =>
            animateInterception(ts, duration)
        );
    } else {
        // End the interception sequence
        cancelAnimationFrame(animationFrameId);
        startButton.style.display = 'block'; // Show the start round button
        info.innerHTML = '<p>Interception complete. Start the next round.</p>';
    }
}

// Function to update object positions
function updateObjectPositions() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    objects.forEach((object) => {
        // Update object's position based on its speed
        object.x += (object.speedX * speedMultiplier) / refreshRate;
        object.y += (object.speedY * speedMultiplier) / refreshRate;

        // Check for collisions with the boundary of the main object
        const distanceFromCenter = Math.hypot(object.x - centerX, object.y - centerY);
        if (distanceFromCenter + object.radius > 400) {
            const angle = Math.atan2(object.y - centerY, object.x - centerX);
            object.speedX = -Math.cos(angle) * Math.abs(object.speedX);
            object.speedY = -Math.sin(angle) * Math.abs(object.speedY);
        }
    });
}

// Function to end the round and allow user interaction
function endRound() {
    cancelAnimationFrame(animationFrameId);
    info.innerHTML = `<p>Click on ${MAX_SELECTIONS} objects to determine the order of interception.<br>The goal is to maximize the number of points of intercepted objects</p>`;
    canvas.addEventListener('click', handleObjectSelection);
    canvas.addEventListener('mousemove', handleMouseHover);
}



// Initial setup
async function initGame(seed) {
    randomGenerator = lcg(seed); // Initialize random generator with the provided seed
    //info.innerHTML = '<p>Measuring display refresh rate...</p>';
    refreshRate = 60; // Set refresh rate manually
    //info.innerHTML = `<p>Refresh rate detected: ${refreshRate} Hz. Press the button to start the game.</p>`;
    info.innerHTML = `<p>Press the button to start. Please observe the sequence carefully.</p>`;
    clearCanvas();
    drawGameCircle();
    startButton.style.display = 'block';
    startButton.blur();
}

// Start initialization on page load with a seed
initGame(12345); // Replace 12345 with any desired seed

// Add event listeners to buttons
startButton.addEventListener('click', startRound);
interceptionButton.addEventListener('click', startInterceptionSequence);
