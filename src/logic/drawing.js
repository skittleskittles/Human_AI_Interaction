import { ARROW_FACTOR, GAME_RADIUS, playerImage } from "../data/constant.js";
import { globalState } from "../data/variable.js";
import { canvas, ctx } from "../data/domElements.js";

// Function to draw arrows indicating direction and speed
function drawArrows() {
  globalState.objects.forEach((object) => {
    if (!object.isIntercepted) {
      const arrowLength =
        object.speed * globalState.speedMultiplier * ARROW_FACTOR; // Scale speed for arrow length
      const angle = Math.atan2(object.dY, object.dX);

      const startX = object.x;
      const startY = object.y;
      const endX = startX + arrowLength * Math.cos(angle);
      const endY = startY + arrowLength * Math.sin(angle);

      // Draw the main arrow line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "gray";
      ctx.stroke();

      // Draw the arrowhead
      const arrowheadLength = 12;
      const arrowheadAngle = Math.PI / 6;

      const leftX = endX - arrowheadLength * Math.cos(angle - arrowheadAngle);
      const leftY = endY - arrowheadLength * Math.sin(angle - arrowheadAngle);

      const rightX = endX - arrowheadLength * Math.cos(angle + arrowheadAngle);
      const rightY = endY - arrowheadLength * Math.sin(angle + arrowheadAngle);

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(leftX, leftY);
      ctx.lineTo(rightX, rightY);
      ctx.closePath();
      ctx.fillStyle = "gray";
      ctx.fill();
    }
  });
}

function drawPlayerArrow() {
  // Draw the player arrow
  const arrowLength =
    globalState.player.speed * globalState.speedMultiplier * ARROW_FACTOR; // Scale speed for arrow length

  const angle = Math.atan2(globalState.player.dY, globalState.player.dX);

  const startX = globalState.player.x;
  const startY = globalState.player.y;
  const endX = startX + arrowLength * Math.cos(angle);
  const endY = startY + arrowLength * Math.sin(angle);

  // Draw the main arrow line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "gray";
  ctx.stroke();

  // Draw the arrowhead
  const arrowheadLength = 12;
  const arrowheadAngle = Math.PI / 6;

  const leftX = endX - arrowheadLength * Math.cos(angle - arrowheadAngle);
  const leftY = endY - arrowheadLength * Math.sin(angle - arrowheadAngle);

  const rightX = endX - arrowheadLength * Math.cos(angle + arrowheadAngle);
  const rightY = endY - arrowheadLength * Math.sin(angle + arrowheadAngle);

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fillStyle = "gray";
  ctx.fill();
}

// Function to draw all animated objects
export function drawObjects() {
  globalState.objects.forEach((object, index) => {
    if (!object.isIntercepted) {
      // Highlight object if hovered
      if (index === globalState.hoverObjectIndex) {
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Glow effect
        ctx.fill();
      }

      // Draw the object's filled area
      ctx.beginPath();
      ctx.arc(object.x, object.y, object.radius * object.value, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      // Set text alignment and baseline for centering
      if (globalState.isDebugMode) {
        ctx.textAlign = "center"; // Aligns text horizontally to the center
        ctx.textBaseline = "middle"; // Aligns text vertically to the center
        ctx.fillStyle = "rgb(0, 0, 0)";
        let fontSize = 20;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(index, object.x, object.y);
      }

      // Draw the object's border
      ctx.beginPath();
      ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      //ctx.fillStyle = 'rgba(14, 13, 13, 0.3)'; // Glow effect
      ctx.strokeStyle = "red";
      ctx.stroke();
      //ctx.fill();

      // Draw selection number if selected
      if (object.isSelected) {
        const selectionIndex = object.selectionIndex;
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        ctx.fillText(
          selectionIndex + 1,
          object.x + object.radius + 14,
          object.y + 8
        );
      }

      if (globalState.canShowAIAnswer) {
        let AISelectionIndex = globalState.bestSolution.sequence.indexOf(index);
        if (AISelectionIndex !== -1) {
          ctx.fillStyle = "blue";
          ctx.font = "24px Arial";
          ctx.fillText(
            AISelectionIndex + 1,
            object.x - object.radius - 20,
            object.y + 8
          );
        }
      }

      // For debugging
      if (!true) {
        ctx.fillStyle = "red";
        ctx.font = "24px Arial";
        ctx.fillText(index, object.x + object.radius + 10, object.y + 14);
      }
    }
  });

  // Draw arrows for all objects
  drawArrows();
}

function drawPlayer() {
  // Draw the player image
  if (playerImage.complete && playerImage.naturalWidth !== 0) {
    // Ensure the image is loaded before drawing
    const imageWidth = 50; // Adjust the size of the image
    const imageHeight = 50;
    ctx.drawImage(
      playerImage,
      globalState.player.x - imageWidth / 2,
      globalState.player.y - imageHeight / 2,
      imageWidth,
      imageHeight
    );
  } else {
    // Fallback in case the image hasn't loaded yet
    ctx.beginPath();
    ctx.arc(
      globalState.player.x,
      globalState.player.y,
      globalState.player.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "blue";
    ctx.fill();
  }

  // Draw arrows for player
  //drawPlayerArrow();

  // Visualize interception position (for debugging)
  if (!true) {
    if (globalState.userSolution) {
      let currentMove =
        globalState.userSolution.moves[globalState.interceptionCounter]; // object that contains all information for intercepting the current object
      ctx.beginPath();
      ctx.arc(
        currentMove.interceptPosX,
        currentMove.interceptPosY,
        15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "blue";
      ctx.fill();
    }
  }
}

// Function to draw the main circle
export function drawGameCircle() {
  globalState.centerX = canvas.width / 2;
  globalState.centerY = canvas.height / 2;

  ctx.save(); // Save the current canvas state
  ctx.beginPath();
  ctx.arc(
    globalState.centerX,
    globalState.centerY,
    GAME_RADIUS,
    0,
    Math.PI * 2
  ); // Define the clipping path
  ctx.clip(); // Apply clipping to restrict drawings to this area

  // Draw the main circle
  ctx.beginPath();
  ctx.arc(
    globalState.centerX,
    globalState.centerY,
    GAME_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

// Function to clear the canvas
export function clearCanvas() {
  ctx.restore(); // Restore to the original canvas state
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function redrawAll() {
  clearCanvas();
  drawGameCircle();
  drawObjects();
  drawPlayer();
}
