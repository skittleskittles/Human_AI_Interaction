// Import core Firebase services
import { initializeApp } from "firebase/app";

// Import Firestore
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Import Authentication
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { User, getCurrentExperimentData } from "../logic/collectData";

import { getCurrentDate } from "../utils/utils";
import { globalState } from "../data/variable";

const firebaseConfig = {
  apiKey: "AIzaSyD3a4Fpidhih8x1piqgojtVt5pV-Nz1b0E",
  authDomain: "human-ai-interaction-a1355.firebaseapp.com",
  projectId: "human-ai-interaction-a1355",
  storageBucket: "human-ai-interaction-a1355.firebasestorage.app",
  messagingSenderId: "695175357546",
  appId: "1:695175357546:web:cea7b036fe881e1d5a5613",
};

// Initialize App
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export var firebaseUserId = "not initialized yet";

await signInAnonymously(auth)
  .then(() => {
    //console.log( "Firebase authentication successful...")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const msg =
      "Firebase authentication failed. Errorcode: " +
      errorCode +
      " : " +
      errorMessage;
    //console.error( msg );
    throw msg;
  });

await onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    firebaseUserId = user.uid;
    //console.log( "User is signed in. Firebase user id=" + firebaseUserId );
  } else {
    // User is signed out
    //console.log( "User is signed out" );
  }
});

/**
 * Main function: Save single trial or just update end_times
 */
export async function saveSingleTrial(trial, isPassAllExperiment) {
  try {
    const endTime = trial?.end_time || getCurrentDate();
    const userDocRef = await saveOrUpdateUser(endTime, isPassAllExperiment);

    // Determine experiment source
    const experiment = getCurrentExperimentData();
    if (!experiment) {
      console.warn("⚠️ No experiment found. Skipping experiment update.");
      return;
    }

    const expRef = await saveOrUpdateExperiment(
      userDocRef,
      experiment,
      endTime,
      trial?.trial_id == experiment.num_trials
    );

    if (!trial) {
      console.warn("⚠️ Trial is null or undefined. Skipped saving trial data.");
      return;
    }

    await saveTrialData(expRef, trial);
    console.log(
      `✅ Trial ${trial.trial_id} saved for user ${User.prolific_pid}.`
    );
  } catch (error) {
    console.error("❌ Failed to save trial:", error);
  }
}

/**
 *  Save or update the user document
 */
async function saveOrUpdateUser(endTime, isPassAllExperiment) {
  const userDocRef = doc(db, "users", User.prolific_pid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      prolific_pid: User.prolific_pid,
      create_time: User.create_time,
      end_time: endTime,
      is_pass: isPassAllExperiment,
    });
  } else {
    await updateDoc(userDocRef, {
      end_time: endTime,
      is_pass: isPassAllExperiment,
    });
  }
  console.log(`✅ User ${User.prolific_pid} updated.`);
  return userDocRef;
}

/**
 *  Save or update the experiment document
 */
async function saveOrUpdateExperiment(
  userDocRef,
  experiment,
  endTime,
  isFinished
) {
  const expRef = doc(
    collection(userDocRef, "experiments"),
    `${experiment.experiment_id}`
  );
  const expDocSnap = await getDoc(expRef);

  if (!expDocSnap.exists()) {
    await setDoc(expRef, {
      experiment_id: experiment.experiment_id,
      create_time: experiment.create_time,
      end_time: endTime,
      num_trials: experiment.num_trials,
      is_finished: isFinished,
    });
  } else {
    await updateDoc(expRef, {
      end_time: endTime,
      is_finished: isFinished,
    });
  }
  console.log(
    `✅ Experiment ${experiment.experiment_id} for User ${User.prolific_pid} updated.`
  );
  return expRef;
}

/**
 * Save the trial data under the experiment
 */
async function saveTrialData(expRef, trial) {
  const trialRef = doc(collection(expRef, "trials"), `${trial.trial_id}`);
  const isAttentionCheck = trial.trial_id in globalState.ATTENTION_CHECK_TRIALS;
  await setDoc(trialRef, {
    trial_id: trial.trial_id,
    is_attention_check: isAttentionCheck,
    create_time: trial.create_time,
    end_time: trial.end_time,
    performance: trial.performance,
    user_score: trial.user_score,
    best_score: trial.best_score,
    replay_num: trial.replay_num,
    reselect_num: trial.reselect_num,
    think_time: trial.think_time,
    total_time: trial.total_time,
    ai_choice: trial.ai_choice,
    best_choice: trial.best_choice,
    user_choice: trial.user_choice,
  });
}

/**
 * Save user feedback to Firestore under subcollection `feedback`.
 * @param {Object} feedbackData
 */
export async function saveFeedbackData(feedbackData) {
  try {
    const userRef = doc(db, "users", User.prolific_pid);
    const feedbackRef = doc(collection(userRef, "feedback"), "feedback_main");

    // ✅ Save feedback + update user end_time
    await Promise.all([
      setDoc(feedbackRef, {
        ...feedbackData,
      }),
      updateDoc(userRef, {
        end_time: User.end_time,
      }),
    ]);

    console.log("✅ Feedback saved and end_time updated in Firestore.");
  } catch (error) {
    console.error("❌ Failed to save feedback:", error);
  }
}
