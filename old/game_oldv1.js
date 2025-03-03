// Get references to the canvas, context, info div, and start button
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const startButton = document.getElementById('startButton');

// Global settings
const ROUND_DURATION = 5000; // Duration of the round in milliseconds
const NUM_CIRCLES = 10; // Number of animated circles
const MAX_SELECTIONS = 3; // Maximum number of circles to select
let animationFrameId;
let animationStartTime;
let circles = []; // Array to hold circle properties
let selectedCircles = []; // Tracks selected circles for interception sequence
let hoverCircleIndex = -1; // Tracks which circle is being hovered over
let refreshRate = 60; // Default refresh rate
let speedMultiplier = 1; // Multiplier to adjust speed based on refresh rate

// Function to initialize the animated circles
function initializeCircles() {
    circles = [];
    selectedCircles = []; // Reset selections
    hoverCircleIndex = -1; // Reset hover index
    for (let i = 0; i < NUM_CIRCLES; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomSpeed = Math.random() * 50 + 50; // Speed between 50 and 100
        const fillValue = Math.random(); // Random value between 0 and 1
        circles.push({
            x: canvas.width / 2 + Math.cos(randomAngle) * 200, // Random starting position within the circle
            y: canvas.height / 2 + Math.sin(randomAngle) * 200,
            radius: 20, // Radius of each animated circle
            speedX: (Math.random() < 0.5 ? -1 : 1) * randomSpeed,
            speedY: (Math.random() < 0.5 ? -1 : 1) * randomSpeed,
            fillValue: fillValue, // Determines the fraction of the circle to fill
            isSelected: false, // Tracks if this circle has been selected
        });
    }
}

// Function to draw the main circle
function drawCircle() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 400;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to draw all animated circles
function drawCircles() {
    circles.forEach((circle, index) => {
        // Highlight circle if hovered
        if (index === hoverCircleIndex) {
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius + 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Glow effect
            ctx.fill();
        }

        // Draw the circle's filled area
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius * circle.fillValue, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();

        // Draw the circle's border
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // Draw selection number if selected
        if (circle.isSelected) {
            const selectionIndex = selectedCircles.indexOf(circle);
            ctx.fillStyle = 'black';
            ctx.font = '24px Arial'; // Increased font size for better visibility
            ctx.fillText(selectionIndex + 1, circle.x + circle.radius + 10, circle.y + 8);
        }
    });
}

// Function to handle the animation
function animateCircles(timestamp) {
    if (!animationStartTime) {
        animationStartTime = timestamp;
    }
    const elapsed = timestamp - animationStartTime;

    // Clear the canvas and redraw the main circle
    clearCanvas();
    drawCircle();

    // Update positions of circles
    for (let circle of circles) {
        circle.x += (circle.speedX * speedMultiplier) / refreshRate;
        circle.y += (circle.speedY * speedMultiplier) / refreshRate;

        // Check for boundary collisions with the main circle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const distanceFromCenter = Math.hypot(circle.x - centerX, circle.y - centerY);
        if (distanceFromCenter + circle.radius > 400) {
            const angle = Math.atan2(circle.y - centerY, circle.x - centerX);
            circle.speedX = -Math.cos(angle) * Math.abs(circle.speedX);
            circle.speedY = -Math.sin(angle) * Math.abs(circle.speedY);
        }
    }

    // Draw all circles
    drawCircles();

    // Continue the animation if less than ROUND_DURATION has passed
    if (elapsed < ROUND_DURATION) {
        animationFrameId = requestAnimationFrame(animateCircles);
    } else {
        // End the animation and allow user to select circles
        endRound();
    }
}

// Function to start the round
function startRound() {
    // Hide the button
    startButton.style.display = 'none';
    startButton.blur();

    // Update the info div
    info.innerHTML = '<p>Round in progress...</p>';

    // Initialize the circles
    initializeCircles();

    // Start the animation
    animationStartTime = null; // Reset the start time
    animationFrameId = requestAnimationFrame(animateCircles);
}

// Function to end the round and allow user interaction
function endRound() {
    cancelAnimationFrame(animationFrameId);
    info.innerHTML = '<p>Select 3 circles to determine the interception sequence.</p>';
    canvas.addEventListener('click', handleCircleSelection);
    canvas.addEventListener('mousemove', handleMouseHover);
}

// Function to handle circle selection
function handleCircleSelection(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let circle of circles) {
        const distance = Math.hypot(mouseX - circle.x, mouseY - circle.y);
        if (distance <= circle.radius && !circle.isSelected && selectedCircles.length < MAX_SELECTIONS) {
            circle.isSelected = true;
            selectedCircles.push(circle);
            drawCircles();

            if (selectedCircles.length === MAX_SELECTIONS) {
                canvas.removeEventListener('click', handleCircleSelection);
                canvas.removeEventListener('mousemove', handleMouseHover);
                startRound();
            }
            break;
        }
    }
}

// Function to handle mouse hover
function handleMouseHover(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    hoverCircleIndex = circles.findIndex(
        (circle) => Math.hypot(mouseX - circle.x, mouseY - circle.y) <= circle.radius
    );

    clearCanvas();
    drawCircle();
    drawCircles();
}

// Initial setup
async function initGame() {
    info.innerHTML = '<p>Measuring display refresh rate...</p>';
    await measureRefreshRate();
    info.innerHTML = `<p>Refresh rate detected: ${refreshRate} Hz. Press the button to start the game.</p>`;
    clearCanvas();
    drawCircle();
    startButton.style.display = 'block';
    startButton.blur();
}

// Function to measure the refresh rate
function measureRefreshRate() {
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

            if (frameTimestamps.length < measureDuration / 16.67) { // Approximately 60 frames
                requestAnimationFrame(measureFrame);
            } else {
                const avgFrameDuration =
                    frameTimestamps.reduce((sum, time) => sum + time, 0) / frameTimestamps.length;
                refreshRate = Math.round(1000 / avgFrameDuration) || 60;
                speedMultiplier = refreshRate / 60;
                resolve(refreshRate);
            }
        }
        requestAnimationFrame(measureFrame);
    });
}

// Start initialization on page load
initGame();

// Add event listener to the start button
startButton.addEventListener('click', startRound);
