import { startGame } from ".";
import {
  experimentContainer,
  consentContainer,
  modalContainer,
  infoContent,
} from "./data/domElements";
import { globalState } from "./data/variable";
import {
  clearCanvas,
  drawGameCircle,
  drawObjects,
  drawPlayer,
} from "./logic/drawing";
import { initializeObjects, initializePlayer } from "./logic/initialize";

export function showConsent() {
  fetch("consent.html")
    .then((response) => response.text())
    .then((html) => {
      consentContainer.innerHTML = html;

      const checkbox = document.getElementById("confirmParticipation");
      const proceedButton = document.getElementById("proceedButton");

      checkbox.addEventListener("change", function () {
        proceedButton.disabled = !this.checked;
      });

      proceedButton.addEventListener("click", function () {
        consentContainer.style.display = "none";
        experimentContainer.style.display = "block";
        globalState.isEasyMode = true;
        showEnterEducationTrials();
        startGame();
      });
    });
}

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
          globalState.canShowAnswer = true;
          initializeObjects(globalState.isEasyMode, globalState.needRetry);
          initializePlayer();
          clearCanvas();
          drawGameCircle();
          drawObjects();
          drawPlayer();
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
            Congratulations! You have completed all the trial rounds. 
            Now, proceed to the main game.
          </p>`;
  document.getElementById("modalOverlay").style.display = "flex";
}
