import { startGame } from ".";
import { experimentContainer, consentContainer } from "./data/domElements";

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
        startGame();
      });
    });
}
