import { showInstructions } from "./instructions";
import { consentContainer } from "./data/domElements";
import { getCurrentDate } from "./utils/utils.js";
import { User } from "./logic/collectData.js";

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
        User.is_consent = true;
        import("./firebase/saveData2Firebase.js").then((module) => {
          module.saveOrUpdateUser(getCurrentDate()); // update user data
        });
        showInstructions();
      });
    });
}
