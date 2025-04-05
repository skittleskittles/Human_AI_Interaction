import { feedbackContainer } from "./data/domElements";
import { globalState } from "./data/variable";
import { User } from "./logic/collectData";
import { getCurrentDate } from "./utils/utils";
import { saveFeedbackData } from "./firebase/saveData2Firebase";

export function showFeedback() {
  // Fetch and insert feedback form dynamically
  fetch("feedback.html")
    .then((response) => response.text())
    .then((html) => {
      feedbackContainer.innerHTML = html;
      feedbackContainer.style.display = "block";

      const aiFeedback = document.getElementById("aiFeedback");
      const freeResponse = document.getElementById("freeResponse");
      const charCount = document.getElementById("charCount");
      const submitFeedback = document.getElementById("submitFeedback");
      const radioGroups = document.querySelectorAll("input[type='radio']");
      const thankYouMessage = document.getElementById("thankYouMessage");

      if (globalState.AI_HELP !== 0) {
        aiFeedback.style.display = "block";
      }

      function checkFormCompletion() {
        const requiredFields =
          globalState.AI_HELP === 0
            ? ["1-1", "1-2", "1-3", "1-4"] // Minimum required fields when AI is not used
            : [...new Set([...radioGroups].map((r) => r.name))]; // All fields if AI is used

        // Check if all required fields have a selected value
        const allSelected = requiredFields.every((name) =>
          document.querySelector(`input[name="${name}"]:checked`)
        );

        // Enable or disable the submit button based on completion status
        submitFeedback.disabled = !allSelected;
      }
      radioGroups.forEach((radio) => {
        radio.addEventListener("change", checkFormCompletion);
      });

      if (freeResponse && charCount) {
        freeResponse.addEventListener("input", () => {
          charCount.textContent = `${freeResponse.value.length} / 500`;
        });
      }

      if (submitFeedback) {
        submitFeedback.disabled = true;
        submitFeedback.addEventListener("click", () =>
          submit(freeResponse, submitFeedback, thankYouMessage)
        );
      }
    });
}

async function submit(freeResponse, submitButton, thankYouMessage) {
  const now = getCurrentDate();

  let freeResponseText = freeResponse.value.trim();
  let feedbackData = {
    choices: {},
    freeResponse: freeResponseText,
    submittedAt: now,
  };

  // Update local user end_time
  User.end_time = now;

  let radioGroups = document.querySelectorAll("input[type='radio']:checked");
  radioGroups.forEach((radio) => {
    feedbackData.choices[radio.name] = radio.value;
  });

  submitButton.disabled = true;
  thankYouMessage.style.display = "block";

  console.log("📌 User Feedback:", feedbackData);

  // Save feedback data
  await saveFeedbackData(feedbackData);

  // todo: redirect to prolific
}
