import {
  instructionsContainer,
  modalContainer,
  infoContent,
  experimentContainer,
} from "./data/domElements";
import { globalState } from "./data/variable";
import { startGame } from ".";
import { redrawAll } from "./logic/drawing";
import { initializeObjects, initializePlayer } from "./logic/initialize";
import { getCurrentDate } from "./utils/utils.js";

/*
--------------------------------------------------------------------------------------

    Instructions page (videos and images)

--------------------------------------------------------------------------------------
*/

export function showInstructions() {
  fetch("instructions.html")
    .then((response) => response.text())
    .then((html) => {
      loadInstructionsHTML(html);
      initializeInstructionState();
      setupInstructionNavigation();
      showInstructionPage(currentPage);
    });
}

let currentPage = 1;
const totalPages = 8;
const unlockedPages = new Set();
let timer = null;
let countdownInterval = null;
let originalNextText = "Next";

function loadInstructionsHTML(html) {
  instructionsContainer.innerHTML = html;
  instructionsContainer.style.display = "block";
}

function initializeInstructionState() {
  currentPage = 1;
  unlockedPages.clear();
}

function setupInstructionNavigation() {
  const prevButton = document.getElementById("prevInstructionBtn");
  const nextButton = document.getElementById("nextInstructionBtn");

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showInstructionPage(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    const page = document.getElementById(`instructionPage-${currentPage}`);
    const video = page?.querySelector("video");

    if (nextButton.dataset.locked === "true") {
      if (video) {
        showNextTooltip("Please watch full video to continue");
      }
      return;
    }
    if (currentPage < totalPages) {
      currentPage++;
      showInstructionPage(currentPage);
    } else {
      instructionsContainer.style.display = "none";
      experimentContainer.style.display = "block";
      globalState.isEasyMode = true;
      showEnterEducationTrials();
      startGame();
      // update user data before enter eduation trials
      import("./firebase/saveData2Firebase.js").then((module) => {
        module.saveOrUpdateUser(getCurrentDate());
      });
    }
  });
}

function showNextTooltip(message) {
  const tooltip = document.getElementById("nextTooltip");
  tooltip.textContent = message;
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";

  setTimeout(() => {
    tooltip.style.opacity = "0";
    setTimeout(() => {
      tooltip.style.display = "none";
    }, 300);
  }, 3000);
}

function showInstructionPage(index) {
  if (timer) clearTimeout(timer);
  if (countdownInterval) clearInterval(countdownInterval);

  for (let i = 1; i <= totalPages; i++) {
    document.getElementById(`instructionPage-${i}`)?.classList.remove("active");
  }
  document.getElementById(`instructionPage-${index}`)?.classList.add("active");

  const prevButton = document.getElementById("prevInstructionBtn");
  const nextButton = document.getElementById("nextInstructionBtn");

  prevButton.hidden = index === 1;
  nextButton.textContent = index === totalPages ? "Start" : originalNextText;

  handleInstructionUnlock(index);
}

function handleInstructionUnlock(pageIndex) {
  const nextButton = document.getElementById("nextInstructionBtn");
  if (unlockedPages.has(pageIndex)) {
    nextButton.classList.remove("disabled-visual");
    nextButton.dataset.locked = "false";
    nextButton.textContent =
      currentPage === totalPages ? "Start" : originalNextText;
    return;
  }

  const page = document.getElementById(`instructionPage-${pageIndex}`);
  const video = page?.querySelector("video");
  nextButton.classList.add("disabled-visual");
  nextButton.dataset.locked = "true";

  if (video) {
    const onEnded = () => {
      nextButton.classList.remove("disabled-visual");
      nextButton.dataset.locked = "false";
      nextButton.textContent =
        currentPage === totalPages ? "Start" : originalNextText;
      unlockedPages.add(pageIndex);
      video.removeEventListener("ended", onEnded);
    };
    video.addEventListener("ended", onEnded);
  } else {
    if (timer) clearTimeout(timer);
    if (countdownInterval) clearInterval(countdownInterval);
    let remaining = 5;
    nextButton.textContent = `${originalNextText} (${remaining})`;

    countdownInterval = setInterval(() => {
      remaining--;
      nextButton.textContent = `${originalNextText} (${remaining})`;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        nextButton.classList.remove("disabled-visual");
        nextButton.dataset.locked = "false";
        nextButton.textContent =
          currentPage === totalPages ? "Start" : originalNextText;
        unlockedPages.add(pageIndex);
      }
    }, 1000);
  }
}
/*
--------------------------------------------------------------------------------------

    Education rounds

--------------------------------------------------------------------------------------
*/
export function showEnterEducationTrials() {
  fetch("modal.html")
    .then((response) => response.text())
    .then((html) => {
      modalContainer.innerHTML = html;
      modalContainer.style.display = "block";

      const modalInfo = document.getElementById("modalInfo");
      modalInfo.innerHTML = `<p>
          Now, you will play ${globalState.NUM_EDUCATION_TRIALS} trial rounds. Please carefully read the
          instructions and make your choices.
        </p>`;

      // Select the dynamically inserted elements
      const modal = document.getElementById("modalOverlay");
      const closeModal = document.getElementById("closeModal");

      // Show the modal when the page loads
      modal.style.display = "flex";

      // Close modal when clicking the "OK" button
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        if (globalState.needRetry) {
          globalState.canShowAIAnswer = true;
          initializeObjects(globalState.isEasyMode, globalState.needRetry);
          initializePlayer();
          redrawAll();
          infoContent.innerHTML = `<p>
            You did not select the best answers. <br/>
            The best answers are displayed as blue numbers. <br/>
            Please carefully try again in the next sequence.
          </p>`;
        }
      });
    });
}

export function showEnterRetryTrials() {
  modalContainer.style.display = "block";
  const modalInfo = document.getElementById("modalInfo");
  modalInfo.innerHTML = `<p>
            You did not select the best answers. <br/>
            The best answers will be shown in blue.
            Please try again.<br/>
            Note: Your can earn partial score for missed interceptions.
          </p>`;
  document.getElementById("modalOverlay").style.display = "flex";
}

export function showEndGame() {
  modalContainer.style.display = "block";
  const modalInfo = document.getElementById("modalInfo");
  modalInfo.innerHTML = `<p>
             Unfortunately, you did not pass the trial rounds. The game is now over.
            </p>`;
  document.getElementById("modalOverlay").style.display = "flex";
}

export function showEnterMainGame() {
  console.log("show enter main game");
  modalContainer.style.display = "block";
  const modalInfo = document.getElementById("modalInfo");
  modalInfo.innerHTML = `<p>
            Congratulations! You have completed all the trial rounds. <br/>
            Now, proceed to the main game.
          </p>`;
  document.getElementById("modalOverlay").style.display = "flex";
}
